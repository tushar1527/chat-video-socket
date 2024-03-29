import _ from "lodash";
import Emitter from "../Emitter";

/**
 * Manage all media devices
 */
class ScreenShare extends Emitter {
  /**
   * Start media devices and send stream
   */
  start() {
    const constraints = {
      video: { cursor: "always", height: 1000, width: 1200 },

      audio: true,
    };

    navigator.mediaDevices
      .getDisplayMedia(constraints)
      .then((stream) => {
        this.stream = stream;
        this.emit("screenShare", stream);
      })
      .catch((err) => {
        if (err instanceof DOMException) {
          alert("Cannot open webcam and/or microphone");
        } else {
          console.log(err);
        }
      });

    return this;
  }

  /**
   * Turn on/off a device
   * @param {String} type - Type of the device
   * @param {Boolean} [on] - State of the device
   */
  toggle(type, on) {
    const len = arguments.length;
    if (this.stream) {
      this.stream[`get${type}Tracks`]().forEach((track) => {
        const state = len === 2 ? on : !track.enabled;
        _.set(track, "enabled", state);
      });
    }
    return this;
  }

  /**
   * Stop all media track of devices
   */
  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
    return this;
  }
}

export default ScreenShare;
