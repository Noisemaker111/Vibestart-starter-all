import { createUploadthing, type FileRouter } from "uploadthing/remix";
import { createRouteHandler } from "uploadthing/remix";
import { verify, generateSignedToken, canCallIntegrations } from "../utils/security";
import { UTApi } from "uploadthing/server";
import { db, uploadsTable } from "./database";

// ────────────────────────────────────────────────────────────────────────────────
// UploadThing configuration
// ────────────────────────────────────────────────────────────────────────────────

const f = createUploadthing();
export const utapi = new UTApi();

export const uploadRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ event }) => {
      const req = event.request;
      try {
        if (!canCallIntegrations(req)) throw new Error("Unauthorized");
        const cookieName = "anon_token";
        const cookieHeader = req.headers.get("cookie") ?? "";
        const incomingCookie = cookieHeader
          .split(/;\s*/)
          .find((c: string) => c.startsWith(`${cookieName}=`))
          ?.split("=")[1];
        let token = verify(incomingCookie) ?? null;
        if (!token) {
          const { id } = generateSignedToken();
          token = id;
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

export const routeHandler = createRouteHandler({ router: uploadRouter }); 