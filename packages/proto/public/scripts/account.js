import { css, html, shadow} from "@calpoly/mustang";
import reset from "./styles/reset.css.js";

export class AccountElement extends HTMLElement {
    static template = html`
    <template>
        <slot name="acc-head"><header id="account-head">
            <div id="account-logo">
            <slot name="name"><h1>Username</h1></slot>
            <slot name="profile-pic"><svg class="icon" id="account-icon">
                <use href="./icons/game.svg#icon-user" />
            </svg></slot>
            </div>
            <label
            onchange="event.stopPropagation();
            toggleDarkMode(document.body, event.target.checked)"
            >
            <input type="checkbox" />
            Dark mode
            </label>
      </header></slot>
      <a href="./index.html">Back to Main</a>
      <slot name="games-rated">
        <div id="games-rated">
            <h1>Games you Rated</h1>
            <slot name="games">
                <div class="game-layout">
                <a href="./game.html"
                    ><game-card>
                    <h1 slot="game-name">Name</h1>
                    <li slot="price">Price: Price</li>
                    <li slot="genre">Genre: Genre</li>
                    <li slot="rating">Rating: Rating</li>
                    <li slot="player-count">Current Players: Players playing</li>
                    </game-card></a
                >
                </div>
            </slot>
        </div>
      </slot>
    </template>`;

    static style = css`
    #account-head {
        justify-content: space-between;
    }
    #account-logo {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
    }
    #account-icon {
        width: var(--svg-icon-size-med);
        height: var(--svg-icon-size-med);
    }
    `;

    constructor() {
        super();
        shadow(this)
        .template(AccountElement.template)
        .styles(reset.styles, AccountElement.style);
    }
}