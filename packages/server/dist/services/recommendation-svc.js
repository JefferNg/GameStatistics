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
var recommendation_svc_exports = {};
__export(recommendation_svc_exports, {
  getGamesOnGenre: () => getGamesOnGenre,
  getGamesOnPrice: () => getGamesOnPrice,
  getGamesOnRating: () => getGamesOnRating
});
module.exports = __toCommonJS(recommendation_svc_exports);
const gamesOnGenre = {
  games: [
    {
      gameId: "6",
      name: "Counter-Strike 2",
      price: "Free",
      genre: "Shooter",
      rating: 8.7,
      playerCount: 568282
    },
    {
      gameId: "3",
      name: "Team Fortress 2",
      price: "Free",
      genre: "FPS",
      rating: 8.8,
      playerCount: 37464
    }
  ]
};
const gamesOnPrice = {
  games: [
    {
      gameId: "5",
      name: "Cats",
      price: "Free",
      genre: "Clicker",
      rating: 7.4,
      playerCount: 21841
    },
    {
      gameId: "7",
      name: "Banana",
      price: "Free",
      genre: "Clicker",
      rating: 8,
      playerCount: 425832
    }
  ]
};
const gamesOnRating = {
  games: [
    {
      gameId: "2",
      name: "Stardew Valley",
      price: "$14.99",
      genre: "Farming Sim",
      rating: 9.8,
      playerCount: 77436
    },
    {
      gameId: "8",
      name: "Baldur's Gate 3",
      price: "$59.99",
      genre: "RPG",
      rating: 9.6,
      playerCount: 36927
    }
  ]
};
function getGamesOnPrice() {
  return gamesOnPrice;
}
function getGamesOnGenre() {
  return gamesOnGenre;
}
function getGamesOnRating() {
  return gamesOnRating;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getGamesOnGenre,
  getGamesOnPrice,
  getGamesOnRating
});
