import { polarRouteHandler } from "@server/polar";
import { withLogging } from "@server/utils/logger";

export const loader = withLogging(polarRouteHandler.loader, "polar.loader");
export const action = withLogging(polarRouteHandler.action, "polar.action"); 