import useAccount from "@/hooks/account";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  children: JSX.Element;
};

export default function SplashScreen({ children }: Props) {
  const { account, loading } = useAccount();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !account && location.pathname !== "/") {
      navigate("/login");
    }
  }, [account, loading, navigate, location]);
  
  return loading ? (
    <div className="flex flex-col items-center justify-center h-screen" />
  ) : (
    children
  );
}
