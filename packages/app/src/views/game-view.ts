import { css, html } from "lit";
import { property, state } from "lit/decorators.js";
import { View, History } from "@calpoly/mustang";
import { Msg } from "../messages";
import { Model } from "../model";
import { Game } from "server/models";

export class GameViewElement extends View<Model, Msg> {
  @property()
  gameId?: string;

  @state()
  get game(): Game | undefined {
    return this.model.game;
  }

  @property({ reflect: true })
  mode?: string;

  @property()
  url = `/api/games/${this.gameId}`;

  @state()
  form: unknown;

  constructor() {
    super("stats:model");
  }

  attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    super.attributeChangedCallback(name, oldVal, newVal);
    this.mode = "view";
    if (name === "gameid" && oldVal !== newVal && newVal) {
      this.dispatchMessage(["game/select", { gameId: newVal }]);
    }
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
        <span
          ><slot name="user-rating"> ${userRating || "No Rating"} </slot></span
        >
        <button
          id="edit"
          @click="${() =>
            History.dispatch(this, "history/navigate", {
              href: `/app/games/${this.gameId}/edit`,
            })}"
        >
          Edit
        </button>
      </section>
      <mu-form class="edit" .init=${this.game}> </mu-form>
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
