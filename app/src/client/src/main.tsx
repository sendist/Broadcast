import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import Login from "./pages/Login/index.tsx";
import { AccountProvider } from "./context/account.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
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
import { CustomizationProvider } from "./context/customization.tsx";
import HeadUpdater from "./components/custom/headUpdater.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <CustomizationProvider>
        <HeadUpdater />
        <LandingPage />
      </CustomizationProvider>
    ),
  },
  {
    path: "/login",
    element: (
      <CustomizationProvider>
        <AccountProvider>
          <HeadUpdater />
          <Login />
        </AccountProvider>
      </CustomizationProvider>
    ),
  },
  {
    path: "/*",
    element: (
      <CustomizationProvider>
        <AccountProvider>
          <HeadUpdater />
          <App />
        </AccountProvider>
      </CustomizationProvider>
    ),
    errorElement: <NotFound />,
    children: [
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
