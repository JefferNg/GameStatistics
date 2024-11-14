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
var homePage_exports = {};
__export(homePage_exports, {
  HomePage: () => HomePage
});
module.exports = __toCommonJS(homePage_exports);
var import_server = require("@calpoly/mustang/server");
var import_renderPage = __toESM(require("./renderPage"));
class HomePage {
  data;
  constructor(data) {
    this.data = data;
  }
  render() {
    return (0, import_renderPage.default)({
      body: this.renderBody(),
      stylesheets: ["/styles/index.css"],
      scripts: [
        `import { define } from "@calpoly/mustang";
                import { GameElement } from "./scripts/game.js";

                define({
                    "game-card": GameElement,
                });`
      ]
    });
  }
  renderBody() {
    const header = this.renderHeader();
    const { games } = this.data;
    const gamesList = games.map((game) => {
      return this.renderGame(game);
    });
    return import_server.html`
        <body>
            ${header}
            <div class="game-layout">
                ${gamesList}
            </div>
        </body>`;
  }
  renderHeader() {
    return import_server.html`
        <header>
            <h1>Steam Games Essentials</h1>
            <div>
                <a href="./ratings"> Games Rated </a>
                <svg class="icon"><use href="./icons/game.svg#icon-rate" /></svg>
            </div>
            <div>
                <a href="./recommendations"> Recommended Games </a>
                <svg class="icon"><use href="./icons/game.svg#icon-rec" /></svg>
            </div>
            <label
                onchange="event.stopPropagation();
                toggleDarkMode(document.body, event.target.checked)">
                <input type="checkbox" />
                Dark mode
            </label>
            <h3>
                <a href="/accounts/1">
                    <svg class="icon">
                    <use href="./icons/game.svg#icon-user" />
                    </svg>
                    Account
                </a>
            </h3>
        </header>`;
  }
  renderGame(game) {
    const { gameId, name, price, genre, rating, playerCount } = game;
    return import_server.html`
        <a href="/games/${gameId}"><game-card>
        <h1 slot="game-name">${name}</h1>
        <li slot="price">Price: ${price}</li>
        <li slot="genre">Genre: ${genre}</li>
        <li slot="rating">Rating: ${rating}</li>
        <li slot="player-count">Current Players: ${playerCount}</li>
        </game-card></a>`;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HomePage
});
