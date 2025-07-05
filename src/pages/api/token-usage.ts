import { tokenUsageRouteHandler } from "@server/tokenUsage";
import { withLogging } from "@server/utils/logger";

export const action = withLogging(tokenUsageRouteHandler.action, "tokenUsage.action"); 