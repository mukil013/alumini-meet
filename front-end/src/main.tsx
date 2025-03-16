import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter as Bro, RouterProvider } from "react-router-dom";
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

const isAuth = !!localStorage.getItem("user");
const isAdmin = JSON.parse(localStorage.getItem("user")!) || null;

const router = Bro([
  {
    path: "/",
    element: isAuth ? (
      isAdmin.role === "admin" ? (
        <AdminHome />
      ) : (
        <Home />
      )
    ) : (
      <Login />
    ),
  },
  {
    path: "/userManagement",
    element: <UserManagement />,
  },
  {
    path: "/placement-info",
    element: <PlacementInfo />,
  },
  {
    path: "/edit-event",
    element: <EditEvent />,
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
    path: "/home",
    element: <Home />,
    children: [
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
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
