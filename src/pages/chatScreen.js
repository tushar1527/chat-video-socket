import { useEffect, useState, useRef } from "react";
import socket from "./socket";
export const ChatScreen = () => {
  const messagesEndRef = useRef();
  const [dataMessage, setDataMessage] = useState([]);
  const [message, setMessage] = useState();

  let roomId = localStorage.getItem("roomId"),
    userId = localStorage.getItem("userId");

  useEffect(() => {
    socket.emit("init", JSON.parse(localStorage.getItem("roomData")));
  }, [roomId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [message]);

  let data = JSON.parse(localStorage.getItem("roomData"));
  const onsubmit = () => {
    let chatData = {
      roomId: localStorage.getItem("roomId"),
      senderId: localStorage.getItem("userId"),
      content: message,
      receiverId: userId === data.drId ? data.patientId : data.drId,
      type: "MESSAGE",
    };

    let dataSend = {
      isRead: false,
      _id: "",
      content: message,
      senderId: userId,
      type: "MESSAGE",
    };
    console.log("dataSend", dataSend);
    let updatedData = [];
    updatedData = dataMessage;
    updatedData.push(dataSend);

    setDataMessage(updatedData);
    socket.emit("request", chatData);
  };

  socket.on(roomId, (data1) => {
    setDataMessage(data1.chatContent);
    scrollToBottom();
  });
  return (
    <>
      <div className="chat">
        <div className="header">
          <div className="name">
            {roomId + localStorage.getItem("username")}
          </div>
        </div>
        <div className="chatScreen" style={{ overFlow: "scroll" }}>
          {dataMessage?.map((x, index) => {
            return (
              <p
                key={index}
                ref={messagesEndRef}
                className={x.senderId === userId ? "left" : "right"}
              >
                {x.content}
              </p>
            );
          })}
        </div>
        <div className="text">
          <input
            type="text"
            onChange={(e) => setMessage(e.target.value)}
          ></input>
          <button onClick={onsubmit}>submit</button>
        </div>
      </div>
    </>
  );
};
