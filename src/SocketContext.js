import React, { createContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import PeerConnection from "./pages/PeerConnection";
import mediaDevice from "./pages/mediaDevice";

const MediaDevice = new mediaDevice();

const SocketContext = createContext();

const socket = io("http://localhost:9000");

const ContextProvider = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [remoteStream, setRemoteStream] = useState();

  const [name, setName] = useState("");
  const [call, setCall] = useState();
  const [me, setMe] = useState("");
  const [receiverId, setReceiverId] = useState(null);

  // peer connection

  const myVideo = useRef(null);
  const userVideo = useRef(null);
  const connectionRef = useRef();
  let pc = [];
  useEffect(() => {
    socket.on("me", (id) => setMe(id));
  }, []);

  useEffect(() => {
    let roomData = {
      id: me,
      roomId: localStorage.getItem("roomId"),
      userId: localStorage.getItem("userId"),
    };
    socket.emit("updateId", roomData);
    socket.on("request", ({ from: callFrom }) => {
      setCall(callFrom);
    });
  }, [me]);

  const callUser = (friendID) => {
    console.log("friendID", friendID);
    const config = { audio: true, video: true };
    const peerObj = new PeerConnection(friendID)
      .on("localStream", (src) => {
        console.log("Streamfr", src);
        setStream(src);
        myVideo.current.srcObject = src;
      })
      .on("peerStream", (src) => {
        console.log("perStreamfr", src);
        setRemoteStream(src);
      });
    peerObj.start(true, config, me);
  };
  const answerCall = (isCaller, friendID, config) => {
    setCallAccepted(true);
    const peerObj = new PeerConnection(friendID)
      .on("localStream", (src) => {
        console.log("localStream", src);
        myVideo.current.srcObject = src;
      })
      .on("peerStream", (src) => {
        console.log("perStream", src);
        userVideo.current.srcObject = src;
      });
    peerObj.start(false, config, me);
    socket.on("call", (data) => {
      if (data.sdp) {
        console.log("datasdp", data);
        peerObj.setRemoteDescription(data.sdp);

        if (data.sdp.type === "offer") peerObj.createAnswer();
      } else {
        peerObj.addIceCandidate(data.candidate);
      }
    });
  };
  const leaveCall = () => {};
  const startCall = () => {};
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
