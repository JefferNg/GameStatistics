import { css, html, shadow} from "@calpoly/mustang";
import reset from "./styles/reset.css.js";
import pages from "./styles/page.css.js";

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
                        
                        ${value.map((s) => {
                            
                            return html`
                            <a slot="game-link" href="../game.html">
                            <game-card slot="games">
                            <h1 slot="game-name">${s["name"]}</h1>
                            <li slot="price">Price: ${s["price"]}</li>
                            <li slot="genre">Genre: ${s["genre"]}</li>
                            <li slot="rating">Rating: ${s["rating"]}</li>
                            <li slot="player-count">Current Players: ${s["playerCount"]}</li>
                            </game-card>
                            </a>
                            `
                            })}
                            
                            `;
                    }
            }
        }

        const fragment = entries.map(toSlots);
        this.replaceChildren(...fragment);
    }
    
    // might be changing the shadow dom
    static template = html`
    <template>
        <header>
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
      <a href="../">Back to Main</a>
      
    <div id="games-rated">
        <h1>Games you Rated</h1>
        <div class="game-layout">
        <slot name="game-link">
        <a href="../game.html">  
        <slot name="games">
            <game-card>
            <h1 slot="game-name">Name</h1>
            <li slot="price">Price: Price</li>
            <li slot="genre">Genre: Genre</li>
            <li slot="rating">Rating: Rating</li>
            <li slot="player-count">Current Players: Players playing</li>
            </game-card>
            </slot>
            </a>
            </slot>
        </div>
    </div>
        
    </template>`;

    static style = css`
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
        .styles(reset.styles, pages.styles, AccountElement.style);
    }
}