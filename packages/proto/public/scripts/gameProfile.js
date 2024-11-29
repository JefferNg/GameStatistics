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
            <mu-form class="edit">
                <span> Played this game? Rate it! </span>
                <label id="rating">
                    <svg class="icon"> <use href="../icons/game.svg#icon-like" /> </svg>
                    <input type="radio" id="like" name="rating" />
                    <svg class="icon"> <use href="../icons/game.svg#icon-dislike" /> </svg>
                    <input type="radio" id="dislike" name="rating" />
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
    `

    constructor() {
        super();
        shadow(this)
        .template(GameProfileElement.template)
        .styles(reset.styles, pages.styles, GameProfileElement.styles);
    }
}