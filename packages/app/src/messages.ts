import { Game } from "server/models";

export type Msg =
  | ["game/save", { gameId: string; game: Game }]
  | ["game/select", { gameId: string }];
