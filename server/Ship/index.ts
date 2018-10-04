import { ShipController } from "./Controller";
import { Container } from "@decorators/di";
import { IO_MIDDLEWARE } from "@decorators/socket";
import { ShipMiddleware } from "./Middleware";

Container.provide([{ provide: IO_MIDDLEWARE, useClass: ShipMiddleware }]);

export default ShipController;
