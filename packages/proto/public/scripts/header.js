import { css, html, shadow } from "@calpoly/mustang";

export class Header extends HTMLElement {
    static template = html`
      <h1>Steam Games Essentials</h1>
      <div>
        <a href="./Game.html"> Games Played </a>
        <svg class="icon"><use href="./icons/game.svg#icon-play" /></svg>
      </div>
      <div>
        <a href="./Rating.html"> Games Rated </a>
        <svg class="icon"><use href="./icons/game.svg#icon-rate" /></svg>
      </div>
      <div>
        <a href="./Review.html"> Games you Reviewed </a>
        <svg class="icon"><use href="./icons/game.svg#icon-review" /></svg>
      </div>
      <div>
        <a href="./Recommendation.html"> Recommendations </a>
        <svg class="icon"><use href="./icons/game.svg#icon-rec" /></svg>
      </div>
      <div>
        Money spend on games
        <svg class="icon"><use href="./icons/game.svg#icon-money" /></svg>
      </div>
      <h3>
        <svg class="icon">
          <use href="./icons/game.svg#icon-user" />
        </svg>
        Account
      </h3>
    `;

    static styles = css``;

    constructor() {
        super();
        shadow(this)
            .template(Header.template)
            .styles(Header.styles);
    }
}