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
var account_svc_exports = {};
__export(account_svc_exports, {
  default: () => account_svc_default,
  getAccount: () => getAccount
});
module.exports = __toCommonJS(account_svc_exports);
var import_mongoose = require("mongoose");
const account = {
  userId: "1",
  username: "Admin",
  ratedGames: [{
    gameId: "5",
    name: "Cats",
    price: "Free",
    genre: "Clicker",
    rating: 7.4,
    playerCount: 21841
  }]
};
const AccountSchema = new import_mongoose.Schema(
  {
    userId: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true },
    ratedGames: Array
  },
  { collection: "accounts" }
);
const AccountModel = (0, import_mongoose.model)("Profile", AccountSchema);
function index() {
  return AccountModel.find();
}
function get(userId) {
  return AccountModel.find({ userId }).then((list) => list[0]).catch((err) => {
    throw `${userId} not found`;
  });
}
function create(json) {
  const t = new AccountModel(json);
  return t.save();
}
function update(userId, account2) {
  return AccountModel.findOneAndUpdate(
    { userId },
    account2,
    { new: true }
  ).then((updated) => {
    if (!updated) throw `${userId} not updated`;
    else return updated;
  });
}
function remove(userId) {
  return AccountModel.findOneAndDelete({ userId }).then((deleted) => {
    if (!deleted) throw `${userId} not deleted`;
  });
}
var account_svc_default = { index, get, create, update, remove };
function getAccount(_) {
  return account;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getAccount
});
