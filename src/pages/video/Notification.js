import React from "react";
import { Button } from "@mui/material";
const Notification = ({ name, answerCall }) => {
  return (
    <>
      <div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h1>{name} is calling</h1>
          <Button variant="contained" color="primary" onClick={answerCall}>
            Answer
          </Button>
        </div>
      </div>
    </>
  );
};

export default Notification;
