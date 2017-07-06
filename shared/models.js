"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ChatMessage = (function () {
    function ChatMessage(message, age) {
        this.message = message;
        this.age = age;
    }
    return ChatMessage;
}());
exports.ChatMessage = ChatMessage;
var Participant = (function () {
    function Participant(stream, url, id, orderid) {
        this.stream = stream;
        this.url = url;
        this.id = id;
        this.orderid = orderid;
    }
    return Participant;
}());
exports.Participant = Participant;
var InstantMessage = (function () {
    function InstantMessage() {
    }
    return InstantMessage;
}());
exports.InstantMessage = InstantMessage;
var PeerConnection = (function () {
    function PeerConnection(context, peerId) {
        this.context = context;
        this.peerId = peerId;
    }
    return PeerConnection;
}());
exports.PeerConnection = PeerConnection;
var Signal = (function () {
    function Signal(recipient, sender, message) {
        this.recipient = recipient;
        this.sender = sender;
        this.message = message;
    }
    return Signal;
}());
exports.Signal = Signal;
//# sourceMappingURL=models.js.map