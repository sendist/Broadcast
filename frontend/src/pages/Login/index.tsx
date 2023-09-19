import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function login() {
    console.log(username, password);
  }

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
        <Button className="w-full" onClick={login}>
          Login
        </Button>
      </div>
    </div>
  );
}
