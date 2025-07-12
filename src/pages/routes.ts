import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("home/page.tsx"),
  route("api/*", "api/index.ts"),
] satisfies RouteConfig; 