import { ServerMiddleware } from "@decorators/socket";

export class ShipMiddleware implements ServerMiddleware {
  public use(io, socket, next) {
    console.log("ControllerMiddleware");
    next();
  }
}
