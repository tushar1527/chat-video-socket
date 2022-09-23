import React, { useContext } from "react";
import { makeStyles } from "@mui/styles";
import { Grid, Typography, Paper } from "@mui/material";
import SocketContext from "../../SocketContext";
const useStyles = makeStyles({
  video: {
    width: "550px",
    // [theme.breakpoints.down("xs")]: {
    //   width: "300px",
    // },
  },
  gridContainer: {
    justifyContent: "center",

    // [theme.breakpoints.down("xs")]: {
    //   flexDirection: "column",
    // },
  },
  paper: {
    padding: "10px",
    border: "2px solid black",
    margin: "10px",
  },
});
const VideoPlayer = () => {
  const { name, callAccepted, myVideo, userVideo, stream, call } = useContext(
    SocketContext.SocketContext
  );
  const classes = useStyles();

  return (
    <Grid container className={classes.gridContainer}>
      {stream && (
        <Paper className={classes.paper}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              {name || "Name"}
            </Typography>
            <video
              playsInline
              muted
              ref={myVideo}
              autoPlay
              className={classes.video}
              id="video1"
            ></video>
          </Grid>
        </Paper>
      )}
      {callAccepted && (
        <Paper>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              {call.name || "callingUser"}
            </Typography>
            <video
              playsInline
              ref={userVideo}
              autoPlay
              className={classes.video}
              id="video2"
            />
          </Grid>
        </Paper>
      )}
    </Grid>
  );
};

export default VideoPlayer;
