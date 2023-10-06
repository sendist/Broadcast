import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import Login from "./pages/Login/index.tsx";
import { AccountProvider } from "./context/account.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import Masjid from "./pages/Masjid/index.tsx";
import Mubaligh from "./pages/Mubaligh/index.tsx";
import NotFound from "./pages/NotFound/index.tsx";
import WaClient from "./pages/WaClient/index.tsx";
import Template from "./pages/Template/index.tsx";
import JadwalPengajian from "./pages/JadwalPengajian/index.tsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <AccountProvider>
        <Login />
      </AccountProvider>
    ),
  },
  {
    path: "/",
    element: (
      <AccountProvider>
        <App />
      </AccountProvider>
    ),
    errorElement: <NotFound />,
    children: [
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
        element: <Masjid />,
      },
      {
        path: "mubaligh",
        element: <Mubaligh />,
      },
      {
        path: "masjid/:idMasjid",
        element: <div>ini masjid tapi ada id</div>,
      },
      {
        path: "jadwal-pengajian",
        element: <JadwalPengajian/>,
      },
      {
        path: "jadwal-jumatan",
        element: <div>Ini jadwal jumatan</div>,
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
