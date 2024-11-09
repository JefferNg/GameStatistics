export interface Home {
    games: Array<Game>;
}

export interface Game {
    name: string;
    price: string;
    genre: string;
    rating: number;
    playerCount: number; 
}