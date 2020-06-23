import request                            from "request-json";
import {formatDate, getTimeSpanParameter} from "../utils";
import Room                               from "../../api/rooms/model";
import Price                              from "../../api/prices/model";

const engineApiUrl = "https://engine.pricenow.ch/api/v2/";
const apiUrl = "https://api.pricenow.ch/";

const engineApiClient = request.createClient(engineApiUrl);
const apiClient = request.createClient(apiUrl);

/***
 * Getting identifiers for hotel rooms
 * @param locationId
 * @param adults
 * @param children
 * @param trainAdults
 * @param trainChildren
 * @returns {Promise<unknown>}
 */
const getIdentifiers = ({locationId}, {adults, children, trainAdults, trainChildren}) =>
    Room.findAll({where: {locationId}})
        .then((rooms) => {
            return rooms.map((x) => `${x.id}-adults${adults}-children${children}-trainAdults${trainAdults}-trainChildren${trainChildren}`);
        });

/***
 * Instead of using callback functions
 * promisifying the request-json callback function
 * @param client
 * @param url
 * @returns {Promise<unknown>}
 */
const promisifiedEngineGet = ({client, url}) =>
    new Promise((resolve, reject) => {
        client.get(`${url}`, (err, res, body) => {
            if (err) {
                return reject(err);
            } else if (res.statusCode !== 200) {
                return reject();
            }
            resolve(body);
        });
    });

/***
 * Getting product "hotel" id
 * @param result
 * @returns {Promise<unknown>}
 */
const getHotelProductId = (result) =>
    new Promise((resolve) => {
        resolve(result.products.find((product) => product.name === "hotel").id);
    });

/***
 * Getting product definitions ids
 * @param locationId,
 * @param hotelProductId,
 * @param productDefinitions
 * @returns {Promise<unknown>}
 */
const filterIdentifiers = ({locationId, hotelProductId, productDefinitions}) =>
    getIdentifiers({locationId}, {adults: 2, children: 0, trainAdults: 0, trainChildren: 0})
        .then((identifiers) => {
            return {hotelProductId, identifiers: productDefinitions.filter((d) => identifiers.includes(d.identifier))};
        });

/***
 * Getting Identifiers for rooms with 2 adults, no children, and no train tickets
 * for the given location
 * @param locationId
 * @returns {Promise<unknown>}
 */
const getProductsIdentifiers = ({locationId}) =>
    promisifiedEngineGet({client: engineApiClient, url: `${locationId}` + "/products"})
        .then(getHotelProductId)
        .then((id) => promisifiedEngineGet({client: engineApiClient, url: `${locationId}` + "/products/" + `${id}`})
            .then((product) => {
                return filterIdentifiers({
                    locationId,
                    hotelProductId: id,
                    productDefinitions: product.productDefinitions
                });
            }));

/***
 * Getting Room Prices
 * @param locationId
 * @param identifiers
 * @returns {*}
 */
const getPrices = ({locationId, identifiers}) =>
    new Promise((resolve, reject) => {
        let promises = [];
        identifiers.forEach((identifier) => {
            promises.push(promisifiedEngineGet({
                client: engineApiClient,
                url: `${locationId}` + "/products/" + `${identifier.id}` + "/prices?" + getTimeSpanParameter()
            })
                .then((result) => {
                    return {
                        identifierId: `${identifier.id}`,
                        roomId: `${identifier.attributes.room.value}`,
                        prices: result.prices
                    };
                }));
        });
        Promise.all(promises)
            .then(resolve)
            .catch(reject);
    });

/***
 * Getting Rooms Availabilities
 * @param locationId
 * @param hotelProductId
 * @returns {*}
 */
const getAvailabilities = ({locationId, hotelProductId}) =>
    promisifiedEngineGet({
        client: apiClient,
        url: `${locationId}` + "/capacity/product/" + `${hotelProductId}` + "?" + getTimeSpanParameter()
    })
        .then(result => {
            return {hotelProductId, calendar: result.calendar};
        });

/***
 * Getting price and custom price for a given date and room type
 * @param priceStat
 * @param fDate
 * @returns {{customPrice: *, price: *}}
 */
const getPriceForDate = ({priceStat, fDate}) => {
    const statForDate = priceStat.prices.find((x) => x.validAt === fDate);
    return {
        priceForDate: fDate,
        datePrice: statForDate.price,
        dateCustomPrice: statForDate.customPrice
    };
};

/***
 * Getting Prices for a given date and room type
 * @param priceStats
 * @param fDate
 * @returns {{}}
 */
const getPricesForDate = ({priceStats, fDate}) => {
    let pricesForDate = {};
    priceStats.forEach((priceStat) => {
        const priceForDate = getPriceForDate({priceStat, fDate});
        pricesForDate[`${priceStat.roomId}`] = priceForDate;
    });
    return pricesForDate;
};

/***
 * Adding booked room count to the result
 * @param pricesForDate
 * @param capacities
 * @returns {[]}
 */
const addBookedRoomsForDate = (pricesForDate, capacities) => {
    let results = [];
    capacities.forEach((capacity) => {
        let temp = pricesForDate[`${capacity.value}`];
        temp.roomId = `${capacity.value}`;
        temp.bookedRooms = `${capacity.count}`;
        results.push(temp);
    });
    return results;
};

/***
 * Assembling results from api and engine services
 * @param priceStats
 * @param availabilities
 * @returns {Promise<unknown>}
 */
const assembleResults = ({priceStats, availabilities}) =>
    new Promise((resolve) => {
        let assembledResults = [];
        availabilities.calendar.forEach((calendarElement) => {
            const fDate = formatDate({jsonDate: calendarElement.date});
            let pricesForDate = getPricesForDate({priceStats, fDate});
            assembledResults = assembledResults.concat(addBookedRoomsForDate(pricesForDate, calendarElement.capacities));
        });
        resolve(assembledResults);
    });


/***
 * Scraping Location (locationId) Data
 * @param locationId
 * @param scrapId
 * @returns {Promise<unknown>}
 */
export const scrapLocationData = ({locationId, scrapId}) =>
    getProductsIdentifiers({locationId, scrapId})
        .then((productsIdentifiers) => {
            let promises = [];
            promises.push(getPrices({locationId, identifiers: productsIdentifiers.identifiers}));
            promises.push(getAvailabilities({locationId, hotelProductId: productsIdentifiers.hotelProductId}));
            return Promise.all(promises);
        })
        .then((results) => assembleResults({priceStats: results[0], availabilities: results[1]}))
        .then((assembledResults) => Price.bulkCreate(assembledResults.map((obj) => ({...obj, scrapId}))))
        .then((dbResults) => {
            return dbResults.map((x) => x.view());
        });





