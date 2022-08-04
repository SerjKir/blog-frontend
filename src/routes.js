import { AddPost, FullPost, Home, Login, Registration, Profile } from "./pages";

export const publicRoutes = [
  { path: "/", component: <Home />, exact: true },
  { path: "/posts/:id", component: <FullPost /> },
  { path: "/tags/:id", component: <Home /> },
  { path: "/register", component: <Registration />, exact: true },
  { path: "/login", component: <Login />, exact: true },
];

export const authRoutes = [
  { path: "/", component: <Home />, exact: true },
  { path: "/posts/:id", component: <FullPost /> },
  { path: "/posts/:id/edit", component: <AddPost /> },
  { path: "/tags/:id", component: <Home /> },
  { path: "/add-post", component: <AddPost />, exact: true },
  { path: "/profile", component: <Profile />, exact: true },
];
