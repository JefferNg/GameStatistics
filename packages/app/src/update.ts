import { Auth, Update } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";
import { Account, Game, Rating, Recommendation } from "server/models";

export default function update(
  message: Msg,
  apply: Update.ApplyMap<Model>,
  user: Auth.User
) {
  switch (message[0]) {
    case "game/save":
      saveGame(message[1])
        .then((game) => apply((model) => ({ ...model, game })))
        .then(() => {
          const { onSuccess } = message[1];
          if (onSuccess) onSuccess();
        })
        .catch((err: Error) => {
          const { onFailure } = message[1];
          if (onFailure) onFailure(err);
        });
      break;
    case "game/select":
      selectGame(message[1]).then((game) =>
        apply((model) => ({ ...model, game }))
      );
      break;
    case "account/select":
      selectAccount(message[1], user).then((account) =>
        apply((model) => ({ ...model, account }))
      );
      break;
    case "rating/select":
      selectRating().then(() => apply((model) => ({ ...model })));
      break;
    case "recommendation/select":
      selectRecommendation().then(() => apply((model) => ({ ...model })));
      break;
    default:
      const unhandled: never = message[0];
      throw new Error(`Unhandled Auth message "${unhandled}"`);
  }
}

function selectRecommendation() {
  return fetch(`/api/games`)
    .then((res: Response) => {
      if (res.status === 200) {
        return res.json();
      }
    })
    .then((json: unknown) => {
      if (json) {
        return json as Recommendation;
      }
    });
}

function selectRating() {
  return fetch(`/api/games`)
    .then((res: Response) => {
      if (res.status === 200) {
        return res.json();
      }
      return undefined;
    })
    .then((json: unknown) => {
      if (json) {
        return json as Rating;
      }
    });
}

function selectAccount(msg: { userId: string }, user: Auth.User) {
  return fetch(`/api/accounts/${msg.userId}`, { headers: Auth.headers(user) })
    .then((res: Response) => {
      if (res.status === 200) {
        return res.json();
      }
      return undefined;
    })
    .then((json: unknown) => {
      if (json) {
        console.log("Account:", json);
        return json as Account;
      }
    });
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

function saveGame(msg: { gameId: string; game: Game }) {
  return fetch(`/api/games/${msg.gameId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(msg.game),
  })
    .then((res: Response) => {
      if (res.status === 200) return res.json();
      throw new Error(`Failed to save game for ${msg.gameId}`);
    })
    .then((json: unknown) => {
      if (json) {
        console.log("Game: ", json);
        return json as Game;
      }
      return undefined;
    });
}
