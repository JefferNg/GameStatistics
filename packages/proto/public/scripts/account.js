import { css, html, shadow} from "@calpoly/mustang";
import reset from "./styles/reset.css.js";

export class AccountElement extends HTMLElement {
    
    get src() {
        return this.getAttribute("src");
    }

    connectedCallback() {
        if (this.src) this.hydrate(this.src);
    }

    hydrate(url) {
        fetch(url)
        .then((res) => {
            if (res.status !== 200) throw `Status: ${res.status}`;
            return res.json();
        })
        .then((json) => this.renderSlots(json))
        .catch((error) => console.log(`Failed to render data ${url}:`, error));
    }

    renderSlots(json) {
        const entries = Object.entries(json);
        // const toSlots = ([key, value]) => html`
        // <span slot="${key}"> ${value} </span>`
        const toSlots = ([key, value]) => {
            switch(key) {
                case "username":
                    return html`
                    <h1 slot="name"> ${value} </h1>`;
                case "profilePicture":
                    return html`
                    <svg slot="profile-pic" class="icon" id="account-icon">
                        <use href="../icons/game.svg#icon-user" />
                    </svg>`;
            }
            switch (typeof value) {
                case "object":
                    if (Array.isArray(value)) {
                        return html`
                        <div slot="games-rated" class="game-layout">
                            <div class="game-layout">
                            <a href="./game.html">
                            <game-card>
                            ${value.map((s) => html`<li>${s}</li>`)}
                            </game-card>
                            </a>
                            </div>
                        </div>`;
                    }
            }
        }

        const fragment = entries.map(toSlots);
        this.replaceChildren(...fragment);
    }
    
    // might be changing the shadow dom
    static template = html`
    <template>
        <slot name="acc-head">
        <header id="account-head">
            <div id="account-logo">
            <slot name="name"><h1>Username</h1></slot>
            <slot name="profile-pic"><svg class="icon" id="account-icon">
                <use href="../icons/game.svg#icon-user" />
            </svg></slot>
            </div>
            <label
            onchange="event.stopPropagation();
            toggleDarkMode(document.body, event.target.checked)"
            >
            <input type="checkbox" />
            Dark mode
            </label>
      </header>
      </slot>
      <a href="../">Back to Main</a>
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