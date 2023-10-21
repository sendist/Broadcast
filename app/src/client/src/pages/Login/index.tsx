import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAccount from "@/hooks/account";
import { useRef, useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAccount();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-screen h-screen grid place-items-center">
      <div className="flex flex-col gap-4 items-center justify-stretch p-4">
        <div className="mb-4 flex flex-col items-center rounded-lg px-3 py-2 text-slate-900">
          <svg
            className="h-20 w-20"
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
          <span className="ml-1 text-xl font-semibold mt-4">Broadcast</span>
          <span className="ml-1 text-sm text-muted-foreground text-center">
            Login untuk mulai menggunakan Broadcast
          </span>
        </div>
        <Input
          ref={usernameRef}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              passwordRef.current?.focus();
            }
          }}
        />
        <Input
          ref={passwordRef}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              login(username, password);
            }
          }}
        />
        <Button
          className="w-full"
          onClick={() => {
            login(username, password);
          }}
        >
          Login
        </Button>
      </div>
    </div>
  );
}
