"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var thor_io_connection_provider_1 = require("../../providers/thor-io.connection.provider");
var thor_io_client_vnext_1 = require("thor-io.client-vnext");
var models_1 = require("../../../../shared/models");
var platform_browser_1 = require("@angular/platform-browser");
var http_1 = require("@angular/http");
require("rxjs/add/observable/throw");
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
var ConferenceService = (function () {
    function ConferenceService(connProvider, sanitizer, http) {
        var _this = this;
        this.connProvider = connProvider;
        this.sanitizer = sanitizer;
        this.http = http;
        this.proxy = connProvider.getProxy("contextBroker");
        this.RemoteStreams = new Array();
        this.InstantMessages = new Array();
        var config = {
            iceTransports: 'all',
            iceServers: [
                {
                    urls: "stun:stun.l.google.com:19302"
                }
            ]
        };
        // add your own STUN / turn servers ..
        this.rtc = new thor_io_client_vnext_1.ThorIOClient.WebRTC(this.proxy, config);
        // limit video and audio
        this.rtc.setBandwithConstraints(500, 50);
        this.rtc.OnContextCreated = function () {
        };
        this.rtc.OnLocalStream = function () { };
        this.rtc.OnRemoteStream = function (stream) {
            var safeUrl = sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(stream));
            var participant = new models_1.Participant(stream, safeUrl, stream.id, 1);
            console.log("onRemoteStream primary", participant.primay);
            _this.onParticipant(participant);
            _this.RemoteStreams.push(participant);
        };
        this.rtc.OnRemoteStreamlost = function (streamId, peerId) {
            var remoteStream = _this.findMediaStream(streamId);
            _this.RemoteStreams.splice(_this.RemoteStreams.indexOf(remoteStream), 1);
        };
        this.rtc.OnContextChanged = function (context) {
            _this.context = context;
            _this.rtc.ConnectContext();
        };
        this.proxy.On("instantMessage", function (message) {
            _this.InstantMessages.unshift(message);
        });
    }
    ConferenceService.prototype.onParticipant = function (participant) {
    };
    ConferenceService.prototype.getSlug = function () {
        return this.http.get("/data/slugs.json").map(function (res) {
            var slugs = res.json();
            return slugs[Math.floor(Math.random() * slugs.length)].toString().toLowerCase();
        });
    };
    ConferenceService.prototype.joinConference = function (context) {
        this.proxy.Invoke("changeContext", { context: context });
    };
    ConferenceService.prototype.findMediaStream = function (streamId) {
        var match = this.RemoteStreams.find(function (pre) {
            return pre.id === streamId;
        });
        console.log("103-3aa findMediaStream", this.RemoteStreams.length);
        var len = this.RemoteStreams.length;
        for (var i = 0; i < len; i++) {
            console.log("103-3z", this.RemoteStreams[i].id);
            if (this.RemoteStreams[i].id === streamId)
                match = this.RemoteStreams[i];
        }
        // for (var pre in this.RemoteStreams) {
        //     console.log(this.RemoteStreams[pre], streamId);
        //      if (pre.id === streamId )
        //         match = pre;
        // }   
        console.log("103-3a findMediaStream", streamId);
        console.log("103-3 findMediaStream", match);
        return match;
    };
    // addFirstMediaStream(firstUrl: SafeUrl, stream: MediaStream)
    // {
    //         let participant = new Participant(stream,
    //             firstUrl,
    //             stream.id
    //         );
    //         this.RemoteStreams.push(participant);
    // }
    // findFirstMediaStream(): Participant {
    //        console.log("findFirstMediaStream", this.RemoteStreams);
    //   var match = this.RemoteStreams.find((pre: Participant) => {
    //         return pre.primay === 0;
    //     });
    //     return match;
    // }
    ConferenceService.prototype.addLocalMediaStream = function (stream) {
        console.log("104-addLocalMediaStream");
        this.rtc.AddLocalStream(stream);
        var safeUrl = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(stream));
        var participant = new models_1.Participant(stream, safeUrl, stream.id, 0);
        console.log("addLocalMediaStream primary", participant.primay);
        this.onParticipant(participant);
        this.RemoteStreams.push(participant);
        console.log("105 - addLocalMediaStream -  Participants", this.RemoteStreams);
    };
    ;
    ConferenceService.prototype.connectContext = function (context) {
        this.proxy.Invoke("connectContext", { context: context });
    };
    ConferenceService.prototype.sendInstantMessage = function (instantMessage) {
        instantMessage.timeStamp = new Date();
        this.proxy.Invoke("instantMessage", instantMessage);
    };
    return ConferenceService;
}());
ConferenceService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [thor_io_connection_provider_1.ConnectionProvider, platform_browser_1.DomSanitizer, http_1.Http])
], ConferenceService);
exports.ConferenceService = ConferenceService;
//# sourceMappingURL=conference.service.js.map