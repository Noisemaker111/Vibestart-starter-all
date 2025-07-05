import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("home/page.tsx"),
  route("docs", "docs/page.tsx"),
  route("test", "test/page.tsx"),
  route("api/uploadthing", "api/uploadthing.ts"),
  route("api/animals", "api/animals.ts"),
  route("api/images", "api/images.ts"),
  route("api/chat", "api/chat.ts"),
  route("api/botid", "api/botid.ts"),
  route("api/image-generate", "api/image-generate.ts"),
  route("api/polar", "api/polar.ts"),
  route("api/polar/webhook", "api/polar/webhook.ts"),
  route("api/token-usage", "api/token-usage.ts"),
  route("api/email", "api/email.ts"),
] satisfies RouteConfig; 