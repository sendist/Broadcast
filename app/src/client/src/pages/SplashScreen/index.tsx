import useAccount from "@/hooks/account";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

export default function SplashScreen({ children }: Props) {
  const { account, loading } = useAccount();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !account) {
      navigate("/login");
    }
  }, [account, loading, navigate]);
  return loading ? (
    <div className="flex flex-col items-center justify-center h-screen" />
  ) : (
    children
  );
}
