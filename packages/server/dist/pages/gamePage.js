"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var gamePage_exports = {};
__export(gamePage_exports, {
  GamePage: () => GamePage
});
module.exports = __toCommonJS(gamePage_exports);
var import_server = require("@calpoly/mustang/server");
var import_renderPage = __toESM(require("./renderPage"));
class GamePage {
  data;
  constructor(data) {
    this.data = data;
  }
  render() {
    return (0, import_renderPage.default)({
      body: this.renderBody(),
      stylesheets: ["../styles/game.css"],
      scripts: []
    });
  }
  renderBody() {
    const {
      gameId,
      name,
      price,
      genre,
      rating,
      playerCount
    } = this.data;
    return import_server.html`
        <body>
            <header>
            <h1>${name}</h1>
            <div>
                <a href="./rating.html"> Games Rated </a>
                <svg class="icon"><use href="../icons/game.svg#icon-rate" /></svg>
            </div>
            <div>
                <a href="../recommendations"> Recommended Games </a>
                <svg class="icon"><use href="../icons/game.svg#icon-rec" /></svg>
            </div>
            <h3>
                <a href="../accounts/1"
                ><svg class="icon">
                    <use href="../icons/game.svg#icon-user" />
                </svg>
                Account
                </a>
            </h3>
            </header>
            <a href="../">Back to Main</a>
            <div
            id="game-content"
            style="background-image: url('../image/video-game-background.png')"
            >
            <ul>
                <li>${price}</li>
                <li>${genre}</li>
                <li>${rating}</li>
                <li>${playerCount}</li>
            </ul>
            </div>
        </body>`;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GamePage
});
