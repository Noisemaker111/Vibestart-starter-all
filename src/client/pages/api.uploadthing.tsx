// This file exports the uploadthing route handlers from the server
// The actual upload logic is in src/server/uploadthing.ts
import { routeHandler } from "@server/uploadthing";

// Export the action and loader for React Router
export const action = routeHandler.action;
export const loader = routeHandler.loader; 