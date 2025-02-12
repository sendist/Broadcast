import { Link, Outlet, useNavigate } from "react-router-dom";
import useAccount from "./hooks/account";
import { Button } from "./components/ui/button";
import { useWindowSize } from "./hooks/windowSize";
import {
  HamburgerMenuIcon,
  ChevronDownIcon,
  ExitIcon,
  DotsHorizontalIcon,
  LockClosedIcon,
} from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import Logo from "./assets/logo";
import { Dialog, DialogTrigger } from "./components/ui/dialog";
import { ChangeSelfPasswordForm } from "./components/custom/changeSelfPassword";
import { useApiFetch } from "./hooks/fetch";
import { BASE_URL } from "./lib/constants";
import { toast } from "./components/ui/use-toast";
import useCustomization from "./hooks/customization";
import CustomizeBrandingDialog from "./components/custom/customizeBrandingDialog";
import {
  HomeIcon,
  KeyRoundIcon,
  NotepadTextDashedIcon,
  ScrollTextIcon,
  SpeechIcon,
  UsersIcon,
} from "lucide-react";

const menus = [
  {
    path: "/home",
    name: "Home",
    icon: <HomeIcon className="w-6 h-6 text-current" />,
  },
  {
    path: "/manage-admin",
    name: "Manage Admin",
    icon: <KeyRoundIcon className="w-6 h-6 text-current" />,
  },
  {
    path: "/template",
    name: "Template",
    icon: <NotepadTextDashedIcon className="w-6 h-6 text-current" />,
  },
  {
    path: "/waclient",
    name: "WA Client",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19.05 4.91C18.1332 3.98392 17.0412 3.24967 15.8376 2.75005C14.6341 2.25043 13.3431 1.99546 12.04 2C6.57999 2 2.12999 6.45 2.12999 11.91C2.12999 13.66 2.58999 15.36 3.44999 16.86L2.04999 22L7.29999 20.62C8.74999 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91ZM12.04 20.15C10.56 20.15 9.10999 19.75 7.83999 19L7.53999 18.82L4.41999 19.64L5.24999 16.6L5.04999 16.29C4.22773 14.977 3.79113 13.4592 3.78999 11.91C3.78999 7.37 7.48999 3.67 12.03 3.67C14.23 3.67 16.3 4.53 17.85 6.09C18.6175 6.85396 19.2257 7.76266 19.6394 8.76342C20.0531 9.76419 20.264 10.8371 20.26 11.92C20.28 16.46 16.58 20.15 12.04 20.15ZM16.56 13.99C16.31 13.87 15.09 13.27 14.87 13.18C14.64 13.1 14.48 13.06 14.31 13.3C14.14 13.55 13.67 14.11 13.53 14.27C13.39 14.44 13.24 14.46 12.99 14.33C12.74 14.21 11.94 13.94 11 13.1C10.26 12.44 9.76999 11.63 9.61999 11.38C9.47999 11.13 9.59999 11 9.72999 10.87C9.83999 10.76 9.97999 10.58 10.1 10.44C10.22 10.3 10.27 10.19 10.35 10.03C10.43 9.86 10.39 9.72 10.33 9.6C10.27 9.48 9.76999 8.26 9.56999 7.76C9.36999 7.28 9.15999 7.34 9.00999 7.33H8.52999C8.35999 7.33 8.09999 7.39 7.86999 7.64C7.64999 7.89 7.00999 8.49 7.00999 9.71C7.00999 10.93 7.89999 12.11 8.01999 12.27C8.13999 12.44 9.76999 14.94 12.25 16.01C12.84 16.27 13.3 16.42 13.66 16.53C14.25 16.72 14.79 16.69 15.22 16.63C15.7 16.56 16.69 16.03 16.89 15.45C17.1 14.87 17.1 14.38 17.03 14.27C16.96 14.16 16.81 14.11 16.56 13.99Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    path: "/jamaah",
    name: "Jamaah",
    icon: <UsersIcon className="w-6 h-6 text-current" />,
  },
  {
    path: "/masjid",
    name: "Masjid",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 21V8.725C0.7 8.54167 0.458333 8.304 0.275 8.012C0.0916667 7.72 0 7.38267 0 7C0 6.61667 0.2 6.15 0.6 5.6C1 5.05 1.46667 4.51667 2 4C2.53333 4.51667 3 5.05 3.4 5.6C3.8 6.15 4 6.61667 4 7C4 7.38333 3.90833 7.72067 3.725 8.012C3.54167 8.30333 3.3 8.541 3 8.725V13H5V11C5 10.5833 5.13333 10.1833 5.4 9.8C5.66667 9.41667 6.05 9.16667 6.55 9.05C6.36667 8.76667 6.22933 8.45833 6.138 8.125C6.04667 7.79167 6.00067 7.45 6 7.1C6 6.43333 6.15833 5.81667 6.475 5.25C6.79167 4.68333 7.21667 4.21667 7.75 3.85L12 1L16.25 3.85C16.7833 4.21667 17.2083 4.68333 17.525 5.25C17.8417 5.81667 18 6.43333 18 7.1C18 7.45 17.954 7.79167 17.862 8.125C17.77 8.45833 17.6327 8.76667 17.45 9.05C17.95 9.16667 18.3333 9.41667 18.6 9.8C18.8667 10.1833 19 10.5833 19 11V13H21V8.725C20.7 8.54167 20.4583 8.304 20.275 8.012C20.0917 7.72 20 7.38267 20 7C20 6.61667 20.2 6.15 20.6 5.6C21 5.05 21.4667 4.51667 22 4C22.5333 4.51667 23 5.05 23.4 5.6C23.8 6.15 24 6.61667 24 7C24 7.38333 23.9083 7.72067 23.725 8.012C23.5417 8.30333 23.3 8.541 23 8.725V21H13V17C13 16.7167 12.904 16.479 12.712 16.287C12.52 16.095 12.2827 15.9993 12 16C11.7167 16 11.479 16.096 11.287 16.288C11.095 16.48 10.9993 16.7173 11 17V21H1ZM9.9 9H14.1C14.6333 9 15.0833 8.81667 15.45 8.45C15.8167 8.08333 16 7.63333 16 7.1C16 6.76667 15.925 6.46233 15.775 6.187C15.625 5.91167 15.4167 5.68267 15.15 5.5L12 3.4L8.85 5.5C8.58333 5.68333 8.375 5.91267 8.225 6.188C8.075 6.46333 8 6.76733 8 7.1C8 7.63333 8.18333 8.08333 8.55 8.45C8.91667 8.81667 9.36667 9 9.9 9ZM3 19H9V17C9 16.1667 9.29167 15.4583 9.875 14.875C10.4583 14.2917 11.1667 14 12 14C12.8333 14 13.5417 14.2917 14.125 14.875C14.7083 15.4583 15 16.1667 15 17V19H21V15H17V11H7V15H3V19Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    path: "/mubaligh",
    name: "Mubaligh",
    icon: <SpeechIcon className="w-6 h-6 text-current" />,
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
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 10.8181 20.7672 9.64778 20.3149 8.55585C19.8626 7.46392 19.1997 6.47177 18.364 5.63604C17.5282 4.80031 16.5361 4.13738 15.4442 3.68508C14.3522 3.23279 13.1819 3 12 3C9.61305 3 7.32387 3.94821 5.63604 5.63604C3.94821 7.32387 3 9.61305 3 12C3 14.3869 3.94821 16.6761 5.63604 18.364C7.32387 20.0518 9.61305 21 12 21ZM23 12C23 18.075 18.075 23 12 23C5.925 23 1 18.075 1 12C1 5.925 5.925 1 12 1C18.075 1 23 5.925 23 12ZM15 16.414L11 12.414V5.5H13V11.586L16.414 15L15 16.414Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    path: "/message-logs",
    name: "Message Logs",
    icon: <ScrollTextIcon className="w-6 h-6 text-current" />,
  },
];

function App() {
  const { account, logout, loading } = useAccount();
  const navigate = useNavigate();
  const apiFetch = useApiFetch();
  const { width } = useWindowSize();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(
    menus.find((menu) => menu.path === location.pathname)?.name ?? menus[0].name
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  useEffect(() => {
    if (!loading && !account && location.pathname !== "/") {
      navigate("/login");
    }
  }, [account, loading, navigate]);
  const { appName } = useCustomization();

  function changePassword(data: {
    old_password: string;
    new_password: string;
    confirm_password: string;
  }) {
    return apiFetch<string>({
      url: `${BASE_URL}/auth/change-password`,
      options: {
        method: "POST",
        body: JSON.stringify(data),
      },
    }).then((res) => {
      if (res?.data) {
        toast({
          title: "Success",
          description: res.data,
        });
        return true;
      }
      return false;
    });
  }

  const logoutAdmin = (
    <div className="mt-auto flex justify-between items-center">
      <span className="text-sm font-medium text-black">
        {account?.username}
      </span>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DialogTrigger asChild>
              <DropdownMenuItem>
                <LockClosedIcon className="mr-2" />
                Change Password
              </DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuItem
              className="text-red-600 focus:bg-red-600 focus:text-white"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              <ExitIcon className="mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ChangeSelfPasswordForm
          onSubmit={(data) => {
            changePassword(data).then((success) => {
              if (success) {
                setDialogOpen(false);
              }
            });
          }}
        />
      </Dialog>
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
              <div className="flex items-center rounded-lg px-3 py-2 text-slate-900">
                <Logo className="w-12 h-12" />
                <span className="ml-1 text-base font-semibold">{appName}</span>
              </div>
              {account?.role === "superadmin" && <CustomizeBrandingDialog />}
              <ul className="space-y-2 text-sm font-medium mt-10">
                {menus.map(
                  (menu, index) =>
                    (account?.role === "superadmin" ||
                      menu.path !== "/manage-admin") && (
                      <li
                        key={index}
                        onClick={() => setSelectedMenu(menu.name)}
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
                    )
                )}
              </ul>
              {logoutAdmin}
            </div>
          </div>
        ) : (
          <header>
            <div className="fixed w-full p-2 flex items-center border border-r border-slate-200 bg-white z-10">
              <Logo className="w-9 h-9" />
              <span className="ml-1 font-semibold">{appName}</span>
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
        <div className="flex-1 flex flex-col h-screen w-full overflow-auto p-4 bg-background max-lg:pt-16 lg:max-1025:pt-16">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default App;
