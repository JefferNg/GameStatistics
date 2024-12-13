import { Auth, define, History, Switch, Store } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model, init } from "./model";
import update from "./update";
import { html, LitElement } from "lit";
import { HomeViewElement } from "./views/home-view";
import { GameViewElement } from "./views/game-view";
import { GameEditElement } from "./views/game-edit";
import { AccountViewElement } from "./views/account-view";
import { RatingViewElement } from "./views/rating-view";
import { RecommendationViewElement } from "./views/recommendation-view";

class AppElement extends LitElement {
  static uses = define({
    "home-view": HomeViewElement,
    "game-view": GameViewElement,
    "game-edit": GameEditElement,
    "account-view": AccountViewElement,
    "rating-view": RatingViewElement,
    "recommendation-view": RecommendationViewElement,
  });

  protected render() {
    return html` <home-view></home-view> `;
  }

  connectedCallback(): void {
    super.connectedCallback();
  }
}

const routes = [
  {
    path: "/app",
    view: () => html` <home-view></home-view> `,
  },
  {
    path: "/",
    redirect: "/app",
  },
  {
    path: "/app/games/:gameId",
    view: (params: Switch.Params) => {
      return html`<game-view gameId=${params.gameId}></game-view>`;
    },
  },
  {
    path: "/app/games/:gameId/edit",
    view: (params: Switch.Params) =>
      html`<game-edit gameId=${params.gameId}></game-edit>`,
  },
  {
    path: "/app/accounts/:userId",
    view: (params: Switch.Params) =>
      html`<account-view userId=${params.userId}></account-view>`,
  },
  {
    path: "/app/ratings",
    view: (params: Switch.Params) =>
      html`<rating-view gameList=${params.gameList}></rating-view>`,
  },
  {
    path: "/app/recommendations",
    view: () => html`<recommendation-view></recommendation-view>`,
  },
];

define({
  "stats-app": AppElement,
  "mu-auth": Auth.Provider,
  "mu-history": History.Provider,
  "mu-store": class AppStore extends Store.Provider<Model, Msg> {
    constructor() {
      super(update, init, "stats:auth");
    }
  },
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "stats:history", "stats:auth");
    }
  },
});
