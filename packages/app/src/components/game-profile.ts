import { css, html, LitElement } from "lit";

export class GameProfileElement extends LitElement {
  render() {
    return html`
      <a href="../">Back to Main</a>
      <section class="view">
        <div
          id="game-content"
          style="background-image: url('../image/video-game-background.png')"
        >
          <ul>
            <li><slot name="price"> Price </slot></li>
            <li><slot name="genre"> Genre </slot></li>
            <li><slot name="rating"> Rating </slot></li>
            <li><slot name="player-count"> Players playing </slot></li>
          </ul>
        </div>
        <span><slot name="user-rating"> No Rating </slot></span>
        <button id="edit">Edit</button>
      </section>
      <mu-form class="edit">
        <span> Played this game? Rate it! </span>
        <label id="rating">
          <svg class="icon"><use href="../icons/game.svg#icon-like" /></svg>
          <input type="radio" id="like" name="user-rating" value="like" />
          <svg class="icon">
            <use href="../icons/game.svg#icon-dislike" />
          </svg>
          <input type="radio" id="dislike" name="user-rating" value="dislike" />
        </label>
      </mu-form>
    `;
  }

  static styles = css`
    header h3,
    header div {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
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
