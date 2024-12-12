import { Auth, define, History, Switch, Store } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model, init } from "./model";
import update from "./update";
import { html, LitElement } from "lit";
import { HomeViewElement } from "./views/home-view";
import { GameViewElement } from "./views/game-view";

class AppElement extends LitElement {
  static uses = define({
    "home-view": HomeViewElement,
    "game-view": GameViewElement,
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
