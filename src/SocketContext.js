import React, { createContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";

import PeerConnection from "./pages/PeerConnection";
import mediaDevice from "./pages/mediaDevice";

const MediaDevice = new mediaDevice();

const SocketContext = createContext();

const socket = io("http://157.245.108.170:8000");

const ContextProvider = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [remoteStream, setRemoteStream] = useState();

  const [name, setName] = useState("");
  const [call, setCall] = useState();
  const [me, setMe] = useState("");
  console.log("me", me);
  const [receiverId, setReceiverId] = useState(null);

  // peer connection

  const myVideo = useRef(null);
  const userVideo = useRef(null);
  const connectionRef = useRef();
  let pc = [];
  useEffect(() => {
    socket.on("videoInit", (id) => {
      localStorage.setItem("me", id.id);
      setMe(id.id);
    });
    socket.emit("videoInit", "a");
    console.log("aaa", me);
  }, []);

  useEffect(() => {
    let roomData = {
      id: me,
      roomId: localStorage.getItem("roomId"),
      userId: localStorage.getItem("userId"),
    };
    socket.on("requestCall", ({ from: callFrom }) => {
      localStorage.setItem("friendID", callFrom);
      setCall({ callFrom, notification: callFrom });
    });
  }, [me]);

  const callUser = (friendID) => {
    console.log("friendID", friendID);
    localStorage.setItem("friendID", friendID);
    const config = { audio: false, video: true };
    const peerObj = new PeerConnection(friendID)
      .on("localStream", async (src) => {
        setStream(src);
        myVideo.current.srcObject = src;
      })
      .on("peerStream", (src) => {
        setRemoteStream(src);
      })
      .on("screenShare", (src) => {
        console.log("screenShareStream2");
      });
    peerObj.start(true, config, me);
  };
  const answerCall = (isCaller, friendID, config) => {
    setCallAccepted(true);
    setCall({ ...call, notification: "" });
    const peerObj = new PeerConnection(friendID)
      .on("localStream", (src) => {
        console.log("localStream", src);
        myVideo.current.srcObject = src;
      })
      .on("peerStream", (src) => {
        console.log("perStream", src);
        userVideo.current.srcObject = src;
      })
      .on("screenShare", (src) => {
        console.log("screenShareStream", src);
      });
    peerObj.start(false, config, me);
    socket.on("call", (data) => {
      console.log("call", data);
      if (data.sdp) {
        peerObj.setRemoteDescription(data.sdp);

        if (data.sdp.type === "offer") peerObj.createAnswer();
      } else {
        console.log("ice candidayte");
        peerObj.addIceCandidate(data.candidate);
      }
    });
  };

  const screenShare = (friendID) => {
    let friendId = localStorage.getItem("friendID");
    const peerObj = new PeerConnection(friendId);
    console.log("peerObj", peerObj);
    peerObj.screenShare();
    socket.on("screenShare", (data) => {
      console.log("screenshare dara", data);
    });
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
        screenShare,
        // leaveCall,
        answerCall,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default { ContextProvider, SocketContext };
