import passport                              from "passport";
import {BasicStrategy}                       from "passport-http";
import {Strategy as BearerStrategy}          from "passport-http-bearer";
import {ExtractJwt, Strategy as JwtStrategy} from "passport-jwt";
import config                                from "../../config";
import User                                  from "../../api/users/model";
import {emailValidation}                     from "./schema";


/***
 * Using generic auth function.
 * @param authType
 * @returns {function(...[*]=)}
 */
const auth = ({authType} = {}) => (req, res, next) => {
    passport.authenticate(authType, {session: false}, (err, user, info) => {
        if (err && err.params) {
            return res.status(400).json(err);
        }

        if (err || !user) {
            return res.status(401).end();
        }

        req.logIn(user, {session: false}, err => {
            if (err) {
                return res.status(401).end();
            }
            next();
        });

    })(req, res, next);
};

/***
 * Basic Auth Strategy
 */
passport.use("password", new BasicStrategy((email, password, done) => {
    emailValidation.validate(({email, password}), err => {
        if (err) {
            done(err);
            return null;
        }
    });
    User.findOne({where: {email}}).then((user) => {
        if (!user) {
            done(true);
            return null;
        }

        return user.authenticate(password).then((user) => {
            done(null, user);
            return null;
        }).catch(done);
    });

}));

/***
 * Master Authentication, only for Demo Purposes
 */
passport.use("master", new BearerStrategy((token, done) => {
    done(null, token === config.masterKey ? {} : false);
}));

passport.use("token", new JwtStrategy({
    secretOrKey: config.jwtSecret,
    jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromUrlQueryParameter("access_token"),
        ExtractJwt.fromBodyField("access_token"),
        ExtractJwt.fromAuthHeaderWithScheme("Bearer")
    ])
}, ({id}, done) => {
    User.findByPk(id).then((user) => {
        done(null, user);
        return null;
    }).catch(done);
}));


export const token = () => auth({authType: "token"});
export const master = () => auth({authType: "master"});
export const userAuthentication = () => auth({authType: "password"});
