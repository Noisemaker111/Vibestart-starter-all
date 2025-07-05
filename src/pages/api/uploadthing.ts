import { routeHandler } from "@server/uploadthing";
import { withLogging } from "@server/utils/logger";

export const action = withLogging(routeHandler.action, "uploadthing.action");
export const loader = withLogging(routeHandler.loader, "uploadthing.loader"); 