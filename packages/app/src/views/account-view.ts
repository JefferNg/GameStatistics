import { css, html } from "lit";
import { property, state } from "lit/decorators.js";
import { View } from "@calpoly/mustang";
import { Msg } from "../messages";
import { Model } from "../model";
import { Game } from "server/models";
import { Account } from "server/models";

export class AccountViewElement extends View<Model, Msg> {
  @property()
  userid?: string;

  @state()
  get account(): Account | undefined {
    // return this.model.account;
    return {
      userId: "1",
      username: "Admin",
      ratedGames: [
        {
          gameId: "5",
          name: "Cats",
          price: "Free",
          genre: "Clicker",
          rating: 7.4,
          playerCount: 21841,
        },
      ],
    };
  }

  @state()
  gameIndex = new Array<Game>();

  constructor() {
    super("stats:model");
  }

  attributeChangedCallback(
    name: string,
    _old: string | null,
    value: string | null
  ): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === "userid" && _old !== value && value) {
      this.dispatchMessage(["account/select", { userId: value }]);
    }
  }

  renderItem(game: Game) {
    const { gameId, name, price, genre, rating, playerCount } = game;

    return html` <a href="/app/games/${gameId}"
      ><game-card>
        <h1 slot="game-name">${name}</h1>
        <li slot="price">Price: ${price}</li>
        <li slot="genre">Genre: ${genre}</li>
        <li slot="rating">Rating: ${rating}</li>
        <li slot="player-count">Current Players: ${playerCount}</li>
      </game-card></a
    >`;
  }

  render() {
    const { username, ratedGames } = this.account || {};
    const gameList = ratedGames?.map(this.renderItem);
    return html`
      <header>
        <div id="account-logo">
          <slot name="name"><h1>${username}</h1></slot>
          <slot name="profile-pic"
            ><svg class="icon" id="account-icon">
              <use href="../icons/game.svg#icon-user" /></svg
          ></slot>
        </div>
        <div id="right-header-elements">
          <label
            onchange="event.stopPropagation();
                toggleDarkMode(document.body, event.target.checked)"
          >
            <input type="checkbox" />
            Dark mode
          </label>
          <a id="signout">Sign Out</a>
        </div>
      </header>
      <a href="../../">Back to Main</a>

      <div id="games-rated">
        <h1>Games you Rated</h1>
        <div class="game-layout">${gameList}</div>
      </div>
    `;
  }

  static styles = css`
    header {
      color: var(--color-header);
      background-color: var(--color-background-header);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--padding-normal);
    }
    h1 {
      font-family: var(--font-family-san-serif);
      font-weight: var(--font-weight-strong);
      font-size: x-large;
    }
    a {
      color: var(--color-link);
    }
    li {
      display: flex;
      align-items: center;
    }
    #account-logo {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
    }
    #account-icon {
      width: var(--svg-icon-size-med);
      height: var(--svg-icon-size-med);
    }
    #right-header-elements {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    ::slotted(a) {
      text-decoration: none;
    }
    .game-layout {
      --page-grids: 6;
      display: grid;
      grid-template-columns: repeat(var(--page-grids), 1fr);
      row-gap: 5em;
      width: 100%;
    }
    .game-layout a {
      text-decoration: none;
    }
  `;
}
