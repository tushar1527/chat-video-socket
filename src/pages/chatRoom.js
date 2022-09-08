import axios from "axios";
import { useNavigate } from "react-router-dom";

export const ChatRoom = () => {
  let navigate = useNavigate();
  const joinChat = async () => {
    let config = {
      method: "post",
      url: "http://139.59.75.48:5001/api/v1/chat-room/create",
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
      url: "http://http://139.59.75.48/api/v1/appointment/get?_id=6315e293758902b3d90f01b8&&video=true",
      headers: {
        "Content-Type": "application/json",
      },
      data: [],
    };
    let dataResponse = await axios(config);
    if (dataResponse) {
      let data = dataResponse?.data?.data[0];

      let updateResponse = {
        drId: data.drId._id,
        appointmentId: "6315e293758902b3d90f01b8",
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
