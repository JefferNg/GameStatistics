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
var rating_svc_exports = {};
__export(rating_svc_exports, {
  getRatedGame: () => getRatedGame
});
module.exports = __toCommonJS(rating_svc_exports);
const games = {
  games: [
    {
      gameId: "5",
      name: "Cats",
      price: "Free",
      genre: "Clicker",
      rating: 7.4,
      playerCount: 21841
    }
  ]
};
function getRatedGame() {
  return games;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getRatedGame
});
