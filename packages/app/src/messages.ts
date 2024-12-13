import { Game } from "server/models";

export type Msg =
  | [
      "game/save",
      {
        gameId: string;
        game: Game;
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ]
  | ["game/select", { gameId: string }]
  | ["account/select", { userId: string }]
  | ["rating/select", { gameList: Array<Game> }]
  | ["recommendation/select"];
