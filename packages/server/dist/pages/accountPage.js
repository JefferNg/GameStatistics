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
var accountPage_exports = {};
__export(accountPage_exports, {
  AccountPage: () => AccountPage
});
module.exports = __toCommonJS(accountPage_exports);
var import_server = require("@calpoly/mustang/server");
var import_renderPage = __toESM(require("./renderPage"));
class AccountPage {
  data;
  constructor(data) {
    this.data = data;
  }
  render() {
    return (0, import_renderPage.default)({
      body: this.renderBody(),
      stylesheets: ["../styles/account.css"],
      scripts: [
        `import { define, Auth } from "@calpoly/mustang";
                import { GameElement } from "../scripts/game.js";
                import { AccountElement} from "../scripts/account.js";

                define({
                    "game-card": GameElement,
                    "account-card": AccountElement,
                    "mu-auth": Auth.Provider,
                });`
      ]
    });
  }
  renderBody() {
    const {
      userId,
      username,
      profilePicture,
      ratedGames
    } = this.data;
    const header = this.renderHeader(username);
    const gamesList = ratedGames.map((game) => {
      return this.renderGame(game);
    });
    return import_server.html`
        <body>
        <mu-auth provides="stats:auth">
            <account-card src="/api/accounts/${userId}">
                <!-- ${header}
                <a href="../">Back to Main</a>
                <div slot="games-rated" id="games-rated">
                    <h1>Games you Rated</h1>
                    <div slot="games" class="game-layout">
                    ${gamesList}
                    </div>
                </div> -->
            </account-card>
        </mu-auth>
        </body>
        `;
  }
  renderHeader(username, profilePicture) {
    profilePicture = profilePicture ? profilePicture : "../icons/game.svg#icon-user";
    return import_server.html`
        <header slot="acc-head" id="account-head">
            <div id="account-logo">
            <h1 slot="name">${username}</h1>
            <svg slot="profile-pic" class="icon" id="account-icon">
                <use href=${profilePicture} />
            </svg>
            </div>
            <label
            onchange="event.stopPropagation();
                toggleDarkMode(document.body, event.target.checked)"
            >
            <input type="checkbox" />
            Dark mode
            </label>
        </header>
        `;
  }
  renderGame(game) {
    const { gameId, name, price, genre, rating, playerCount } = game;
    return import_server.html`
        <a href="../games/${gameId}"><game-card>
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
  AccountPage
});
