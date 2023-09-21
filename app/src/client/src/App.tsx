import { Link, Outlet } from "react-router-dom";
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
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    path: "/masjid",
    name: "Masjid",
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
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M16.5 9.4 7.55 4.24" />
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.29 7 12 12 20.71 7" />
        <line x1="12" x2="12" y1="22" y2="12" />
      </svg>
    ),
  },
];

function App() {
  const { account } = useAccount();
  return (
    <>
      <div className="h-screen w-screen bg-white dark:bg-slate-900 flex flex-row">
        <div
          className="z-40 h-screen w-64 transition-transform"
          aria-label="Sidebar"
        >
          <div className="flex h-full flex-col overflow-y-auto border-r border-slate-200 bg-white px-3 py-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-10 flex items-center rounded-lg px-3 py-2 text-slate-900 dark:text-white">
              <span className="ml-3 text-base font-semibold">Broadcast</span>
            </div>
            <ul className="space-y-2 text-sm font-medium">
              {menus.map((menu) => (
                <li>
                  <Link
                    to={menu.path}
                    className="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
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
                  <span className="text-sm font-medium text-black dark:text-white">
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
                    stroke-width="2"
                    className="h-5 w-5 text-black dark:text-white"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                </PopoverTrigger>
                <PopoverContent>
                  <Button onClick={() => {}}>Logout</Button>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col h-screen w-full overflow-hidden p-4 bg-background">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default App;
