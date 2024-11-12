import { Game } from "./game";

export interface Account {
    userId: string;
    username: string;
    profilePicture?: string;
    ratedGames: Array<Game>;
}