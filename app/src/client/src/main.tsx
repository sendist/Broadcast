import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import Login from "./pages/Login/index.tsx";
import { AccountProvider } from "./context/account.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import Rebrand from "./pages/Rebrand/index.tsx";
import MasjidPage from "./pages/Masjid/index.tsx";
import MubalighPage from "./pages/Mubaligh/index.tsx";
import NotFound from "./pages/NotFound/index.tsx";
import WaClient from "./pages/WaClient/index.tsx";
import Template from "./pages/Template/index.tsx";
import JadwalPengajian from "./pages/JadwalPengajian/index.tsx";
import JadwalJumatan from "./pages/JadwalJumatan/index.tsx";
import MessageLogs from "./pages/MessageLogs/index.tsx";
import SchedulePage from "./pages/Schedule/index.tsx";
import Home from "./pages/Home/index.tsx";
import LandingPage from "./pages/LandingPage/index.tsx";
import ManageAdmin from "./pages/ManageAdmin/index.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: (
      <AccountProvider>
        <Login />
      </AccountProvider>
    ),
  },
  {
    path: "/*",
    element: (
      <AccountProvider>
        <App />
      </AccountProvider>
    ),
    errorElement: <NotFound />,
    children: [
      {
        path: "rebrand",
        element: <Rebrand />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "manage-admin",
        element: <ManageAdmin />,
      },
      {
        path: "template",
        element: <Template />,
      },
      {
        path: "waclient",
        element: <WaClient />,
      },
      {
        path: "masjid",
        element: <MasjidPage />,
      },
      {
        path: "mubaligh",
        element: <MubalighPage />,
      },
      {
        path: "jadwal-pengajian",
        element: <JadwalPengajian />,
      },
      {
        path: "jadwal-jumatan",
        element: <JadwalJumatan />,
      },
      {
        path: "schedule",
        element: <SchedulePage />,
      },
      {
        path: "message-logs",
        element: <MessageLogs />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Toaster />
    <RouterProvider router={router} />
  </React.StrictMode>
);
