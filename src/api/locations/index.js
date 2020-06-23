import {routerFactory}                from "../../services/item";
import {bodyValidation, idValidation} from "./schema";
import {create, index, show}          from "./controller";

import rooms  from "../rooms";
import scraps from "../scraps";


const locationsRouter = routerFactory({bodyValidation, idValidation}, {create, show, index});

locationsRouter.use("/:id/rooms", rooms);
locationsRouter.use("/:id/scraps", scraps);

export default locationsRouter;