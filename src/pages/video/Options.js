import React, { useContext, useState } from "react";
import {
  Button,
  TextField,
  Grid,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Assignment, Phone, PhoneDisabled } from "@mui/icons-material";
import SocketContext from "../../SocketContext";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  gridContainer: {
    width: "100%",
  },
  container: {
    width: "600px",
    margin: "35px 0",
    padding: 0,
    // [theme.breakpoints.down("xs")]: {
    //   width: "80%",
    // },
  },
  margin: {
    marginTop: 20,
  },
  padding: {
    padding: 20,
  },
  paper: {
    padding: "10px 20px",
    border: "2px solid black",
  },
}));

const Options = ({ children }) => {
  const {
    name,
    callAccepted,
    setName,
    me,
    callEnded,
    callUser,
    leaveCall,
    screenShare,
  } = useContext(SocketContext.SocketContext);
  setName(localStorage.getItem("roomId"));

  const classes = useStyles();
  const [idToCall, setIdToCall] = useState("");

  return (
    <Container className={classes.container}>
      <Paper elevation={10} className={classes.Paper}>
        <form className={classes.root} noValidate autoComplete="off">
          <Grid container className={classes.gridContainer}>
            <Grid item xs={12} md={6} className={classes.padding}>
              <Typography gutterBottom variant="h6">
                Account info
              </Typography>
              <TextField
                label="Name"
                value={name}
                fullWidth
                onChange={(e) => setName(e.target.value)}
              />
              <CopyToClipboard text={me} className={classes.margin}>
                <Button
                  variant="container"
                  color="primary"
                  fullWidth
                  startIcon={<Assignment fontSize="large" />}
                >
                  copy your Id
                </Button>
              </CopyToClipboard>
            </Grid>

            <Grid item xs={12} md={6} className={classes.padding}>
              <Typography gutterBottom variant="h6">
                Call
              </Typography>
              <TextField
                label="id"
                value={idToCall}
                fullWidth
                onChange={(e) => setIdToCall(e.target.value)}
              />
              {callAccepted && !callEnded ? (
                <>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<PhoneDisabled fontSize="large" />}
                    fullWidth
                    className={classes.margin}
                    onClick={leaveCall}
                  >
                    Hangup
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Phone fontSize="large" />}
                    fullWidth
                    className={classes.margin}
                    onClick={() => screenShare(idToCall)}
                  >
                    screenShare
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Phone fontSize="large" />}
                  fullWidth
                  className={classes.margin}
                  onClick={() => callUser(idToCall)}
                >
                  Hangup
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
        {children}
      </Paper>
    </Container>
  );
};

export default Options;
