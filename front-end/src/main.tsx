// index.tsx
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter as Bro, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./AuthContext"; // Import the AuthProvider
import Home from "./pages/Home.tsx";
import Register from "./pages/auth/Register.tsx";
import Login from "./pages/auth/Login.tsx";
import Batches from "./pages/Batches.tsx";
import Profile from "./pages/Profile.tsx";
import Projects from "./pages/Projects.tsx";
import Placement from "./pages/Placement.tsx";
import Mentorship from "./pages/Mentorship.tsx";
import Events from "./pages/Events.tsx";
import UserManagement from "./pages/admin/UserManagement.tsx";
import AdminHome from "./pages/admin/AdminHome.tsx";
import PlacementInfo from "./pages/admin/PlacementInfo.tsx";
import Refferral from "./pages/Refferral.tsx";
import EditEvent from "./pages/admin/EditEvents.tsx";
import ProtectedRoute from "./pages/ProtectedRoute.tsx";
import { StrictMode } from "react";
import DefaultHome from "./pages/DefaultHome.tsx";

const router = Bro([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "home",
        element: <Home />,
        children: [
          {
            path: "landing",
            element: <DefaultHome />,
            index: true
          },
          {
            path: "batches",
            element: <Batches />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "Refferral",
            element: <Refferral />,
          },
          {
            path: "placements",
            element: <Placement />,
          },
          {
            path: "mentorship",
            element: <Mentorship />,
          },
          {
            path: "projects",
            element: <Projects />,
          },
          {
            path: "event",
            element: <Events />,
          },
        ],
      },
    ],
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element: <AdminHome />,
    children: [
      {
        path: "user-management",
        element: <UserManagement />,
      },
      {
        path: "placement-info",
        element: <PlacementInfo />,
      },
      {
        path: "edit-event",
        element: <EditEvent />,
      }
    ]
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
