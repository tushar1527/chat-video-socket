import axios from "axios";
import { useNavigate } from "react-router-dom";
import apiUris from "../utils/url";
export const ChatRoom = () => {
  let navigate = useNavigate();
  const joinChat = async () => {
    let config = {
      method: "post",
      url: `${apiUris.account.getUser}api/v1/chat-room/create`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        drId: "62ef944d81cbda2d545341ae",
        appointmentId: "62fcc57bc12443789b9fcd1a",
        patientId: "62f226d12ca70035ca1b0343",
      },
    };
    let dataResponse = await axios(config);
    if (dataResponse) {
      console.log("dataResponse.data.", dataResponse.data);
      let data = {
        drId: "62ef944d81cbda2d545341ae",
        appointmentId: "62fcc57bc12443789b9fcd1a",
        patientId: "62f226d12ca70035ca1b0343",
        roomId: dataResponse.data.roomId,
      };
      localStorage.setItem("roomId", dataResponse.data.roomId);
      localStorage.setItem("roomData", JSON.stringify(data));
      // navigate("/chat/video");
    }
  };
  const joinVideo = async () => {
    let config = {
      method: "GET",
      url: `${apiUris.account.getUser}api/v1/appointment/get?_id=632d99a8516b4947d4a1ff80&&video=true`,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": [
          "GET",
          "POST",
          "PUT",
          "DELETE",
          "OPTIONS",
          "PATCH",
        ],
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept",
        "Access-Control-Allow-Credentials": true,
      },
      data: [],
    };
    let dataResponse = await axios(config);
    if (dataResponse) {
      let data = dataResponse?.data?.data[0];
      console.log("data", data);

      let updateResponse = {
        drId: data.drId._id,
        appointmentId: "632d99a8516b4947d4a1ff80",
        patientId: data?.patientId?._id,
        roomId: dataResponse?.data?.videoRoom[0]?._id,
      };
      console.log("updateResponse", updateResponse);

      localStorage.setItem("roomId", updateResponse?.roomId);
      localStorage.setItem(
        "roomData",
        JSON.stringify(dataResponse?.data?.videoRoom[0])
      );
      let time = {
        startTime: data?.timeSlotId?.startTime,
        endTime: data?.timeSlotId?.endTime,
      };
      localStorage.setItem("callTime", JSON.stringify(time));
      let userId = localStorage.getItem("userId");

      if (data?.drId?._id == userId) {
        localStorage.setItem("senderName", data?.drId?.name);
        localStorage.setItem("receiverName", data?.patientId?.name);
        localStorage.setItem("senderId", data?.drId?._id);
        localStorage.setItem("receiverId", data?.patientId?._id);
      } else {
        localStorage.setItem("receiverName", data?.drId?.name);
        localStorage.setItem("senderName", data?.patientId?.name);
        localStorage.setItem("receiverId", data?.drId?._id);
        localStorage.setItem("senderId", data?.patientId?._id);
      }
    }

    navigate("/chat/video");
  };
  return (
    <>
      <button onClick={joinChat}>Join</button>
      <button onClick={joinVideo}>JoinVideo</button>
    </>
  );
};
