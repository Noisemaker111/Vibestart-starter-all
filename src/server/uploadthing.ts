import { createUploadthing, type FileRouter } from "uploadthing/remix";
import { createRouteHandler } from "uploadthing/remix";
import { db } from "@server/db";
import { uploadsTable } from "@server/db/schema";
import { verify, generateSignedToken } from "@server/utils/visitorToken";
import { UTApi } from "uploadthing/server";
import { checkBotId } from "botid/server";
import { canCallIntegrations } from "./utils/auth";

const f = createUploadthing();

// Shared UploadThing API instance for admin actions (deleteFiles, etc.)
export const utapi = new UTApi();

export const uploadRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async ({ event }) => {
      // Remix adapter passes the original Fetch event – extract the Request object
      const req = event.request;

      try {
        if (!canCallIntegrations(req)) {
          throw new Error("Unauthorized");
        }

        // Perform BotID verification to block automated uploads
        const botCheck = import.meta.env.DEV ? { isBot: false } : await checkBotId();
        if (botCheck.isBot) {
          throw new Error("Access denied – bot detected");
        }

        const cookieName = "anon_token";
        const cookieHeader = req.headers.get("cookie") ?? "";
        const incomingCookie = cookieHeader
          .split(/;\s*/)
          .find((c: string) => c.startsWith(`${cookieName}=`))?.split("=")[1];

        let token = verify(incomingCookie) ?? null;
        if (!token) {
          const { id } = generateSignedToken();
          token = id;
          // We intentionally skip setting the cookie here; the loader/action endpoints already issue it.
        }

        return { ownerToken: token } as const;
      } catch (err) {
        console.error("[uploadthing.middleware]", err);
        throw err;
      }
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