class WanwuLiveSDK {
  constructor(options) {
    this.serverUrl = options.serverUrl;
    this.ws = null;
    this.roomId = null;
    this.user = null;
  }

  connect() {
    this.ws = new WebSocket(this.serverUrl);

    this.ws.onopen = () => {
      console.log("[WanwuLiveSDK] Connected");
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("[WanwuLiveSDK] Message:", data);
      } catch (e) {
        console.log("[WanwuLiveSDK] Raw Message:", event.data);
      }
    };

    this.ws.onclose = () => {
      console.log("[WanwuLiveSDK] Disconnected");
    };
  }

  joinRoom(roomId, user) {
    this.roomId = roomId;
    this.user = user;

    this.ws.send(JSON.stringify({
      type: "join",
      roomId: roomId,
      user: user
    }));
  }

  sendMessage(message) {
    if (!this.ws) return;

    this.ws.send(JSON.stringify({
      type: "chat",
      roomId: this.roomId,
      user: this.user,
      message: message,
      timestamp: Date.now()
    }));
  }

  leaveRoom() {
    if (!this.ws) return;

    this.ws.send(JSON.stringify({
      type: "leave",
      roomId: this.roomId,
      user: this.user
    }));
  }
}

if (typeof module !== "undefined") {
  module.exports = WanwuLiveSDK;
}
