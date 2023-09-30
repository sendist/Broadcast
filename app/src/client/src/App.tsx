import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useAccount from "./hooks/account";
import { Button } from "./components/ui/button";

const menus = [
  {
    path: "/",
    name: "Home",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        width="24"
        height="24"
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    path: "/template",
    name: "Template",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        width="24"
        height="24"
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16.5 9.4 7.55 4.24" />
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.29 7 12 12 20.71 7" />
        <line x1="12" x2="12" y1="22" y2="12" />
      </svg>
    ),
  },
  {
    path: "/waclient",
    name: "WA Client",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        width="24"
        height="24"
        aria-hidden="true"
        viewBox="0 0 512 512"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        fillRule="evenodd"
      >
        <path d="M414.73,97.1A222.14,222.14,0,0,0,256.94,32C134,32,33.92,131.58,33.87,254A220.61,220.61,0,0,0,63.65,365L32,480l118.25-30.87a223.63,223.63,0,0,0,106.6,27h.09c122.93,0,223-99.59,223.06-222A220.18,220.18,0,0,0,414.73,97.1ZM256.94,438.66h-.08a185.75,185.75,0,0,1-94.36-25.72l-6.77-4L85.56,427.26l18.73-68.09-4.41-7A183.46,183.46,0,0,1,71.53,254c0-101.73,83.21-184.5,185.48-184.5A185,185,0,0,1,442.34,254.14C442.3,355.88,359.13,438.66,256.94,438.66ZM358.63,300.47c-5.57-2.78-33-16.2-38.08-18.05s-8.83-2.78-12.54,2.78-14.4,18-17.65,21.75-6.5,4.16-12.07,1.38-23.54-8.63-44.83-27.53c-16.57-14.71-27.75-32.87-31-38.42s-.35-8.56,2.44-11.32c2.51-2.49,5.57-6.48,8.36-9.72s3.72-5.56,5.57-9.26.93-6.94-.46-9.71-12.54-30.08-17.18-41.19c-4.53-10.82-9.12-9.35-12.54-9.52-3.25-.16-7-.2-10.69-.2a20.53,20.53,0,0,0-14.86,6.94c-5.11,5.56-19.51,19-19.51,46.28s20,53.68,22.76,57.38,39.3,59.73,95.21,83.76a323.11,323.11,0,0,0,31.78,11.68c13.35,4.22,25.5,3.63,35.1,2.2,10.71-1.59,33-13.42,37.63-26.38s4.64-24.06,3.25-26.37S364.21,303.24,358.63,300.47Z">
        </path>
      </svg>
    ),
  },
  {
    path: "/masjid",
    name: "Masjid",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 512"
        height="24"
        width="20"
      >
        <path
          d="M400 0C405 0 409.8 2.371 412.8 6.4C447.5 52.7 490.9 81.34 546.3 117.9C551.5 121.4 556.9 124.9 562.3 128.5C591.3 147.7 608 180.2 608 214.6C608 243.1 596.7 269 578.2 288H221.8C203.3 269 192 243.1 192 214.6C192 180.2 208.7 147.7 237.7 128.5C243.1 124.9 248.5 121.4 253.7 117.9C309.1 81.34 352.5 52.7 387.2 6.4C390.2 2.371 394.1 0 400 0V0zM288 440C288 426.7 277.3 416 264 416C250.7 416 240 426.7 240 440V512H192C174.3 512 160 497.7 160 480V352C160 334.3 174.3 320 192 320H608C625.7 320 640 334.3 640 352V480C640 497.7 625.7 512 608 512H560V440C560 426.7 549.3 416 536 416C522.7 416 512 426.7 512 440V512H448V453.1C448 434.1 439.6 416.1 424.1 404.8L400 384L375 404.8C360.4 416.1 352 434.1 352 453.1V512H288V440zM70.4 5.2C76.09 .9334 83.91 .9334 89.6 5.2L105.6 17.2C139.8 42.88 160 83.19 160 126V128H0V126C0 83.19 20.15 42.88 54.4 17.2L70.4 5.2zM0 160H160V296.6C140.9 307.6 128 328.3 128 352V480C128 489.6 130.1 498.6 133.8 506.8C127.3 510.1 119.9 512 112 512H48C21.49 512 0 490.5 0 464V160z" id="mainIconPathAttribute" stroke-width="0.5" stroke="#ff0000">
        </path>
      </svg>
    ),
  },
  {
    path: "/mubaligh",
    name: "Mubaligh",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        width="24"
        height="24"
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    path: "/jadwal-pengajian",
    name: "Jadwal Pengajian",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-5"
        width="20"
        height="20"
        aria-hidden="true"
        viewBox="0 0 16 16"
        fill="black"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path 
          d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z">
        </path>
        <path 
          d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4zM11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z">
        </path>
      </svg>
    ),
  },
  {
    path: "/jadwal-jumatan",
    name: "Jadwal Jumatan",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        width="24"
        height="24"
        aria-hidden="true"
        viewBox="0 0 16 16"
        fill="black"
        stroke="currentColor"
        strokeWidth="0.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z">
        </path>
      </svg>
    ),
  },
];

function App() {
  const { account, logout } = useAccount();
  const navigate = useNavigate();
  return (
    <>
      <div className="h-screen w-screen bg-white flex flex-row">
        <div
          className="z-40 h-screen w-64 transition-transform"
          aria-label="Sidebar"
        >
          <div className="flex h-full flex-col overflow-y-auto border-r border-slate-200 bg-white px-3 py-4">
            <div className="mb-10 flex items-center rounded-lg px-3 py-2 text-slate-900">
              <span className="ml-3 text-base font-semibold">Broadcast</span>
            </div>
            <ul className="space-y-2 text-sm font-medium">
              {menus.map((menu, index) => (
                <li key={index}>
                  <Link
                    to={menu.path}
                    className="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 "
                  >
                    {menu.icon}
                    <span className="ml-3 flex-1 whitespace-nowrap">
                      {menu.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-auto flex">
              <Popover>
                <PopoverTrigger className="flex w-full justify-between">
                  <span className="text-sm font-medium text-black">
                    {account?.username}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    aria-roledescription="more menu"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5 text-black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                </PopoverTrigger>
                <PopoverContent>
                  <Button
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                  >
                    Logout
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col h-screen w-full overflow-auto p-4 bg-background">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default App;
