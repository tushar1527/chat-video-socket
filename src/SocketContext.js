import React, { createContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import PeerConnection from "./pages/PeerConnection";
import mediaDevice from "./pages/mediaDevice";
const MediaDevice = new mediaDevice();

const SocketContext = createContext();

const socket = io("https://way2find.tk");

const ContextProvider = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();

  const [name, setName] = useState("");
  const [call, setCall] = useState({});
  const [me, setMe] = useState("");
  const [receiverId, setReceiverId] = useState(null);

  // peer connection

  const myVideo = useRef(null);
  const userVideo = useRef(null);
  const connectionRef = useRef();
  let pc = [];
  useEffect(() => {
    let userId = localStorage.getItem("userId");
    let roomDetails = JSON.parse(localStorage.getItem("roomData"));

    if (userId == roomDetails?.drId) {
      setReceiverId(roomDetails?.patientSocketId);
    } else {
      setReceiverId(roomDetails?.drSocketId);
    }
    socket.on("me", (id) => setMe(id));

    socket.on("callUser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
    socket.on("callInit", async (data) => {
      let userId = localStorage.getItem("userId");

      if (data.userId == userId) {
        // await callUser(data.patientSocketId);
        setReceiverId(data?.drSocketId);
      } else {
        setReceiverId(data?.patientSocketId);
        // await callUser(data.drSocketId);
      }
    });
  }, []);

  useEffect(() => {
    let roomData = {
      id: me,
      roomId: localStorage.getItem("roomId"),
      userId: localStorage.getItem("userId"),
    };
    socket.emit("updateId", roomData);
  }, [me]);

  const answerCall = () => {
    setCallAccepted(true);
    socket.emit("answerCall", { to: receiverId, signal: call.signal });
    const config = { audio: true, video: true };

    let serverConnect = new PeerConnection(receiverId)
      .on("localStream", (src) => {
        setStream(src);
        myVideo.current.srcObject = src;
      })
      .on("peerStream", (src) => {
        console.log("src", src);
        userVideo.current.srcObject = src;
      });

    serverConnect.start(me, config, receiverId);
    socket.on("callAccepted", (signal) => {
      serverConnect.emit("peerStream", stream);
    });
  };

  const callUser = (id) => {
    setReceiverId(id);
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: localStorage.getItem("senderName"),
        name: localStorage.getItem("receiverName"),
        roomDetails: JSON.parse(localStorage.getItem("roomData")),
      });
    });

    peer.on("stream", (currentStream) => {
      myVideo.current.srcObject = currentStream;
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();

    window.location.reload();
  };

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default { ContextProvider, SocketContext };
