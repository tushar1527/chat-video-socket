import MediaDevice from "./mediaDevice";
import Emitter from "./Emitter";
import socket from "./socket";

const PC_CONFIG = { iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }] };

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

    this.pc.ontrack = (event) => this.emit("peerStream", event.streams[0]);
    // this.pc.onnegotiationneeded = () => {
    //   this.createOffer();
    // };
    this.mediaDevice = new MediaDevice();
    this.friendID = friendID;
  }

  /**
   * Starting the call
   * @param {Boolean} isCaller
   * @param {Object} config - configuration for the call {audio: boolean, video: boolean}
   */

  start(isCaller, config, callerId) {
    console.log("callerId", callerId);
    console.log("isCaller", isCaller);
    this.mediaDevice
      .on("stream", (stream) => {
        console.log("startstream", stream);
        stream.getTracks().forEach((track) => {
          this.pc.addTrack(track, stream);
        });
        this.emit("localStream", stream);
        this.emit("peerStream", { stream, id: callerId });
        const friend = this.friendID;
        if (isCaller) socket.emit("request", { to: friend, from: callerId });
        else this.createOffer();
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
    this.pc
      .createOffer()
      .then(this.getDescription.bind(this))
      .catch((err) => console.log(err));
    return this;
  }

  createAnswer() {
    this.pc
      .createAnswer()
      .then(this.getDescription.bind(this))
      .catch((err) => console.log(err));
    return this;
  }

  getDescription(desc) {
    this.pc.setLocalDescription(desc);
    socket.emit("call", { to: this.friendID, sdp: desc });
    return this;
  }

  /**
   * @param {Object} sdp - Session description
   */
  setRemoteDescription(sdp) {
    const rtcSdp = new RTCSessionDescription(sdp);
    this.pc.setRemoteDescription(rtcSdp);
    return this;
  }

  /**
   * @param {Object} candidate - ICE Candidate
   */
  addIceCandidate(candidate) {
    if (candidate) {
      const iceCandidate = new RTCIceCandidate(candidate);
      this.pc.addIceCandidate(iceCandidate);
    }
    return this;
  }
}

export default PeerConnection;
