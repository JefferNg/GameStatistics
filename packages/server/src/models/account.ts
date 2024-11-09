import { Game } from "./home";

export interface Account {
    userId: string;
    username: string;
    profilePicture?: string;
    ratedGames: Array<Game>;
}