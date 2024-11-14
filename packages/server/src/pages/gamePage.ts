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
            scripts: []
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
                <a href="./rating.html"> Games Rated </a>
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
            <a href="../">Back to Main</a>
            <div
            id="game-content"
            style="background-image: url('../image/video-game-background.png')"
            >
            <ul>
                <li>${price}</li>
                <li>${genre}</li>
                <li>${rating}</li>
                <li>${playerCount}</li>
            </ul>
            </div>
        </body>`
    }

}