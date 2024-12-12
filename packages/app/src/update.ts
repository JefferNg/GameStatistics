import { Auth, Update } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";
import { Game } from "server/models";

export default function update(
  message: Msg,
  apply: Update.ApplyMap<Model>,
  user: Auth.User
) {
  switch (message[0]) {
    case "game/save":
      saveGame(message[1], user).then((game) =>
        apply((model) => ({ ...model, game }))
      );
      break;
    case "game/select":
      selectGame(message[1]).then((game) =>
        apply((model) => ({ ...model, game }))
      );
      break;
    default:
      const unhandled: never = message[0];
      throw new Error(`Unhandled Auth message "${unhandled}"`);
  }
}

function selectGame(msg: { gameId: string }) {
  return fetch(`/api/games/${msg.gameId}`)
    .then((res: Response) => {
      if (res.status === 200) {
        return res.json();
      }
      return undefined;
    })
    .then((json: unknown) => {
      if (json) {
        console.log("Game:", json);
        return json as Game;
      }
    });
}

function saveGame(msg: { gameId: string }, user: Auth.User) {
  return fetch(`/api/games/${msg.gameId}`, { headers: Auth.headers(user) })
    .then((res: Response) => {
      if (res.status === 200) return res.json();
      return undefined;
    })
    .then((json: unknown) => {
      if (json) {
        console.log("Game: ", json);
        return json as Game;
      }
    });
}
