import { createUploadthing, type FileRouter } from "uploadthing/remix";
import { createRouteHandler } from "uploadthing/remix";

const f = createUploadthing();

export const uploadRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ file }) => {
    console.log("Upload complete. File URL:", file.url);
  }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;

// Create the route handler
export const routeHandler = createRouteHandler({
  router: uploadRouter,
}); 