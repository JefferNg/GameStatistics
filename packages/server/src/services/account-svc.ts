import { Account } from "models";
import { Schema, model } from "mongoose";
import { Game } from "models";

const account = {
    userId: "1",
    username: "Admin",
    ratedGames: [{
        name: "Cats",
        price: "Free",
        genre: "Clicker",
        rating: 7.4,
        playerCount: 21841
    }]
}

const AccountSchema = new Schema<Account>(
    {
        userId: {type: String, required: true, trim: true},
        username: {type: String, required: true, trim: true},
        ratedGames: Array<Game>
    },
    {collection: "accounts"}
)

const AccountModel = model<Account>("Profile", AccountSchema);

function index(): Promise<Account[]> {
    return AccountModel.find();
}

function get(userId: String): Promise<Account> {
    return AccountModel.find({userId})
    .then((list) => list[0])
    .catch((err) => {
        throw `${userId} not found`;
    });
}

export default {index, get}

export function getAccount(_: string) {
    return account;
}