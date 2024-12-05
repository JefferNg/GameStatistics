import { define } from "@calpoly/mustang";
import { css, html, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { Game } from "server/models";
import { GameCardElement } from "../components/game-card";

export class HomeViewElement extends LitElement {
  src = "/api/games";

  static uses = define({
    "game-card": GameCardElement,
  });

  @state()
  gameIndex = new Array<Game>();

  render() {
    const gameList = this.gameIndex.map(this.renderItem);

    return html` <div class="game-layout">${gameList}</div> `;
  }

  renderItem(game: Game) {
    const { gameId, name, price, genre, rating, playerCount } = game;

    return html` <a href="/games/${gameId}"
      ><game-card>
        <h1 slot="game-name">${name}</h1>
        <li slot="price">Price: ${price}</li>
        <li slot="genre">Genre: ${genre}</li>
        <li slot="rating">Rating: ${rating}</li>
        <li slot="player-count">Current Players: ${playerCount}</li>
      </game-card></a
    >`;
  }

  static styles = css`
    body {
      background-color: var(--color-background-page);
      color: var(--color-text);
      font-family: var(--font-family-serif);
      font-weight: var(--font-weight-normal);
    }
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
    .review {
      display: flex;
      justify-content: center;
      margin: 1vh auto;
    }
    .review-text {
      width: 90vw;
      height: 50vh;
    }
    .rating {
      margin: 1vh auto;
    }
    svg.icon {
      display: inline;
      height: var(--svg-icon-size-small);
      width: var(--svg-icon-size-small);
      vertical-align: top;
      fill: currentColor;
    }
    p {
      padding: var(--padding-normal);
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
    @media screen and (max-width: 50rem) {
      .game-layout {
        --page-grids: 4;
        display: grid;
        grid-template-columns: repeat(var(--page-grids), 1fr);
        row-gap: 5em;
        width: 100%;
      }
    }
    @media screen and (max-width: 30rem) {
      .game-layout {
        --page-grids: 3;
        display: grid;
        grid-template-columns: repeat(var(--page-grids), 1fr);
        row-gap: 5em;
        width: 100%;
      }
    }
    @media screen and (min-width: 100rem) {
      .game-layout {
        --page-grids: 12;
        display: grid;
        grid-template-columns: repeat(var(--page-grids), 1fr);
        row-gap: 5em;
        width: 100%;
      }
    }
  `;

  hydrate(url: string) {
    fetch(url)
      .then((res: Response) => {
        if (res.status === 200) return res.json();
        throw `Server responded with status ${res.status}`;
      })
      .then((json: unknown) => {
        if (json) {
          const gameId = json as Array<Game>;
          this.gameIndex = gameId;
        }
      })
      .catch((err) => console.log("Failed to game data:", err));
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (this.src) this.hydrate(this.src);
  }
}
