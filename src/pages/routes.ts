import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("home/page.tsx"),
  route("docs", "docs/page.tsx"),
  route("test", "test/page.tsx"),
  route("api/uploadthing", "api/uploadthing.server.ts"),
  route("api/animals", "api/animals.server.ts"),
  route("api/images", "api/images.server.ts"),
  route("api/chat", "api/chat.server.ts"),
  route("api/botid", "api/botid.server.ts"),
  route("api/image-generate", "api/image-generate.server.ts"),
  route("api/polar", "api/polar.server.ts"),
  route("api/polar/webhook", "api/polar/webhook.server.ts"),
  route("api/token-usage", "api/token-usage.server.ts"),
  route("api/email", "api/email.server.ts"),
] satisfies RouteConfig; 