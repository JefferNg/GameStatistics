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
            stylesheets: ["../styles/account.css"],
            scripts: [
                `import { define } from "@calpoly/mustang";
                import { GameElement } from "../scripts/game.js";
                import { AccountElement} from "../scripts/account.js";

                define({
                    "game-card": GameElement,
                    "account-card": AccountElement,
                });`
            ]
        });
    }

    renderBody() {
        const {
            userId,
            username,
            profilePicture,
            ratedGames
        } = this.data;
        const header = this.renderHeader(username);
        const gamesList = ratedGames.map((game) => {
            return this.renderGame(game);
        });
        return html`
        
            <account-card src="/api/accounts/${userId}">
                <!-- ${header}
                <a href="../">Back to Main</a>
                <div slot="games-rated" id="games-rated">
                    <h1>Games you Rated</h1>
                    <div slot="games" class="game-layout">
                    ${gamesList}
                    </div>
                </div> -->
            </account-card>
        
        `
    }

    renderHeader(username: string, profilePicture?: string) {
        profilePicture = profilePicture ? profilePicture : "../icons/game.svg#icon-user"
        
        return html`
        <header slot="acc-head" id="account-head">
            <div id="account-logo">
            <h1 slot="name">${username}</h1>
            <svg slot="profile-pic" class="icon" id="account-icon">
                <use href=${profilePicture} />
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
        const {gameId, name, price, genre, rating, playerCount} = game;

        return html`
        <a href="../games/${gameId}"><game-card>
        <h1 slot="game-name">${name}</h1>
        <li slot="price">Price: ${price}</li>
        <li slot="genre">Genre: ${genre}</li>
        <li slot="rating">Rating: ${rating}</li>
        <li slot="player-count">Current Players: ${playerCount}</li>
        </game-card></a>`; 
    }
}
