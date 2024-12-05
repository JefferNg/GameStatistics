import { css, html, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import { Game } from "server/models";

export class GameViewElement extends LitElement {
  @property()
  gameId?: string;

  @state()
  game?: Game;

  connectedCallback(): void {
    super.connectedCallback();
    this.hydrate();
    console.log(this.gameId);
  }

  hydrate() {
    const url = `/api/games/${this.gameId}`;
    fetch(url)
      .then((res: Response) => {
        if (res.status === 200) return res.json();
        throw `Server responded with status ${res.status}`;
      })
      .then((json: Game) => {
        if (json) {
          this.game = json;
          console.log(json);
        }
      });
  }

  render() {
    const { name, price, genre, rating, playerCount, userRating } =
      this.game || {};

    return html`
      <header>
        <h1>${name}</h1>
        <div>
          <a href="../ratings"> Games Rated </a>
          <svg class="icon"><use href="../../icons/game.svg#icon-rate" /></svg>
        </div>
        <div>
          <a href="../recommendations"> Recommended Games </a>
          <svg class="icon"><use href="../../icons/game.svg#icon-rec" /></svg>
        </div>
        <h3>
          <a href="../accounts/1"
            ><svg class="icon">
              <use href="../../icons/game.svg#icon-user" />
            </svg>
            Account
          </a>
        </h3>
      </header>
      <a href="../../">Back to Main</a>
      <section class="view">
        <div
          id="game-content"
          style="background-image: url('../../image/video-game-background.png')"
        >
          <ul>
            <li><slot name="price"> ${price} </slot></li>
            <li><slot name="genre"> ${genre} </slot></li>
            <li><slot name="rating"> ${rating} </slot></li>
            <li><slot name="player-count"> ${playerCount} </slot></li>
          </ul>
        </div>
        <span><slot name="user-rating"> ${userRating} </slot></span>
        <button id="edit">Edit</button>
      </section>
      <mu-form class="edit">
        <span> Played this game? Rate it! </span>
        <label id="rating">
          <svg class="icon"><use href="../../icons/game.svg#icon-like" /></svg>
          <input type="radio" id="like" name="user-rating" value="like" />
          <svg class="icon">
            <use href="../../icons/game.svg#icon-dislike" />
          </svg>
          <input type="radio" id="dislike" name="user-rating" value="dislike" />
        </label>
      </mu-form>
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
    header h3,
    header div {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
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
      flex-direction: column;
      color: black;
      font-weight: var(--font-weight-strong);
      font-size: x-large;
    }
    span {
      font-family: var(--font-family-san-serif);
      font-weight: var(--font-weight-strong);
      font-size: x-large;
    }
    svg.icon {
      display: inline;
      height: var(--svg-icon-size-small);
      width: var(--svg-icon-size-small);
      vertical-align: top;
      fill: currentColor;
    }
    #game-content {
      height: 100vh;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: 50% 0%;
    }
    #rating {
      display: flex;
      justify-content: space-around;
    }
    #rating svg {
      width: var(--svg-icon-size-med);
      height: var(--svg-icon-size-med);
    }
    :host {
      display: contents;
    }
    :host([mode="edit"]),
    :host([mode="new"]) {
      --display-view-none: none;
    }
    :host([mode="view"]) {
      --display-editor-none: none;
    }
    section.view {
      display: var(--display-view-none, grid);
    }
    mu-form.edit {
      display: var(--display-editor-none, grid);
    }
  `;
}
