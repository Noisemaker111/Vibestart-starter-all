import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("./pages/home.tsx"),
  route("test", "./pages/test.tsx"),
  route("docs", "./pages/docs.tsx"),
  route("api/uploadthing", "./pages/api.uploadthing.tsx"),
  route("api/animals", "./pages/api.animals.tsx"),
] satisfies RouteConfig; 