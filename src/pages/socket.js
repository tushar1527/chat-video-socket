import socketIOClient from "socket.io-client";
const socket = socketIOClient("http://139.59.75.48:8000", {
  extraHeaders: {
    "Access-Control-Allow-Origin": "*",
  },
});
export default socket;
