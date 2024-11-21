"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var import_express = __toESM(require("express"));
var import_homePage = require("./pages/homePage");
var import_home_svc = require("./services/home-svc");
var import_mongo = require("./services/mongo");
var import_accountPage = require("./pages/accountPage");
var import_account_svc = __toESM(require("./services/account-svc"));
var import_accounts = __toESM(require("./routes/accounts"));
var import_gamePage = require("./pages/gamePage");
var import_game_svc = __toESM(require("./services/game-svc"));
var import_games = __toESM(require("./routes/games"));
var import_recommendation_svc = require("./services/recommendation-svc");
var import_recommendationPage = require("./pages/recommendationPage");
var import_rating_svc = require("./services/rating-svc");
var import_ratingPage = require("./pages/ratingPage");
var import_auth = __toESM(require("./routes/auth"));
var import_auth2 = require("./pages/auth");
const app = (0, import_express.default)();
const port = process.env.PORT || 3e3;
const staticDir = process.env.STATIC || "public";
(0, import_mongo.connect)("gamedata");
app.use(import_express.default.json());
app.use("/api/accounts", import_auth.authenticateUser, import_accounts.default);
app.use("/api/games", import_games.default);
app.use("/auth", import_auth.default);
app.get("/hello", (req, res) => {
  res.send("Hello, World");
});
app.get(
  "/",
  (req, res) => {
    const data = (0, import_home_svc.getGame)();
    const page = new import_homePage.HomePage(data);
    res.set("Content-Type", "text/html").send(page.render());
  }
);
app.get(
  "/accounts/:userId",
  (req, res) => {
    const { userId } = req.params;
    import_account_svc.default.get(userId).then((data) => {
      res.set("Content-Type", "text/html").send(new import_accountPage.AccountPage(data).render());
    });
  }
);
app.get(
  "/games/:gameId",
  (req, res) => {
    const { gameId } = req.params;
    import_game_svc.default.get(gameId).then((data) => {
      res.set("Content-Type", "text/html").send(new import_gamePage.GamePage(data).render());
    });
  }
);
app.get(
  "/ratings",
  (req, res) => {
    const games2 = (0, import_rating_svc.getRatedGame)();
    const page = new import_ratingPage.RatingPage(games2);
    res.set("Content-Type", "text/html").send(page.render());
  }
);
app.get(
  "/recommendations",
  (req, res) => {
    const genreGames = (0, import_recommendation_svc.getGamesOnGenre)();
    const pricegames = (0, import_recommendation_svc.getGamesOnPrice)();
    const ratingGames = (0, import_recommendation_svc.getGamesOnRating)();
    const page = new import_recommendationPage.RecommendationPage(genreGames, pricegames, ratingGames);
    res.set("Content-Type", "text/html").send(page.render());
  }
);
app.get("/login", (req, res) => {
  const page = new import_auth2.LoginPage();
  res.set("Content-Type", "text/html").send(page.render());
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
app.use(import_express.default.static(staticDir));
