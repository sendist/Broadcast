import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useAccount from "./hooks/account";
import { Button } from "./components/ui/button";
import { useWindowSize } from "./hooks/windowSize";
import { HamburgerMenuIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { useState } from "react";

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
        xmlnsXlink="http://www.w3.org/1999/xlink"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        x="0px"
        y="0px"
        width="20"
        height="20"
        stroke="currentColor"
        fill="currentColor"
      >
        <g data-name="Layer 2">
          <path d="M27,2H5A3,3,0,0,0,2,5v5a3,3,0,0,0,3,3H27a3,3,0,0,0,3-3V5A3,3,0,0,0,27,2Zm1,8a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V5A1,1,0,0,1,5,4H27a1,1,0,0,1,1,1Z"></path>
          <path d="M13,16H5a3,3,0,0,0-3,3v8a3,3,0,0,0,3,3h8a3,3,0,0,0,3-3V19A3,3,0,0,0,13,16Zm1,11a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V19a1,1,0,0,1,1-1h8a1,1,0,0,1,1,1Z"></path>
          <path d="M29,17H20a1,1,0,0,0,0,2h9a1,1,0,0,0,0-2Z"></path>
          <path d="M29,22H20a1,1,0,0,0,0,2h9a1,1,0,0,0,0-2Z"></path>
          <path d="M29,27H20a1,1,0,0,0,0,2h9a1,1,0,0,0,0-2Z"></path>
        </g>
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
        <path d="M414.73,97.1A222.14,222.14,0,0,0,256.94,32C134,32,33.92,131.58,33.87,254A220.61,220.61,0,0,0,63.65,365L32,480l118.25-30.87a223.63,223.63,0,0,0,106.6,27h.09c122.93,0,223-99.59,223.06-222A220.18,220.18,0,0,0,414.73,97.1ZM256.94,438.66h-.08a185.75,185.75,0,0,1-94.36-25.72l-6.77-4L85.56,427.26l18.73-68.09-4.41-7A183.46,183.46,0,0,1,71.53,254c0-101.73,83.21-184.5,185.48-184.5A185,185,0,0,1,442.34,254.14C442.3,355.88,359.13,438.66,256.94,438.66ZM358.63,300.47c-5.57-2.78-33-16.2-38.08-18.05s-8.83-2.78-12.54,2.78-14.4,18-17.65,21.75-6.5,4.16-12.07,1.38-23.54-8.63-44.83-27.53c-16.57-14.71-27.75-32.87-31-38.42s-.35-8.56,2.44-11.32c2.51-2.49,5.57-6.48,8.36-9.72s3.72-5.56,5.57-9.26.93-6.94-.46-9.71-12.54-30.08-17.18-41.19c-4.53-10.82-9.12-9.35-12.54-9.52-3.25-.16-7-.2-10.69-.2a20.53,20.53,0,0,0-14.86,6.94c-5.11,5.56-19.51,19-19.51,46.28s20,53.68,22.76,57.38,39.3,59.73,95.21,83.76a323.11,323.11,0,0,0,31.78,11.68c13.35,4.22,25.5,3.63,35.1,2.2,10.71-1.59,33-13.42,37.63-26.38s4.64-24.06,3.25-26.37S364.21,303.24,358.63,300.47Z"></path>
      </svg>
    ),
  },
  {
    path: "/masjid",
    name: "Masjid",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        version="1.1"
        x="0px"
        y="0px"
        viewBox="0 0 54 54"
        xmlSpace="preserve"
        width="20"
        height="20"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M47.1,26.3H42v-3.1c0-0.6-0.5-1-1-1h-2.3c2.8-4.9,1.9-8.7,0.5-11.1c-1.1-1.8-2.7-3.3-4.8-4.3c-5.6-2.7-6.4-6-6.4-6  C27.9,0.3,27.5,0,27,0c-0.5,0-0.9,0.3-1,0.8c0,0-0.8,3.3-6.4,6c-2.1,1-3.8,2.5-4.8,4.3c-1.4,2.4-2.3,6.2,0.5,11.1H13  c-0.6,0-1,0.5-1,1v3.1H6.9c-0.6,0-1,0.5-1,1V53c0,0.6,0.5,1,1,1c19.9,0,23.8,0,40.2,0c0.6,0,1-0.5,1-1V27.4  C48.1,26.8,47.7,26.3,47.1,26.3z M16.5,12.2c0.8-1.4,2.2-2.7,3.9-3.5C24.1,7,26,4.9,27,3.4c1,1.5,2.9,3.5,6.5,5.3  c1.7,0.8,3.1,2,3.9,3.5c1.8,3,1.4,6.4-1.1,10.1H17.7C15.2,18.6,14.8,15.2,16.5,12.2z M14,24.3c4.8,0,16.6,0,26,0v2.1H14V24.3z   M22.3,52v-9.3c0-2.6,2.1-4.7,4.7-4.7c2.6,0,4.7,2.1,4.7,4.7V52H22.3z M46.1,52H33.8v-9.3c0-3.7-3-6.8-6.8-6.8s-6.8,3-6.8,6.8V52  H7.9V28.4c12.9,0,23.8,0,38.2,0V52z"></path>
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
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z"></path>
        <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4zM11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"></path>
      </svg>
    ),
  },
  {
    path: "/jadwal-jumatan",
    name: "Jadwal Jumatan",
    icon: (
      <svg
        xmlnsXlink="http://www.w3.org/1999/xlink"
        xmlns="http://www.w3.org/2000/svg"
        filter="url(#colors500194217)"
        x="0"
        y="0"
        width="24"
        height="21.328046502319676"
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="3.5003674030303955 8.690316200256348 92.98143768310547 82.62968444824219"
          x="0px"
          y="0px"
        >
          <g data-name="Layer 2 copy 8">
            <path d="M95,91.32a1.51,1.51,0,0,0,1.4-2l-7-18a1.52,1.52,0,0,0-1.4-1H67.52c-.09-.68-.19-1.38-.34-2.1s-.68-2.06-2.77-3.63a6.07,6.07,0,0,0,.67-4.26c-.51-2.13-2.33-3.81-5.39-5h0L49.45,50.81s-5.57-16.68-6.14-18.24a5.12,5.12,0,0,0,.77.07c5.39,0,7.37-7.13,7.41-12,.18-1.27,1.16-9.36-3.61-10.93a16.08,16.08,0,0,0-11.27,0c-4.87,1.61-3.75,10-3.6,11a12.58,12.58,0,0,0,2.69,6.61,9.67,9.67,0,0,0-3.86,1.49c-3.84,2.52-6.09,7.68-6.71,15.33-.49,6.11-.94,14.3-1.18,21.9A8,8,0,0,0,25,70.32H13.11a1.51,1.51,0,0,0-1.37.89l-8.11,18A1.5,1.5,0,0,0,5,91.32ZM60,58.77A4.06,4.06,0,0,1,62.17,61a3,3,0,0,1-.36,2.06L59,61.89ZM44.08,29.64c-2.82,0-6.85-4.14-7.85-7.64H48.42C48.1,25.5,46.7,29.64,44.08,29.64ZM37.55,12.55a13.57,13.57,0,0,1,4.56-.87h.25a13.64,13.64,0,0,1,4.58.87c1.62.53,1.85,4.05,1.7,6.45H35.85C35.69,16.6,35.92,13.08,37.55,12.55ZM28.12,44.39c.75-8.26,3.33-14.61,9.88-14.13,2.68,0,8.85,22.17,8.85,22.17-.25.9,9.86,4.68,10.39,5.11L56.13,61,44.9,58.62,37.4,46.94a1.5,1.5,0,0,0-2.52,1.62c.34.26,8.23,13.59,8.79,12.86,5,1.44,17.87,2.34,20.57,7.39,1,6.88.85,11.56-4.61,10.61-6.09-.41-21.22-.1-26.14,0V74.15c7.15-1,17.87-2.21,19.77-1.85a1.5,1.5,0,0,0,.56-2.94C22.51,70.87,26.25,77.45,28.12,44.39Zm-2.5,29.89,4.87,0v3c-.68,0-1.54,0-2.62,0a13.11,13.11,0,0,0-6,1.86c-1.81.93-2.47,1.17-2.84.8-.09-.08-.09-.1-.08-.16C19.14,78.54,22.49,76,25.62,74.28Zm-11.54-1h7.31c-2.37,1.58-5.07,3.82-5.4,6a3.09,3.09,0,0,0,.92,2.73,3.31,3.31,0,0,0,2.45,1,9.08,9.08,0,0,0,3.88-1.3,10.37,10.37,0,0,1,4.63-1.53c1.27,0,2.09,0,2.62.06A1.67,1.67,0,0,0,32,82.46c2.4-.29,25.73-.14,31.19-.09,3-1.08,4.57-4.34,4.53-9.05H87l5.79,15H7.32Z"></path>
          </g>
        </svg>
      </svg>
    ),
  },
  {
    path: "/schedule",
    name: "Schedule",
    icon: (
      <svg
        xmlnsXlink="http://www.w3.org/1999/xlink"
        xmlns="http://www.w3.org/2000/svg"
        filter="url(#colors500194217)"
        x="0"
        y="0"
        width="24"
        height="21.328046502319676"
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="3.5003674030303955 8.690316200256348 92.98143768310547 82.62968444824219"
          x="0px"
          y="0px"
        >
          <g data-name="Layer 2 copy 8">
            <path d="M95,91.32a1.51,1.51,0,0,0,1.4-2l-7-18a1.52,1.52,0,0,0-1.4-1H67.52c-.09-.68-.19-1.38-.34-2.1s-.68-2.06-2.77-3.63a6.07,6.07,0,0,0,.67-4.26c-.51-2.13-2.33-3.81-5.39-5h0L49.45,50.81s-5.57-16.68-6.14-18.24a5.12,5.12,0,0,0,.77.07c5.39,0,7.37-7.13,7.41-12,.18-1.27,1.16-9.36-3.61-10.93a16.08,16.08,0,0,0-11.27,0c-4.87,1.61-3.75,10-3.6,11a12.58,12.58,0,0,0,2.69,6.61,9.67,9.67,0,0,0-3.86,1.49c-3.84,2.52-6.09,7.68-6.71,15.33-.49,6.11-.94,14.3-1.18,21.9A8,8,0,0,0,25,70.32H13.11a1.51,1.51,0,0,0-1.37.89l-8.11,18A1.5,1.5,0,0,0,5,91.32ZM60,58.77A4.06,4.06,0,0,1,62.17,61a3,3,0,0,1-.36,2.06L59,61.89ZM44.08,29.64c-2.82,0-6.85-4.14-7.85-7.64H48.42C48.1,25.5,46.7,29.64,44.08,29.64ZM37.55,12.55a13.57,13.57,0,0,1,4.56-.87h.25a13.64,13.64,0,0,1,4.58.87c1.62.53,1.85,4.05,1.7,6.45H35.85C35.69,16.6,35.92,13.08,37.55,12.55ZM28.12,44.39c.75-8.26,3.33-14.61,9.88-14.13,2.68,0,8.85,22.17,8.85,22.17-.25.9,9.86,4.68,10.39,5.11L56.13,61,44.9,58.62,37.4,46.94a1.5,1.5,0,0,0-2.52,1.62c.34.26,8.23,13.59,8.79,12.86,5,1.44,17.87,2.34,20.57,7.39,1,6.88.85,11.56-4.61,10.61-6.09-.41-21.22-.1-26.14,0V74.15c7.15-1,17.87-2.21,19.77-1.85a1.5,1.5,0,0,0,.56-2.94C22.51,70.87,26.25,77.45,28.12,44.39Zm-2.5,29.89,4.87,0v3c-.68,0-1.54,0-2.62,0a13.11,13.11,0,0,0-6,1.86c-1.81.93-2.47,1.17-2.84.8-.09-.08-.09-.1-.08-.16C19.14,78.54,22.49,76,25.62,74.28Zm-11.54-1h7.31c-2.37,1.58-5.07,3.82-5.4,6a3.09,3.09,0,0,0,.92,2.73,3.31,3.31,0,0,0,2.45,1,9.08,9.08,0,0,0,3.88-1.3,10.37,10.37,0,0,1,4.63-1.53c1.27,0,2.09,0,2.62.06A1.67,1.67,0,0,0,32,82.46c2.4-.29,25.73-.14,31.19-.09,3-1.08,4.57-4.34,4.53-9.05H87l5.79,15H7.32Z"></path>
          </g>
        </svg>
      </svg>
    ),
  },
  {
    path: "/message-logs",
    name: "Message Logs",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        version="1.2"
        baseProfile="tiny"
        x="0px"
        y="0px"
        viewBox="7.5 5 87.5 90"
        xmlSpace="preserve"
        width="20"
        height="20"
        stroke="currentColor"
        fill="currentColor"
      >
        <path d="M77.5,25c-7.81-7.81-12.189-12.189-20-20h-40c-5.523,0-10,4.477-10,10v70c0,5.523,4.477,10,10,10h50   c5.523,0,10-4.477,10-10v-5H95V40H77.5V25z M55,13.107L69.393,27.5H57.5c-1.378,0-2.5-1.122-2.5-2.5V13.107z M70,85   c0,1.378-1.121,2.5-2.5,2.5h-50c-1.378,0-2.5-1.122-2.5-2.5V15c0-1.379,1.122-2.5,2.5-2.5h30V25c0,5.523,4.477,10,10,10H70v5H27.5   v40H70V85z M90,45v30H32.5V45H90z"></path>
        <path d="M60,70c4.136,0,7.5-3.364,7.5-7.5v-5c0-4.136-3.364-7.5-7.5-7.5s-7.5,3.364-7.5,7.5v5   C52.5,66.636,55.864,70,60,70z M57.5,57.5c0-1.378,1.122-2.5,2.5-2.5s2.5,1.122,2.5,2.5v5c0,1.378-1.122,2.5-2.5,2.5   s-2.5-1.122-2.5-2.5V57.5z"></path>
        <polygon points="50,65 42.5,65 42.5,50 37.5,50 37.5,70 50,70  "></polygon>
        <path d="M77.5,70H85V57.5h-7.5v5H80V65h-2.5c-1.378,0-2.5-1.122-2.5-2.5v-5c0-1.378,1.122-2.5,2.5-2.5H85v-5h-7.5   c-4.136,0-7.5,3.364-7.5,7.5v5C70,66.636,73.364,70,77.5,70z"></path>
      </svg>
    ),
  },
];

function App() {
  const { account, logout } = useAccount();
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(
    menus.find((menu) => menu.path === location.pathname)?.name ?? menus[0].name
  );
  const logoutAdmin = (
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
  );
  return (
    <>
      <div className="h-screen w-screen bg-dark flex flex-row">
        {/* sidebar */}
        {width > 1024 ? (
          <div
            className="z-40 h-screen w-64 transition-transform"
            aria-label="Sidebar"
          >
            <div className="flex h-full flex-col overflow-y-auto border-r border-slate-200 bg-white px-3 py-4">
              <div className="mb-10 flex items-center rounded-lg px-3 py-2 text-slate-900">
                <svg
                  className="h-9 w-9"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0.2999999999999998 89 102.1"
                  width="50.4"
                  height="58.1643594"
                  x="4.800000000000001"
                  y="5.539463443183575"
                  fill="#557A82"
                >
                  <path
                    d="M24.6 89V57.7c0-11 19.9-19.9 19.9-19.9s19.9 8.9 19.9 19.9V89m-.1-16.2v-28c0-11-19.9-19.9-19.9-19.9s-19.9 8.9-19.9 19.9v28m39.8-11.1v-28c0-11-19.9-19.9-19.9-19.9s-19.9 8.9-19.9 19.9v28M2 75.9l42.5 24.5L87 75.9V26.8L44.5 2.3 2 26.8v49.1zm73.9-55.4v61.8M13.1 20.5v61.8"
                    fill="none"
                    stroke="#557A82"
                    strokeWidth="4px"
                    strokeMiterlimit="10"
                  ></path>
                </svg>
                <span className="ml-1 text-base font-semibold">Broadcast</span>
              </div>
              <ul className="space-y-2 text-sm font-medium">
                {menus.map((menu, index) => (
                  <li key={index} onClick={() => setSelectedMenu(menu.name)}>
                    <Link
                      to={menu.path}
                      className={`flex items-center rounded-lg px-3 py-2 hover:bg-slate-100 ${
                        selectedMenu === menu.name
                          ? "text-green-600"
                          : "text-slate-900"
                      }`}
                    >
                      {menu.icon}
                      <span className="ml-3 flex-1 whitespace-nowrap">
                        {menu.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              {logoutAdmin}
            </div>
          </div>
        ) : (
          <header>
            <div className="fixed w-full p-2 flex items-center border border-r border-slate-200 bg-white z-10">
              <svg
                className="h-9 w-9"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0.2999999999999998 89 102.1"
                width="50.4"
                height="58.1643594"
                x="4.800000000000001"
                y="5.539463443183575"
                fill="#557A82"
              >
                <path
                  d="M24.6 89V57.7c0-11 19.9-19.9 19.9-19.9s19.9 8.9 19.9 19.9V89m-.1-16.2v-28c0-11-19.9-19.9-19.9-19.9s-19.9 8.9-19.9 19.9v28m39.8-11.1v-28c0-11-19.9-19.9-19.9-19.9s-19.9 8.9-19.9 19.9v28M2 75.9l42.5 24.5L87 75.9V26.8L44.5 2.3 2 26.8v49.1zm73.9-55.4v61.8M13.1 20.5v61.8"
                  fill="none"
                  stroke="#557A82"
                  strokeWidth="4px"
                  strokeMiterlimit="10"
                ></path>
              </svg>
              <span className="ml-1 font-semibold">Broadcast</span>
              <button
                type="button"
                className="ml-auto p-1 border rounded hover:border-slate-400"
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen);
                }}
              >
                <HamburgerMenuIcon className="w-6 h-6" />
              </button>
            </div>
          </header>
        )}

        {/* overlay */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 z-40 transition-opacity duration-300 backdrop-blur-sm opacity-91"
            onClick={() => {
              setIsMenuOpen(false);
            }}
          ></div>
        )}

        {/* menu drawer */}
        <div
          className={`fixed bottom-0 left-0 right-0 z-50 flex h-3/4 max-h-full max-w-full flex-col bg-white border transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <button
            className="border-b hover:bg-slate-50 mb-2"
            onClick={() => {
              setIsMenuOpen(false);
            }}
          >
            <ChevronDownIcon className="w-5 h-5 mx-auto my-1" />
          </button>
          <ul className="space-y-2 text-sm font-medium">
            {menus.map((menu, index) => (
              <li
                key={index}
                onClick={() => {
                  setIsMenuOpen(false);
                  setSelectedMenu(menu.name);
                }}
              >
                <Link
                  to={menu.path}
                  className={`flex items-center rounded-lg px-3 py-2 hover:bg-slate-100 ${
                    selectedMenu === menu.name
                      ? "text-green-600"
                      : "text-slate-900"
                  }`}
                >
                  {menu.icon}
                  <span className="ml-3 flex-1 whitespace-nowrap">
                    {menu.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="px-4 mt-auto pb-4">{logoutAdmin}</div>
        </div>

        {/* content */}
        <div className="flex-1 flex flex-col h-screen w-full overflow-auto p-4 bg-background max-lg:pt-16">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default App;
