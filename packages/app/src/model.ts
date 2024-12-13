import { Home, Game, Account, Rating, Recommendation } from "server/models";

export interface Model {
  home?: Home;
  game?: Game;
  account?: Account;
  rating?: Rating;
  recommendation?: Recommendation;
}

export const init: Model = {};
