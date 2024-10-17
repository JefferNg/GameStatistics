import { css, html, shadow } from "@calpoly/mustang";
import reset from "./styles/reset.css.js";

export class GameElement extends HTMLElement {
    static template = html`
    <template>
      <header>
        <slot name="game-name"> 
          <h1> <a href="./game.html"> Game </a> </h1>
        </slot>
      </header>
      <ul>
        <li><slot name="price"> Price </slot></li>
        <li><slot name="genre"> Genre </slot></li>
        <li><slot name="rating"> Rating </slot></li>
        <li><slot name="player-count"> Players playing </slot></li>
      </ul>
    </template>
    `;

    static styles = css`
    header {
      color: var(--color-text);
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      padding: var(--padding-normal);
    }
    h1 {
      font-family: Prompt, Verdana, Tahoma, Arial, sans-serif;
      font-weight: var(--font-weight-strong);
      font-size: x-large;
    }
    li {
      display: flex;
      align-items: center;
    }`;

    
    constructor() {
        super();
        shadow(this)
            .template(GameElement.template)
            .styles(reset.styles, GameElement.styles);
    }
}