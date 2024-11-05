import { css, html } from "@calpoly/mustang/server";
import { Game, Account } from "models";
import renderPage from "./renderPage";

export class AccountPage {
    data: Account;

    constructor(data: Account) {
        this.data = data;
    }

    render() {
        return renderPage({
            body: this.renderBody(),
            stylesheets: ["/styles/account.css"],
            scripts: [
                `import { define } from "@calpoly/mustang";
                import { GameElement } from "../scripts/game.js";

                define({
                    "game-card": GameElement,
                });`
            ]
        });
    }

    renderBody() {
        const header = this.renderHeader();
        const {
            userId,
            username,
            profilePicture,
            ratedGames
        } = this.data;
        const gamesList = ratedGames.map((game) => {
            return this.renderGame(game);
        });
        return html `
        <body>
            ${header}
            <a href="../">Back to Main</a>
            <div id="games-rated">
                <h1>Games you Rated</h1>
                <div class="game-layout">
                 ${gamesList}
                </div>
            </div>
        </body>
        `
    }

    renderHeader() {
        return html `
        <header id="account-head">
            <div id="account-logo">
                <h1>Username</h1>
                <svg class="icon" id="account-icon">
                <use href="../icons/game.svg#icon-user" />
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
        `
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
