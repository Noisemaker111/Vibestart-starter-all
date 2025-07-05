import { botidRouteHandler } from "@server/botid";
import { withLogging } from "@server/utils/logger";

export const loader = withLogging(botidRouteHandler.loader, "botid.loader"); 