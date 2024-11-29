import { css, html } from "@calpoly/mustang/server";
import { Game } from "models";
import renderPage from "./renderPage";

export class GamePage {
    data: Game

    constructor(data: Game) {
        this.data = data;
    }

    render() {
        return renderPage({
            body: this.renderBody(),
            stylesheets: ["../styles/game.css"],
            scripts: [`
                    import { define } from "@calpoly/mustang";
                    import { GameProfileElement } from "../scripts/gameProfile.js";

                    define({
                        "game-profile": GameProfileElement,
                    });
                `]
        })
    }

    renderBody() {
        const {
            gameId,
            name,
            price,
            genre,
            rating,
            playerCount
        } = this.data
        return html`
        <body>
            <header>
                <h1>${name}</h1>
                <div>
                    <a href="../ratings"> Games Rated </a>
                    <svg class="icon"><use href="../icons/game.svg#icon-rate" /></svg>
                </div>
                <div>
                    <a href="../recommendations"> Recommended Games </a>
                    <svg class="icon"><use href="../icons/game.svg#icon-rec" /></svg>
                </div>
                <h3>
                    <a href="../accounts/1"
                    ><svg class="icon">
                        <use href="../icons/game.svg#icon-user" />
                    </svg>
                    Account
                    </a>
                </h3>
                </header>
                <game-profile src="/api/games/${gameId}">
                <!--        <li slot="price">Price: ${price}</li>
                    <li slot="genre">Genre: ${genre}</li>
                    <li slot="rating">Rating: ${rating}</li>
                    <li slot="player-count">Current Players: ${playerCount}</li> -->
                </game-profile> 
        </body>`
    }
}