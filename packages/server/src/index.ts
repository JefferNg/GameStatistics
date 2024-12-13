import express, { Request, Response } from "express";
import { HomePage } from "./pages/homePage";
import { getGame } from "./services/home-svc";
import { connect } from "./services/mongo";
import { AccountPage } from "./pages/accountPage";
import Account from "./services/account-svc";
import accounts from "./routes/accounts";
import { GamePage } from "./pages/gamePage";
import Game from "./services/game-svc";
import games from "./routes/games";
import {
  getGamesOnGenre,
  getGamesOnPrice,
  getGamesOnRating,
} from "./services/recommendation-svc";
import { RecommendationPage } from "./pages/recommendationPage";
import { getRatedGame } from "./services/rating-svc";
import { RatingPage } from "./pages/ratingPage";
import auth, { authenticateUser } from "./routes/auth";
import { LoginPage } from "./pages/auth";
import fs from "node:fs/promises";
import path from "path";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

connect("gamedata");
app.use(express.json());
app.use("/api/accounts", authenticateUser, accounts);
app.use("/api/games", games);
app.use("/auth", auth);
app.use("/app", (req: Request, res: Response) => {
  const indexHTML = path.resolve(staticDir, "index.html");
  fs.readFile(indexHTML, { encoding: "utf8" }).then((html) => res.send(html));
});

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello, World");
});

app.get("/", (req: Request, res: Response) => {
  const data = getGame();
  const page = new HomePage(data);

  res.set("Content-Type", "text/html").send(page.render());
});

app.get("/accounts/:userId", (req: Request, res: Response) => {
  const { userId } = req.params;

  Account.get(userId).then((data) => {
    res.set("Content-Type", "text/html").send(new AccountPage(data).render());
  });
});

app.get("/games/:gameId", (req: Request, res: Response) => {
  const { gameId } = req.params;

  Game.get(gameId).then((data) => {
    res.set("Content-Type", "text/html").send(new GamePage(data).render());
  });
});

app.get("/ratings", (req: Request, res: Response) => {
  const games = getRatedGame();
  const page = new RatingPage(games);

  res.set("Content-Type", "text/html").send(page.render());
});

app.get("/recommendations", (req: Request, res: Response) => {
  const genreGames = getGamesOnGenre();
  const pricegames = getGamesOnPrice();
  const ratingGames = getGamesOnRating();
  const page = new RecommendationPage(genreGames, pricegames, ratingGames);

  res.set("Content-Type", "text/html").send(page.render());
});

app.get("/login", (req: Request, res: Response) => {
  const page = new LoginPage();
  res.set("Content-Type", "text/html").send(page.render());
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.use(express.static(staticDir)); //grabs index.html if start page not found
