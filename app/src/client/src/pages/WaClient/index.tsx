import QRCode from "react-qr-code";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWebSocket } from "@/hooks/backend";
import { useApiFetch } from "@/hooks/fetch";
import { BASE_URL } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function WaClient() {
  const [waClientInfo, setWaClientInfo] = useState<{
    qr: string;
    state: string;
  }>({
    qr: "",
    state: "LOADING",
  });
  const { lastJsonMessage } = useWebSocket<{
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

  // TEMPORARY
  const [noHP, setNoHP] = useState("");

  return (
    <>
      <div>
        <h1 className="inline-block text-xl font-semibold">WA Client</h1>
        <p className="text-sm text-muted-foreground">
          Hubungkan WhatsApp Client untuk melakukan broadcast
        </p>
      </div>
      <Card className="xl:mx-24 lg:mx-8 m-4 lg:mt-24 py-6 sm:py-12 px-2 sm:px-8 rounded-md">
        <div className="flex flex-col items-center gap-y-10 lg:flex-row lg:justify-between px-4 h-full">
          <div>
            {waClientInfo.state !== "CONNECTED" ? (
              <>
                <h1 className="font-thin text-2xl sm:text-4xl mb-6">
                  Hubungkan WhatsApp Anda
                </h1>
                <ol className="list-decimal text-md mx-4 sm:mx-8">
                  <li>Buka WhatsApp di telepon Anda</li>
                  <li>
                    Buka setelan dengan mengetuk foto profil Anda,{" "}
                    <strong>
                      Menu{" "}
                      <span className="inline-block mx-1">
                        <svg height="24px" viewBox="0 0 24 24" width="24px">
                          <rect
                            fill="#f2f2f2"
                            height="24"
                            rx="3"
                            width="24"
                          ></rect>
                          <path
                            d="m12 15.5c.825 0 1.5.675 1.5 1.5s-.675 1.5-1.5 1.5-1.5-.675-1.5-1.5.675-1.5 1.5-1.5zm0-2c-.825 0-1.5-.675-1.5-1.5s.675-1.5 1.5-1.5 1.5.675 1.5 1.5-.675 1.5-1.5 1.5zm0-5c-.825 0-1.5-.675-1.5-1.5s.675-1.5 1.5-1.5 1.5.675 1.5 1.5-.675 1.5-1.5 1.5z"
                            fill="#818b90"
                          ></path>
                        </svg>
                      </span>
                    </strong>
                    , atau{" "}
                    <strong>
                      Setelan{" "}
                      <span className="inline-block mx-1">
                        <svg width="24" height="24" viewBox="0 0 24 24">
                          <rect
                            fill="#F2F2F2"
                            width="24"
                            height="24"
                            rx="3"
                          ></rect>
                          <path
                            d="M12 18.69c-1.08 0-2.1-.25-2.99-.71L11.43 14c.24.06.4.08.56.08.92 0 1.67-.59 1.99-1.59h4.62c-.26 3.49-3.05 6.2-6.6 6.2zm-1.04-6.67c0-.57.48-1.02 1.03-1.02.57 0 1.05.45 1.05 1.02 0 .57-.47 1.03-1.05 1.03-.54.01-1.03-.46-1.03-1.03zM5.4 12c0-2.29 1.08-4.28 2.78-5.49l2.39 4.08c-.42.42-.64.91-.64 1.44 0 .52.21 1 .65 1.44l-2.44 4C6.47 16.26 5.4 14.27 5.4 12zm8.57-.49c-.33-.97-1.08-1.54-1.99-1.54-.16 0-.32.02-.57.08L9.04 5.99c.89-.44 1.89-.69 2.96-.69 3.56 0 6.36 2.72 6.59 6.21h-4.62zM12 19.8c.22 0 .42-.02.65-.04l.44.84c.08.18.25.27.47.24.21-.03.33-.17.36-.38l.14-.93c.41-.11.82-.27 1.21-.44l.69.61c.15.15.33.17.54.07.17-.1.24-.27.2-.48l-.2-.92c.35-.24.69-.52.99-.82l.86.36c.2.08.37.05.53-.14.14-.15.15-.34.03-.52l-.5-.8c.25-.35.45-.73.63-1.12l.95.05c.21.01.37-.09.44-.29.07-.2.01-.38-.16-.51l-.73-.58c.1-.4.19-.83.22-1.27l.89-.28c.2-.07.31-.22.31-.43s-.11-.35-.31-.42l-.89-.28c-.03-.44-.12-.86-.22-1.27l.73-.59c.16-.12.22-.29.16-.5-.07-.2-.23-.31-.44-.29l-.95.04c-.18-.4-.39-.77-.63-1.12l.5-.8c.12-.17.1-.36-.03-.51-.16-.18-.33-.22-.53-.14l-.86.35c-.31-.3-.65-.58-.99-.82l.2-.91c.03-.22-.03-.4-.2-.49-.18-.1-.34-.09-.48.01l-.74.66c-.39-.18-.8-.32-1.21-.43l-.14-.93a.426.426 0 00-.36-.39c-.22-.03-.39.05-.47.22l-.44.84-.43-.02h-.22c-.22 0-.42.01-.65.03l-.44-.84c-.08-.17-.25-.25-.48-.22-.2.03-.33.17-.36.39l-.13.88c-.42.12-.83.26-1.22.44l-.69-.61c-.15-.15-.33-.17-.53-.06-.18.09-.24.26-.2.49l.2.91c-.36.24-.7.52-1 .82l-.86-.35c-.19-.09-.37-.05-.52.13-.14.15-.16.34-.04.51l.5.8c-.25.35-.45.72-.64 1.12l-.94-.04c-.21-.01-.37.1-.44.3-.07.2-.02.38.16.5l.73.59c-.1.41-.19.83-.22 1.27l-.89.29c-.21.07-.31.21-.31.42 0 .22.1.36.31.43l.89.28c.03.44.1.87.22 1.27l-.73.58c-.17.12-.22.31-.16.51.07.2.23.31.44.29l.94-.05c.18.39.39.77.63 1.12l-.5.8c-.12.18-.1.37.04.52.16.18.33.22.52.14l.86-.36c.3.31.64.58.99.82l-.2.92c-.04.22.03.39.2.49.2.1.38.08.54-.07l.69-.61c.39.17.8.33 1.21.44l.13.93c.03.21.16.35.37.39.22.03.39-.06.47-.24l.44-.84c.23.02.44.04.66.04z"
                            fill="#818b90"
                          ></path>
                        </svg>
                      </span>
                    </strong>
                  </li>
                  <li className="">
                    Ketuk <strong>Perangkat tertaut</strong>, lalu{" "}
                    <strong>Tautkan perangkat</strong>
                  </li>
                  <li>
                    Arahkan telepon Anda ke layar ini untuk memindai kode QR
                  </li>
                </ol>
              </>
            ) : (
              <>
                <h1 className="font-thin text-3xl mb-6">
                  WhatsApp Anda Telah Terhubung
                </h1>
                <p>
                  Kini anda dapat menggunakan fungsi broadcasting untuk jadwal
                  pengajian dan jum'atan. Pilih menu "Jadwal Pengajian" atau
                  "Jadwal Jumatan" lalu tekan tombol "Broadcasting" untuk
                  melakukan broadcasting.
                </p>
                <div className="mt-4 flex flex-col gap-y-2">
                  <h2 className="text-xl">Test WhatsApp Client</h2>
                  <p>
                    Untuk memeriksa apakah fitur WA Client ataupun Broadcasting
                    sudah berjalan atau tidak, cobalah untuk mengisi nomor
                    WhatsApp Anda pada kolom ini untuk dikirimkan pesan default.
                  </p>
                  <div></div>
                  <Input
                    placeholder="no. HP"
                    value={noHP}
                    onChange={(e) => setNoHP(e.target.value)}
                    className="max-w-[256px]"
                  />
                  <Button
                    onClick={() =>
                      httpCall({
                        url: `${BASE_URL}/waclient/sanitycheck`,
                        options: {
                          body: JSON.stringify({ phone: noHP }),
                          method: "POST",
                        },
                      })
                    }
                    className="max-w-[256px]"
                  >
                    Send Test Message
                  </Button>
                </div>
              </>
            )}
          </div>
          <div
            className={`flex ${
              waClientInfo.state === "CONNECTED"
                ? "lg:flex-col"
                : "flex-col items-center"
            } lg:items-start justify-between lg:ml-8 h-full max-lg:w-full`}
          >
            <div className="sm:ml-4 flex gap-x-2">
              <span className="text-xl font-light">STATUS: </span>
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
            {waClientInfo.state === "CONNECTED" && (
              <div className="self-end">
                <Button
                  onClick={() => {
                    httpCall({ url: `${BASE_URL}/waclient/logout` });
                  }}
                  className="w-full bg-red-600"
                >
                  Logout
                </Button>
              </div>
            )}

            {waClientInfo.state !== "CONNECTED" && (
              <div className="mb-4">
                {waClientInfo.qr ? (
                  <div className="w-[128px] h-[128px] sm:w-[256px] sm:h-[256px] relative p-4 box-content bg-white">
                    <div className="absolute top-0 left-0 right-0 bottom-0 grid place-items-center p-2 sm:p-4">
                      <QRCode
                        value={waClientInfo.qr}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="absolute z-10 left-0 right-0 bottom-0 top-0 text-center grid place-items-center">
                      <div className="relative">
                        <div className="w-8 h-8 sm:w-16 sm:h-16 bg-[url('broadcast-logo.svg')] bg-contain bg-no-repeat bg-center" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-[256px] h-[256px] relative p-4 box-content flex flex-col place-content-center place-items-center bg-white">
                    <p className="text-center self-center mb-8">
                      QR Code Loading...
                    </p>
                    <svg
                      className="animate-spin h-14 w-14 text-black"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    </>
  );
}
