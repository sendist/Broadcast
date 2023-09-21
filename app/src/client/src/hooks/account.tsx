import { useContext } from "react";
import { AccountContext } from "@/context/account";

const useAccount = () => {
  // const [account, setAccount] = useState<Account | null>(null);
  const { account, loading, login, refresh, logout } =
    useContext(AccountContext);
  return { account, loading, login, refresh, logout };
};

export default useAccount;
