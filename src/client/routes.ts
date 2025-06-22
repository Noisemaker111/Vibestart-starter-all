import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("./pages/home.tsx"),
  route("showcase", "./pages/showcase.tsx"),
  route("features", "./pages/features.tsx"),
  route("docs", "./pages/docs.tsx"),
  route("api/uploadthing", "./pages/api.uploadthing.tsx"),
  route("api/waitlist", "./pages/api.waitlist.tsx"),
] satisfies RouteConfig; 