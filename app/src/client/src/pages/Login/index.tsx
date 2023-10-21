import Logo from "@/assets/logo";
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
          <Logo className="w-20 h-20" />
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
