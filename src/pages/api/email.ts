import { emailRouteHandler } from "@server/email";
import { withLogging } from "@server/utils/logger";

export const action = withLogging(emailRouteHandler.action, "email.action"); 