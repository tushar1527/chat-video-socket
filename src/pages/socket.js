import socketIOClient from "socket.io-client";
const socket = socketIOClient("http://157.245.108.170:8000", {
  extraHeaders: {
    "Access-Control-Allow-Origin": "*",
  },
});
export default socket;
