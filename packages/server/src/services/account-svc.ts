import { Account } from "models";
import { Schema, model } from "mongoose";
import { Game } from "models";

const account = {
    userId: "1",
    username: "Admin",
    ratedGames: [{
        gameId: "5",
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

function create(json: Account): Promise<Account> {
    const t = new AccountModel(json);
    return t.save();
}

function update(userId: String, account: Account): Promise<Account> {
    return AccountModel.findOneAndUpdate(
        { userId }, 
        account, 
        { new: true })
    .then((updated) => {
        if (!updated) throw `${userId} not updated`;
        else return updated as Account;
    });
}

function remove(userId: String): Promise<void> {
    return AccountModel.findOneAndDelete({ userId })
    .then((deleted) => {
        if (!deleted) throw `${userId} not deleted`;
    });
}

export default {index, get, create, update, remove};

export function getAccount(_: string) {
    return account;
}