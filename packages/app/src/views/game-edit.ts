import { css, html } from "lit";
import { property, state } from "lit/decorators.js";
import { define, View, Form, History } from "@calpoly/mustang";
import { Msg } from "../messages";
import { Model } from "../model";
import { Game } from "server/models";

export class GameEditElement extends View<Model, Msg> {
  static uses = define({
    "mu-form": Form.Element,
  });

  @property()
  gameid?: string;

  @state()
  get game(): Game | undefined {
    return this.model.game;
  }

  handleSubmit(event: Form.SubmitEvent<Game>) {
    if (this.game && this.gameid) {
      const form = event.detail;
      const likeRating =
        this.shadowRoot!.querySelector<HTMLInputElement>("input[id='like']");
      const dislikeRating = this.shadowRoot!.querySelector<HTMLInputElement>(
        "input[id='dislike']"
      );
      let selectedRating = null;

      if (likeRating?.checked) selectedRating = "I Recommend This Game!";
      if (dislikeRating?.checked)
        selectedRating = "I Do Not Recommend This Game!";

      form.userRating = selectedRating;
      delete form["user-rating"];
      this.dispatchMessage([
        "game/save",
        {
          gameId: this.gameid,
          game: form,
          onSuccess: () =>
            History.dispatch(this, "history/navigate", {
              href: `/app/games/${this.gameid}`,
            }),
          onFailure: (error: Error) => console.log("error: ", error),
        },
      ]);
    }
  }

  constructor() {
    super("stats:model");
  }

  attributeChangedCallback(
    name: string,
    oldVal: string | null,
    newVal: string | null
  ): void {
    super.attributeChangedCallback(name, oldVal, newVal);

    if (name === "gameid" && oldVal !== newVal && newVal) {
      this.dispatchMessage(["game/select", { gameId: newVal }]);
    }
  }

  render() {
    const { name } = this.game || {};
    return html`
      <main class="edit">
        <header>
          <h1>${name}</h1>
          <div>
            <a href="../ratings"> Games Rated </a>
            <svg class="icon">
              <use href="../../icons/game.svg#icon-rate" />
            </svg>
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
        <mu-form .init=${this.game} @mu-form:submit=${this.handleSubmit}>
          <span> Played this game? Rate it! </span>
          <div id="rating">
            <label class="rating-option">
              <svg class="icon">
                <use href="../../../icons/game.svg#icon-like" />
              </svg>
              <input type="radio" id="like" name="user-rating" value="like" />
            </label>
            <label class="rating-option">
              <svg class="icon">
                <use href="../../../icons/game.svg#icon-dislike" />
              </svg>
              <input
                type="radio"
                id="dislike"
                name="user-rating"
                value="dislike"
              />
            </label>
          </div>
        </mu-form>
      </main>
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
    #rating {
      display: flex;
      justify-content: space-around;
    }
    .rating-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
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
    mu-form {
      display: var(--display-editor-none, grid);
    }
  `;
}
