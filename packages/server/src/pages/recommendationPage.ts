import { css, html } from "@calpoly/mustang/server";
import { Game, Recommendation } from "models";
import renderPage from "./renderPage";

export class RecommendationPage {
    genreGames: Recommendation
    priceGames: Recommendation
    ratingGames: Recommendation

    constructor(genreGames: Recommendation, priceGames: Recommendation, ratingGames: Recommendation) {
        this.genreGames = genreGames;
        this.priceGames = priceGames;
        this.ratingGames = ratingGames;
    }

    render() {
        return renderPage({
            body: this.renderBody(),
            stylesheets: ["/styles/recommendation.css"],
            scripts: []            
        })
    }

    renderBody() {
        const genreGames = this.genreGames;
        const priceGames = this.priceGames;
        const ratingGames = this.ratingGames;
        const genreGamesList = genreGames.games.map((game) => {
            return this.renderGame(game);
        })
        const priceGamesList = priceGames.games.map((game) => {
            return this.renderGame(game);
        })
        const ratingGamesList = ratingGames.games.map((game) => {
            return this.renderGame(game);
        })
        return html`
        <body>
            <header id="rec-head">
            <h1>Recommendations</h1>
            <svg class="icon" id="rec-icon">
                <use href="./icons/game.svg#icon-rec" />
            </svg>
            </header>
            <a href="../">Back to Main</a>
            <dl>
            <dt><h2>Based on Genre</h2></dt>
            <div class="game-layout">
                ${genreGamesList}
            </div>
            <dt><h2>Based on Price</h2></dt>
            <div class="game-layout">
                ${priceGamesList}
            </div>
            <dt><h2>Based on Rating</h2></dt>
            <div class="game-layout">
                ${ratingGamesList}
            </div>
            </dl>
        </body>`
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