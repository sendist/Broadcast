import QRCode from "react-qr-code";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWebSocket } from "@/hooks/backend";
import { useApiFetch } from "@/hooks/fetch";
import { BASE_URL } from "@/lib/constants";

export default function WaClient() {
  const [waClientInfo, setWaClientInfo] = useState<{
    qr: string;
    state: string;
  }>({
    qr: "",
    state: "LOADING",
  });
  const { lastJsonMessage, sendMessage } = useWebSocket<{
    qr: string;
    /*
    LOADING
    CONFLICT
    CONNECTED
    DEPRECATED_VERSION
    OPENING
    PAIRING
    PROXYBLOCK
    SMB_TOS_BLOCK
    TIMEOUT
    TOS_BLOCK
    UNLAUNCHED
    UNPAIRED
    UNPAIRED_IDLE
    */
    state: "LOADING" | "CONNECTED" | "UNPAIRED" | "UNPAIRED_IDLE" | string;
  }>("/waclient/ws", "/waclient/connect");

  useEffect(() => {
    if (lastJsonMessage !== null) {
      setWaClientInfo(lastJsonMessage);
    }
    console.log(lastJsonMessage);
  }, [lastJsonMessage]);

  const httpCall = useApiFetch();

  return (
    <>
      <div>
        STATUS:{" "}
        <Badge
          className={
            { LOADING: "bg-orange-400", CONNECTED: "bg-green-400" }[
              waClientInfo.state || "DEFAULT"
            ] || "bg-red-400"
          }
        >
          {waClientInfo.state}
        </Badge>
      </div>

      {waClientInfo.state !== "CONNECTED" && (
        <div className="m-4">
          {waClientInfo.qr ? (
            <QRCode value={waClientInfo.qr} />
          ) : (
            <p>QR Code Loading...</p>
          )}
        </div>
      )}
      <div className="flex gap-4">
        <Button
          onClick={() => {
            httpCall({ url: `${BASE_URL}/waclient/logout` });
          }}
        >
          Logout
        </Button>
        <Button onClick={() => sendMessage("refresh")}>Refresh</Button>
      </div>
    </>
  );
}
