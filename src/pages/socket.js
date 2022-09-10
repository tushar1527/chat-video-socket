import socketIOClient from "socket.io-client";
const socket = socketIOClient("https://my-vicearmory.tk:8000", {
  extraHeaders: {
    "Access-Control-Allow-Origin": "*",
  },
});
export default socket;
