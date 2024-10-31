import {css, html} from "@calpoly/mustang/server";
import { Game, Home } from "models";
import renderPage from "./renderPage";

export class HomePage {
    data: Home;

    constructor(data: Home) {
        this.data = data;
    }

    render() {
        return renderPage({
            body: this.renderBody(),
            stylesheets: ["/styles/index.css"],
            scripts: [
                `import { define } from "@calpoly/mustang";
                import { GameElement } from "./scripts/game.js";

                define({
                    "game-card": GameElement,
                });`
            ]
        });
    }

    renderBody() {
        const header = this.renderHeader();
        const { games } = this.data;
        const gamesList = games.map((game) => {
            return this.renderGame(game);
        });
        
        return html `
        <body>
            ${header}
            <div class="game-layout">
                ${gamesList}
            </div>
        </body>`;
    }

    renderHeader() {
        return html `
        <header>
            <h1>Steam Games Essentials</h1>
            <div>
                <a href="./rating.html"> Games Rated </a>
                <svg class="icon"><use href="./icons/game.svg#icon-rate" /></svg>
            </div>
            <div>
                <a href="./review.html"> Games you Reviewed </a>
                <svg class="icon"><use href="./icons/game.svg#icon-review" /></svg>
            </div>
            <div>
                <a href="./recommendation.html"> Recommended Games </a>
                <svg class="icon"><use href="./icons/game.svg#icon-rec" /></svg>
            </div>
            <div>
                Money spend on games
                <svg class="icon"><use href="./icons/game.svg#icon-money" /></svg>
            </div>
            <label
                onchange="event.stopPropagation();
                toggleDarkMode(document.body, event.target.checked)">
                <input type="checkbox" />
                Dark mode
            </label>
            <h3>
                <svg class="icon">
                <use href="./icons/game.svg#icon-user" />
                </svg>
                Account
            </h3>
        </header>`
    }

    renderGame(game: Game) {
        const {name, price, genre, rating, playerCount} = game;

        return html `
        <a href="./game.html"><game-card>
        <h1 slot="game-name">${name}</h1>
        <li slot="price">Price: ${price}</li>
        <li slot="genre">Genre: ${genre}</li>
        <li slot="rating">Rating: ${rating}</li>
        <li slot="player-count">Current Players: ${playerCount}</li>
        </game-card></a>`; 
    }

}