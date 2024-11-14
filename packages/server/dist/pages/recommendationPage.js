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
var recommendationPage_exports = {};
__export(recommendationPage_exports, {
  RecommendationPage: () => RecommendationPage
});
module.exports = __toCommonJS(recommendationPage_exports);
var import_server = require("@calpoly/mustang/server");
var import_renderPage = __toESM(require("./renderPage"));
class RecommendationPage {
  genreGames;
  priceGames;
  ratingGames;
  constructor(genreGames, priceGames, ratingGames) {
    this.genreGames = genreGames;
    this.priceGames = priceGames;
    this.ratingGames = ratingGames;
  }
  render() {
    return (0, import_renderPage.default)({
      body: this.renderBody(),
      stylesheets: ["/styles/recommendation.css"],
      scripts: []
    });
  }
  renderBody() {
    const genreGames = this.genreGames;
    const priceGames = this.priceGames;
    const ratingGames = this.ratingGames;
    const genreGamesList = genreGames.games.map((game) => {
      return this.renderGame(game);
    });
    const priceGamesList = priceGames.games.map((game) => {
      return this.renderGame(game);
    });
    const ratingGamesList = ratingGames.games.map((game) => {
      return this.renderGame(game);
    });
    return import_server.html`
        <body>
            <header id="rec-head">
            <h1>Recommendations</h1>
            <svg class="icon" id="rec-icon">
                <use href="./icons/game.svg#icon-rec" />
            </svg>
            </header>
            <a href="../">Back to Main</a>
            <dl>
            <dt><h2>Based on Genre</h2></dt>
            <div class="game-layout">
                ${genreGamesList}
            </div>
            <dt><h2>Based on Price</h2></dt>
            <div class="game-layout">
                ${priceGamesList}
            </div>
            <dt><h2>Based on Rating</h2></dt>
            <div class="game-layout">
                ${ratingGamesList}
            </div>
            </dl>
        </body>`;
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
  RecommendationPage
});
