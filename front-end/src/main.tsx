import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter as Bro, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Register from "./pages/auth/Register.tsx";
import Login from "./pages/auth/Login.tsx";
import Batches from "./pages/Batches.tsx";
import Profile from "./pages/Profile.tsx";

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
    ],
  },
]);

createRoot(document.getElementById("root")!).render(<RouterProvider router={router} />);
