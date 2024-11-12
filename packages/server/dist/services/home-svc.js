"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var home_svc_exports = {};
__export(home_svc_exports, {
  getGame: () => getGame
});
module.exports = __toCommonJS(home_svc_exports);
const games = {
  games: [
    {
      gameId: "1",
      name: "The Sims 4",
      price: "$29.99",
      genre: "Life Sim",
      rating: 8.6,
      playerCount: 30647
    },
    {
      gameId: "2",
      name: "Stardew Valley",
      price: "$14.99",
      genre: "Farming Sim",
      rating: 9.8,
      playerCount: 77436
    },
    {
      gameId: "3",
      name: "Team Fortress 2",
      price: "Free",
      genre: "FPS",
      rating: 8.8,
      playerCount: 37464
    },
    {
      gameId: "4",
      name: "Grand Theft Auto 5",
      price: "$29.99",
      genre: "Open World",
      rating: 8.7,
      playerCount: 57837
    }
  ]
};
function getGame() {
  return games;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getGame
});
