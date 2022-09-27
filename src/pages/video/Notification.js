import React from "react";
import { Button } from "@mui/material";
const Notification = ({ name, answerCall }) => {
  const acceptCall = () => {
    const config = { audio: true, video: true };
    answerCall(false, name, config);
  };
  return (
    <>
      {name && (
        <div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <h1>call is calling</h1>
            <Button variant="contained" color="primary" onClick={acceptCall}>
              Answer
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Notification;
