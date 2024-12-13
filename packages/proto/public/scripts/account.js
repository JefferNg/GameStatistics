import { css, Events, html, Observer, shadow} from "@calpoly/mustang";
import reset from "./styles/reset.css.js";
import pages from "./styles/page.css.js";

export class AccountElement extends HTMLElement {
    _authObserver = new Observer(this, "stats:auth");
    
    get src() {
        return this.getAttribute("src");
    }

    connectedCallback() {
        this._authObserver.observe(({user}) => {
            console.log(user)
            this._user = user;
            if (this.src) this.hydrate(this.src);
        });
    }

    hydrate(url) {
        fetch(url, {headers: this.authorization})
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
                    <h1 slot="name" id="userid"> ${value} </h1>`;
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
                            <a slot="games" href="../games/${s["gameId"]}">
                            <game-card>
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
    
    static template = html`
    <template>
        <header>
            <div id="account-logo">
            <slot name="name"><h1>Username</h1></slot>
            <slot name="profile-pic"><svg class="icon" id="account-icon">
                <use href="../icons/game.svg#icon-user" />
            </svg></slot>
            </div>
            <div id="right-header-elements">
                <label
                onchange="event.stopPropagation();
                toggleDarkMode(document.body, event.target.checked)"
                >
                <input type="checkbox" />
                Dark mode
                </label>
                <a id="signout">Sign Out</a>
            </div>
      </header>
      <a href="../">Back to Main</a>
      
    <div id="games-rated">
        <h1>Games you Rated</h1>
        <div class="game-layout">
        
        <slot name="games">
            <a href="../game.html">  
                <game-card>
                <h1 slot="game-name">Name</h1>
                <li slot="price">Price: Price</li>
                <li slot="genre">Genre: Genre</li>
                <li slot="rating">Rating: Rating</li>
                <li slot="player-count">Current Players: Players playing</li>
                </game-card>
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
    #right-header-elements {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }
    ::slotted(a) {
        text-decoration: none;
    }
    `;

    constructor() {
        super();
        shadow(this)
        .template(AccountElement.template)
        .styles(reset.styles, pages.styles, AccountElement.style);

        this._signout = this.shadowRoot.querySelector("#signout");

        this._signout.addEventListener("click", (event) => 
            Events.relay(event, "auth:message", ["auth/signout"])
        );
    }

    get userid() {
        console.log(this._userid.textContent);
        return this._userid.textContent;
    }

    set userid(id) {
        if (id === "anonymous") {
            this._userid.textContent = "";
            this._signout.disabled = true;
        }
        else {
            this._userid.textContent = id;
            this._signout.disabled = false;
        }
    }

    get authorization() {
        console.log(this._user)
        return(
            this._user?.authenticated && {
                Authorization: `Bearer ${this._user.token}`
            }
        );
    }
}