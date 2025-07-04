import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("./pages/home/page.tsx"),
  route("docs", "./pages/docs/page.tsx"),
  route("api/uploadthing", "./pages/api/uploadthing.tsx"),
  route("api/animals", "./pages/api/animals.tsx"),
  route("api/images", "./pages/api/images.tsx"),
  route("api/chat", "./pages/api/chat.tsx"),
  route("api/botid", "./pages/api/botid.tsx"),
  route("api/image-generate", "./pages/api/image-generate.tsx"),
  route("api/polar", "./pages/api/polar.tsx"),
  route("api/polar/webhook", "./pages/api/polar/webhook.tsx"),
  route("api/token-usage", "./pages/api/token-usage.tsx"),
  route("api/email", "./pages/api/email.tsx"),
] satisfies RouteConfig; 