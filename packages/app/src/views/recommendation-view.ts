import { css, html } from "lit";
import { state } from "lit/decorators.js";
import { View } from "@calpoly/mustang";
import { Msg } from "../messages";
import { Model } from "../model";
import { Game, Recommendation } from "server/models";

export class RecommendationViewElement extends View<Model, Msg> {
  @state()
  get recommendation(): Recommendation | undefined {
    // return this.model.recommendation;
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

  @state()
  selectedGenre: string = "";

  constructor() {
    super("stats:model");
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.dispatchMessage(["recommendation/select"]);
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
    const { games } = this.recommendation || {};
    const genreGamesList = games?.map(this.renderItem);

    return html`
      <header id="rec-head">
        <h1>Recommendations</h1>
        <svg class="icon" id="rec-icon">
          <use href="./icons/game.svg#icon-rec" />
        </svg>
      </header>
      <a href="../">Back to Main</a>
        <dl>
          <dt><h2>Based on Genre</h2></dt>
          <div class="game-layout">${genreGamesList}</div>
          <dt><h2>Based on Price</h2></dt>
          <div class="game-layout">${genreGamesList}</div>
          <dt><h2>Based on Rating</h2></dt>
          <div class="game-layout">${genreGamesList}</div>
        </dl>
      </select>
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
    dl {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    #rec-head {
      justify-content: flex-start;
    }
    #rec-icon {
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
