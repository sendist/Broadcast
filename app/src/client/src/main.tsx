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
import SplashScreen from "./pages/SplashScreen/index.tsx";
import MessageLogs from "./pages/MessageLogs/index.tsx";
import SchedulePage from "./pages/Schedule/index.tsx";
import Home from "./pages/Home/index.tsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <AccountProvider>
        <SplashScreen>
          <Login />
        </SplashScreen>
      </AccountProvider>
    ),
  },
  {
    path: "/",
    element: (
      <AccountProvider>
        <SplashScreen>
          <App />
        </SplashScreen>
      </AccountProvider>
    ),
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <Home />,
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
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Toaster />
    <RouterProvider router={router} />
  </React.StrictMode>
);
