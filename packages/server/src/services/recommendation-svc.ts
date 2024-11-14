const gamesOnGenre = {
    games: [
        {
            gameId: "6",
            name: "Counter-Strike 2",
            price: "Free",
            genre: "Shooter",
            rating: 8.7,
            playerCount: 568282
        },
        {
            gameId: "3",
            name: "Team Fortress 2",
            price: "Free",
            genre: "FPS",
            rating: 8.8,
            playerCount: 37464
        }
]}

const gamesOnPrice = {
    games: [
        {
            gameId: "5",
            name: "Cats",
            price: "Free",
            genre: "Clicker",
            rating: 7.4,
            playerCount: 21841
        },
        {
            gameId: "7",
            name: "Banana",
            price: "Free",
            genre: "Clicker",
            rating: 8.0,
            playerCount: 425832
        }
]}

const gamesOnRating = {
    games: [
        {
            gameId: "2",
            name: "Stardew Valley",
            price: "$14.99",
            genre: "Farming Sim",
            rating: 9.8,
            playerCount: 77436
        },
        {
            gameId: "8",
            name: "Baldur's Gate 3",
            price: "$59.99",
            genre: "RPG",
            rating: 9.6,
            playerCount: 36927
        }
]}

export function getGamesOnPrice() {
    return gamesOnPrice;
}

export function getGamesOnGenre() {
    return gamesOnGenre;
}

export function getGamesOnRating() {
    return gamesOnRating;
}