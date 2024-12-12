import { Home, Game } from "server/models";

export interface Model {
  home?: Home;
  game?: Game;
}

export const init: Model = {};
