import { createBrowserRouter } from "react-router-dom";
import { routes } from "./routes";
import { AuthLayout, PublicLayout, PrivateLayout } from "@/layout";
import { Landing } from "@/modules/landing";
import { Login } from "@/modules/auth";
import { Register } from "@/modules/auth";
import { Verify } from "@/modules/auth";
import Dashboard from "@/modules/dashboard/pages";

export const router = createBrowserRouter([
  {
    path: routes.root,
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
    ],
  },
  {
    path: routes.auth.root,
    element: <AuthLayout />,
    children: [
      {
        path: routes.auth.login,
        element: <Login />,
      },
      {
        path: routes.auth.register,
        element: <Register />,
      },
      {
        path: routes.auth.verify,
        element: <Verify />,
      },
      {
        path: routes.auth.verify,
        element: <Verify />,
      },
    ],
  },
  {
    path: routes.dashboard.root,
    element: <PrivateLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
    ],
  },
]);
