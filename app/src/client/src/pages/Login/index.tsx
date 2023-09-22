import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAccount from "@/hooks/account";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAccount();
  const navigate = useNavigate();

  return (
    <div className="w-[100vw] h-[100vh] grid place-items-center">
      <div className="flex flex-col gap-4 items-center justify-stretch">
        <h1 className="text-xl font-bold">Login</h1>
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          className="w-full"
          onClick={() => {
            login(username, password).then((isLoggedIn) => {
              isLoggedIn && navigate("/");
            });
          }}
        >
          Login
        </Button>
      </div>
    </div>
  );
}
