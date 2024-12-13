import { css, html, LitElement } from "lit";

export class GameCardElement extends LitElement {
  render() {
    return html`
      <header>
        <slot name="game-name">
          <h1><a href="./game.html"> Game </a></h1>
        </slot>
      </header>
      <ul>
        <li><slot name="price"> Price </slot></li>
        <li><slot name="genre"> Genre </slot></li>
        <li><slot name="rating"> Rating </slot></li>
        <li><slot name="player-count"> Players playing </slot></li>
      </ul>
    `;
  }

  static styles = css`
    header {
      color: var(--color-text);
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      padding: var(--padding-normal);
    }
    h1 {
      font-family: var(--font-family-san-serif);
      font-weight: var(--font-weight-strong);
      font-size: x-large;
    }
    li {
      display: flex;
      align-items: center;
    }
  `;
}
