import { imageGenerationHandler } from "@server/imageGeneration";
import { withLogging } from "@server/utils/logger";

export const action = withLogging(imageGenerationHandler.action, "imageGenerate.action");
export const loader = withLogging(imageGenerationHandler.loader, "imageGenerate.loader"); 