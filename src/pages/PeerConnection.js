import MediaDevice from "./mediaDevice";
import ScreenShare from "./mediaDevice/screenShare";
import Emitter from "./Emitter";
import socket from "./socket";

const PC_CONFIG = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
      ],
    },
  ],
};

class PeerConnection extends Emitter {
  /**
   * Create a PeerConnection.
   * @param {String} friendID - ID of the friend you want to call.
   */

  constructor(friendID) {
    super();
    this.pc = new RTCPeerConnection(PC_CONFIG);
    this.pc.onicecandidate = (event) =>
      socket.emit("call", {
        to: this.friendID,
        candidate: event.candidate,
      });

    this.pc.ontrack = (event) => {
      return this.emit("peerStream", event.streams[0]);
    };
    this.pc.onnegotiationneeded = () => {
      if (this.pc.signalingState != "stable") return;
      else this.createOffer();
    };
    this.mediaDevice = new MediaDevice();

    this.friendID = friendID;
    this.pc.addEventListener("icecandidateerror", (data) => {
      console.log("icecandidateerror", data);
    });
  }

  /**
   * Starting the call
   * @param {Boolean} isCaller
   * @param {Object} config - configuration for the call {audio: boolean, video: boolean}
   */

  start(isCaller, config, callerId) {
    this.mediaDevice
      .on("stream", (stream) => {
        console.log("stream", stream);
        stream.getTracks().forEach((track) => {
          this.pc.addTrack(track, stream);
        });
        this.emit("localStream", stream);

        const friend = this.friendID;
        if (isCaller) {
          socket.emit("requestCall", { to: friend, from: callerId });
        } else this.createOffer();
      })
      .start(config);

    return this;
  }

  /**
   * Stop the call
   * @param {Boolean} isStarter
   */
  stop(isStarter) {
    if (isStarter) {
      socket.emit("end", { to: this.friendID });
    }
    this.mediaDevice.stop();
    this.pc.close();
    this.pc = null;
    this.off();
    return this;
  }

  createOffer() {
    console.log("createoffer");
    this.pc
      .createOffer()
      .then(this.getDescription.bind(this))
      .catch((err) => console.log(err));
    return this;
  }

  createAnswer() {
    console.log("create answe");
    this.pc
      .createAnswer()
      .then(this.getDescription.bind(this))
      .catch((err) => console.log(err));
    return this;
  }

  getDescription(desc) {
    console.log("desc", desc);
    this.pc.setLocalDescription(desc);

    let idToCall = this.friendID
      ? this.friendID
      : localStorage.getItem("friendID");
    console.log("idToCall", desc);
    socket.emit("call", { to: idToCall, sdp: desc });
    return this;
  }

  /**
   * @param {Object} sdp - Session description
   */
  setRemoteDescription(sdp) {
    console.log("sdp", sdp);
    //  type check
    this.pc.setRemoteDescription(new RTCSessionDescription(sdp));
    console.log("this", this);
    return this;
  }

  /**
   * @param {Object} candidate - ICE Candidate
   */
  addIceCandidate(candidate) {
    if (candidate) {
      const iceCandidate = new RTCIceCandidate(candidate);
      this.pc.addIceCandidate(iceCandidate);
      console.log("candidate", candidate);
    }
    return this;
  }
  screenShare() {
    console.log("friendId", this.friendID);
    this.screenShareDevice = new ScreenShare(this.friendID);
    this.screenShareDevice
      .on("screenShare", (stream) => {
        console.log("screenShare", stream);
        stream.getTracks().forEach((track) => {
          this.pc.addTrack(track, stream);
        });
      })
      .start();
  }
}

export default PeerConnection;
