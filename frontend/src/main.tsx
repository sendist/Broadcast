import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import Login from "./pages/Login/index.tsx";
import { AccountProvider } from "./context/account.tsx";
import { Checkbox } from "./components/ui/checkbox.tsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "masjid",
        element: (
          <div>
            <Checkbox />
          </div>
        ),
      },
      {
        path: "mubaligh",
        element: <div>ini mubaligh</div>,
      },
      {
        path: "masjid/:idMasjid",
        element: <div>ini masjid tapi ada id</div>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AccountProvider>
      <RouterProvider router={router} />
    </AccountProvider>
  </React.StrictMode>
);
