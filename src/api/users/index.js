import {routerFactory}                        from "../../services/item";
import {bodyValidation, idValidation}         from "./schema";
import {create, destroy, index, show, update} from "./controller";


export default routerFactory({bodyValidation, idValidation}, {create, show, index, update, destroy});
