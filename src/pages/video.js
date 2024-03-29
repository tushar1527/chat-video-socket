import React, { useContext } from "react";
import { Typography, AppBar } from "@mui/material";
import { makeStyles } from "@mui/styles";
import VideoPlayer from "./video/VideoPlayer";
import Options from "./video/Options";
import Notification from "./video/Notification";
import SocketContext from "../SocketContext";

const useStyles = makeStyles({
  root: {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    border: 0,
    borderRadius: 3,
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    color: "white",
    height: 48,
    padding: "0 30px",
    overflowY: "scroll",
  },
  appBar: {
    borderRadius: 15,
    margin: "30px 100px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    border: "2px solid black",
  },
  image: {
    marginLeft: "15px",
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
});
export const Video = () => {
  const classes = useStyles();
  const { answerCall, call } = useContext(SocketContext.SocketContext);

  return (
    <div className={classes.wrapper}>
      <Typography variant="h2" align="center">
        videoCHat <VideoPlayer />
        <Options>
          {call && <Notification name={call} answerCall={answerCall} />}
        </Options>
      </Typography>
    </div>
  );
};
