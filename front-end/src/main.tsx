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
import Opensource from "./pages/Opensource.tsx";
import Mentorship from "./pages/Mentorship.tsx";
import Events from "./pages/Events.tsx";

const isAuth = true

const router = Bro([
  {
    path: '/',
    element: isAuth ? <Home /> : <Login />, 
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/home', 
    element: <Home />,
    children: [
      {
        path: 'batches',
        element: <Batches />,
      },
      {
        path: 'profile', 
        element: <Profile />,
      },
      {
        path: 'opensource',
        element: <Opensource />
      },
      {
        path: 'placements',
        element: <Placement />
      },
      {
        path: 'mentorship',
        element: <Mentorship />
      },
      {
        path: 'projects',
        element: <Projects />
      },
      {
        path: 'event',
        element: <Events />
      }
    ],
  },
]);

createRoot(document.getElementById("root")!).render(<RouterProvider router={router} />);
