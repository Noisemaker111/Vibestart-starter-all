import { createUploadthing, type FileRouter } from "uploadthing/remix";
import { createRouteHandler } from "uploadthing/remix";
import { db } from "@server/db";
import { uploadsTable } from "@server/db/schema";
import { verify, generateSignedToken } from "@server/utils/visitorToken";

const f = createUploadthing();

export const uploadRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      const cookieName = "anon_token";
      const cookieHeader = req.headers.get("cookie") ?? "";
      const incomingCookie = cookieHeader
        .split(/;\s*/)
        .find((c) => c.startsWith(`${cookieName}=`))?.split("=")[1];

      let token = verify(incomingCookie) ?? null;
      if (!token) {
        const { id } = generateSignedToken();
        token = id;
        // We intentionally skip setting the cookie here; the loader/action endpoints already issue it.
      }

      return { ownerToken: token } as const;
    })
    .onUploadComplete(async ({ file, metadata }) => {
      try {
        await db.insert(uploadsTable).values({
          url: file.url,
          key: file.key,
          name: file.name,
          size: file.size,
          owner_token: (metadata as { ownerToken: string }).ownerToken,
        });
      } catch (err) {
        console.error("Failed to save upload metadata", err);
      }
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;

// Create the route handler
export const routeHandler = createRouteHandler({
  router: uploadRouter,
}); 