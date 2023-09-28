import { useContext } from "react";
import { AccountContext } from "@/context/account";

const useAccount = () => {
  return useContext(AccountContext);
};

export default useAccount;
