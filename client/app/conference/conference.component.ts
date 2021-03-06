import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { ConferenceService } from '../shared/services/conference.service';
import { Participant, InstantMessage, PeerConnection } from '../../../shared/models';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';



@Pipe({
    name: 'sanitizeUrl'
})
class SanitizeUrl implements PipeTransform {

    constructor(private _sanitizer: DomSanitizer) { }

    transform(v: string): SafeUrl {
        return this._sanitizer.bypassSecurityTrustUrl(v);
    }
}

@Component({
    moduleId: module.id,
    selector: 'conference',
    templateUrl: 'conference.component.html',



})
export class ConferenceComponent {


    LocalStreamUrl: SafeUrl;
    MainVideoUrl: SafeUrl;
    NewStreamUrl: SafeUrl;
    StringMainVideoUrl: string;

    public ContextUrl: string;
    public actionButtonCaption: string;
    public inConference: boolean;
    public InstantMessages: Array<InstantMessage>;
    public InstantMessage: InstantMessage;
    public StreamUrl: string;

    public Participants: Array<Participant>;

    public Context: string; //  context can be condidered as a "room"
    public ParamStreamId: string;

    constructor(private conferenceService: ConferenceService, private sanitizer: DomSanitizer,
        private route: ActivatedRoute

    ) {

        this.actionButtonCaption = "START";

        this.InstantMessages = new Array<InstantMessage>();
        this.InstantMessage = new InstantMessage();

        this.route.params.subscribe((params: Params) => {

            if (params.hasOwnProperty("streamid"))
            {
                this.ParamStreamId = params["streamid"].toString();
            }
            if (!params.hasOwnProperty("slug")) {
                this.NewStreamUrl = "";
                this.conferenceService.getSlug().subscribe((randomSlug: string) => {
                    this.Context = randomSlug;
                    this.ContextUrl = "https://" + location.host + "/#/join/" + randomSlug +
                                            "?NewStreamUrl=" + this.NewStreamUrl;
                });
            } else {
                this.Context = params["slug"].toString();
                this.actionButtonCaption = "JOIN";
                this.ContextUrl = "https://" + location.host + "/#/join/" + this.Context + 
                        "?NewStreamUrl=" + this.NewStreamUrl;
            }
            this.Participants = new Array<Participant>();
            this.Participants = this.conferenceService.RemoteStreams;
            this.InstantMessages = this.conferenceService.InstantMessages;
            
            console.log("101 - constructor -  Participants",this.Participants);
            this.conferenceService.onParticipant = (participant: Participant) => {
                
                 console.log("102 a - onParticipant onParticipant  ",participant.url);
                // console.log("102 b - ParamStreamId  ",this.ParamStreamId);
                this.MainVideoUrl = participant.url;
                // var firstParticipant =  this.conferenceService.findMediaStream(this.ParamStreamId);
                // if (firstParticipant)
                //     this.MainVideoUrl = firstParticipant.url;
                
            }
        });
    }
    sendIM() {
        this.conferenceService.sendInstantMessage(this.InstantMessage);

        this.InstantMessage.text = "";
    }
    changeMainVideo(participant: Participant) {
         console.log("102 - changeMainVideo participant.url ",participant.url);
       // this.MainVideoUrl = participant.url;
                // var firstParticipant =  this.conferenceService.findFirstMediaStream();
                // this.MainVideoUrl = firstParticipant.url;
       
    }

    joinConference() {
        console.log("103-a- joinConference participant.url " );            
        navigator.getUserMedia({ audio: true, video: true }, (stream: MediaStream) => {
            console.log("103 - joinConference participant.url ",this.actionButtonCaption);            
            this.conferenceService.addLocalMediaStream(stream);
            let blobUrl = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(stream));
            this.LocalStreamUrl = blobUrl;
            this.conferenceService.joinConference(this.Context);
            this.inConference = true;
            if (this.actionButtonCaption === "START")
            {
                console.log("LocalStreamUrl " + String(this.LocalStreamUrl));
                //let temp = this.conferenceService.findFirstMediaStream();
                this.MainVideoUrl = this.LocalStreamUrl;
                this.LocalStreamUrl = String(this.LocalStreamUrl);
                this.StringMainVideoUrl = String(this.LocalStreamUrl);
            }
            else
            {
                var firstParticipant =  this.conferenceService.findMediaStream(this.ParamStreamId);
                if (firstParticipant)
                {
                    console.log(firstParticipant.url);
                    this.MainVideoUrl = firstParticipant.url;
                }
            }

             //this.ContextUrl = String(window.URL.createObjectURL(stream));
            // not needed 
        }, (err) => {

            console.log("getUserMedia error", err);
        });



    }


}

