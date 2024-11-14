import { css, html } from "@calpoly/mustang/server";
import { Game, Rating } from "models";
import renderPage from "./renderPage";

export class RatingPage {
    games: Rating

    constructor(games: Rating) {
        this.games = games;
    }

    render() {
        return renderPage({
            body: this.renderBody(),
            stylesheets: ["/styles/rating.css"],
            scripts: [
                `import { define } from "@calpoly/mustang";
                import { GameElement } from "./scripts/game.js";

                define({
                    "game-card": GameElement,
                });`
            ]
        })
    }

    renderBody() {
        const { games } = this.games;
        const gamesList = games.map((game) => {
            return this.renderGame(game);
        })

        return html`
        <body>
            <header id="rate-head">
            <div id="rate-logo">
                <h1>Rating</h1>
                <svg class="icon" id="rate-icon">
                <use href="../icons/game.svg#icon-rate" />
                </svg>
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
            <div class="game-layout">
                ${gamesList}
            </div>
        </body>
        `
    }

    renderGame(game: Game) {
        const {gameId, name, price, genre, rating, playerCount} = game;

        return html `
        <a href="/games/${gameId}"><game-card>
        <h1 slot="game-name">${name}</h1>
        <li slot="price">Price: ${price}</li>
        <li slot="genre">Genre: ${genre}</li>
        <li slot="rating">Rating: ${rating}</li>
        <li slot="player-count">Current Players: ${playerCount}</li>
        </game-card></a>`; 
    }
}