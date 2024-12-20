import { Home } from "models";

const games = {
    games: [{
        gameId: "1",
        name: "The Sims 4",
        price: "$29.99",
        genre: "Life Sim",
        rating: 8.6,
        playerCount: 30647
    },
    {
        gameId: "2",
        name: "Stardew Valley",
        price: "$14.99",
        genre: "Farming Sim",
        rating: 9.8,
        playerCount: 77436
    },
    {
        gameId: "3",
        name: "Team Fortress 2",
        price: "Free",
        genre: "FPS",
        rating: 8.8,
        playerCount: 37464
    },
    {
        gameId: "4",
        name: "Grand Theft Auto 5",
        price: "$29.99",
        genre: "Open World",
        rating: 8.7,
        playerCount: 57837
    }
]
};

export function getGame() {
    return games;
}