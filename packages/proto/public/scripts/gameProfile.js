import { css, html, shadow, define, Form } from "@calpoly/mustang";
import reset from "./styles/reset.css.js";
import pages from "./styles/page.css.js"

export class GameProfileElement extends HTMLElement {
    
    get src() {
        return this.getAttribute("src");
    }

    connectedCallback() {
        if (this.src) this.hydrate(this.src);       
    }

    get form() {
        return this.shadowRoot.querySelector("mu-form.edit");
    }

    hydrate(url) {
        fetch(url)
        .then((res) => {
            if (res.status !== 200) throw `Status: ${res.status}`;
            return res.json();
        })
        .then((json) => {
            this.renderSlots(json);
            this.form.init = json;
        })
        .catch((error) => console.log(`Failed to render data ${url}:`, error));
    }

    renderSlots(json) {
        const entries = Object.entries(json);
        const toSlots = ([key, value]) => {
                switch(key) {
                    case "price":
                        return html`
                        <li slot="price">${value}</li>
                        `
                    case "genre":
                        return html`
                        <li slot="genre">${value}</li>
                        `;
                    case "rating":
                        return html`
                        <li slot="rating">${value}</li>
                        `;
                    case "playerCount":
                        return html`
                        <li slot="player-count">${value}</li>
                        `;
                    case "userRating":
                        return html`
                        <span slot="user-rating">${value}</span>
                        `
                }
            }
        const fragment = entries.map(toSlots);
        this.replaceChildren(...fragment);
    }

    static uses = define({
        "mu-form": Form.Element
    })
    
    static template = html`
    <template>
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
                <svg class="icon"> <use href="../icons/game.svg#icon-like" /> </svg>
                <input type="radio" id="like" name="user-rating" value="like"/>
                <svg class="icon"> <use href="../icons/game.svg#icon-dislike" /> </svg>
                <input type="radio" id="dislike" name="user-rating" value="dislike"/>
            </label>
        </mu-form>
    </template>
    `

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
    `

    submit(url, json) {
        const method = "PUT";
        const headers = { "Content-Type": "application/json" };
        const body = JSON.stringify(json);

        fetch(url, {method, headers, body})
        .then((res) => {
            if (res.status !== 200) throw `Status: ${res.status}`;
            return res.json();
        })
        .then((json) => {
            console.log(json);
            this.renderSlots(json);
            this.form.init = json;
            this.mode = "view";
        })
        .catch((error) => console.log(`Failed to render data ${url}:`, error));
    }

    constructor() {
        super();
        shadow(this)
        .template(GameProfileElement.template)
        .styles(reset.styles, pages.styles, GameProfileElement.styles);

        this.mode = "view";

        this.addEventListener("mu-form:submit", (event) => {
            const formData = event.detail;
            const likeRating = this.shadowRoot.querySelector("mu-form.edit input[id='like']");
            const dislikeRating = this.shadowRoot.querySelector("mu-form.edit input[id='dislike']");
            let selectedRating = null;

            if (likeRating.checked) selectedRating = "I Recommend This Game!";
            if (dislikeRating.checked) selectedRating = "I Do Not Recommend This Game!";

            
            formData.userRating = selectedRating;
            delete formData["user-rating"];
            this.submit(this.src, formData)
        });

        this.editButton.addEventListener("click", () => (this.mode = "edit"));
    }

    get mode() {
        return this.getAttribute("mode");
    }

    set mode(m) {
        this.setAttribute("mode", m);
    }

    get editButton() {
        return this.shadowRoot.getElementById("edit");
    }
}