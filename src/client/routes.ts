import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("./pages/home.tsx"),
  route("ideas", "./pages/ideas.tsx"),
  route("docs", "./pages/docs.tsx"),
  route("api/ideas", "./pages/api.ideas.tsx"),
  route("api/uploadthing", "./pages/api.uploadthing.tsx"),
  route("api/ideas/:id/vote", "./pages/api.ideas.$id.vote.tsx"),
  route("api/user/avatar", "./pages/api.user.avatar.tsx"),
] satisfies RouteConfig; 