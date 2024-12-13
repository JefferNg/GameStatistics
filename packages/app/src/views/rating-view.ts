import { css, html } from "lit";
import { property, state } from "lit/decorators.js";
import { View } from "@calpoly/mustang";
import { Msg } from "../messages";
import { Model } from "../model";
import { Game } from "server/models";
import { Rating } from "server/models";

export class RatingViewElement extends View<Model, Msg> {
  @property()
  gameList?: Array<Game>;

  @state()
  get rating(): Rating | undefined {
    // return this.model.rating;
    return {
      games: [
        {
          gameId: "2",
          name: "Stardew Valley",
          price: "$14.99",
          genre: "Farming Sim",
          rating: 9.8,
          playerCount: 77436,
        },
        {
          gameId: "8",
          name: "Baldur's Gate 3",
          price: "$59.99",
          genre: "RPG",
          rating: 9.6,
          playerCount: 36927,
        },
      ],
    };
  }

  constructor() {
    super("stats:model");
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
    const { games } = this.rating || {};
    const gamesList = games?.map(this.renderItem);
    return html`
      <header id="rate-head">
        <div id="rate-logo">
          <h1>Rating</h1>
          <svg class="icon" id="rate-icon">
            <use href="../icons/game.svg#icon-rate" />
          </svg>
        </div>
        <label
          onchange="event.stopPropagation();
                toggleDarkMode(document.body, event.target.checked)"
        >
          <input type="checkbox" />
          Dark mode
        </label>
      </header>
      <a href="../../">Back to Main</a>
      <div class="game-layout">${gamesList}</div>
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
    #rate-head {
      justify-content: space-between;
    }
    #rate-logo {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
    }
    #rate-icon {
      width: var(--svg-icon-size-med);
      height: var(--svg-icon-size-med);
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
