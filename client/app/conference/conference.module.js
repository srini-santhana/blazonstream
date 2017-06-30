"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var shared_module_1 = require("../shared/shared.module");
var conference_component_1 = require("./conference.component");
var clipboard_module_1 = require("../directives/clipboard.module");
var conference_routing_1 = require("./conference.routing");
var ConferenceModule = (function () {
    function ConferenceModule() {
    }
    return ConferenceModule;
}());
ConferenceModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule, conference_routing_1.conference_routing, shared_module_1.SharedModule.forRoot(), clipboard_module_1.ClipboardModule],
        declarations: [conference_component_1.ConferenceComponent],
        exports: [conference_component_1.ConferenceComponent]
    })
], ConferenceModule);
exports.ConferenceModule = ConferenceModule;
//# sourceMappingURL=conference.module.js.map