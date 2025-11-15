import useWebSocket from "react-use-websocket";

export function useOrderSocket(orderId: string) {
  const { lastJsonMessage } = useWebSocket(
    `${process.env.NEXT_PUBLIC_WS_URL}/api/socket`,
    {
      share: true,
      queryParams: { orderId },
      // onOpen: (sock) => sock.sendJsonMessage({ join: orderId }),
    },
  );
  return lastJsonMessage as
    | { type: "driver-location"; lat: number; lng: number }
    | { type: "status"; value: string }
    | null;
}
