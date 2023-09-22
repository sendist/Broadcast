import useWebSocket, { SendMessage } from "react-use-websocket";
import QRCode from "react-qr-code";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCRUD } from "@/hooks/backend";
import { Badge } from "@/components/ui/badge";

export default function WaClient() {
  const [waClientInfo, setWaClientInfo] = useState<{
    qr: string;
    state: string;
  }>({
    qr: "",
    state: "LOADING",
  });
  const {
    lastJsonMessage,
    sendMessage,
  }: {
    lastJsonMessage: {
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
    } | null;
    sendMessage: SendMessage;
  } = useWebSocket("ws://localhost:3000/api/waclient/connect");

  useEffect(() => {
    if (lastJsonMessage !== null) {
      setWaClientInfo(lastJsonMessage);
    }
    console.log(lastJsonMessage);
  }, [lastJsonMessage]);

  const { get } = useCRUD({
    url: "/waclient/logout",
    initialGet: false,
  });

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
            get();
          }}
        >
          Logout
        </Button>
        <Button onClick={() => sendMessage("refresh")}>Refresh</Button>
      </div>
    </>
  );
}
