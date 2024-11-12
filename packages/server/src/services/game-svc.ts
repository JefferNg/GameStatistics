import { Game } from "models";
import { Schema, model } from "mongoose";

const game = {
    gameId: "5",
    name: "Cats",
    price: "Free",
    genre: "Clicker",
    rating: 7.4,
    playerCount: 21841,
}

const GameSchema = new Schema<Game>({
    gameId: {type: String, required: true, trim: true},
    name: {type: String, required: true, trim: true},
    price: {type: String, required: true, trim: true},
    genre: {type: String, required: true, trim: true},
    rating: {type: Number},
    playerCount: {type: Number}
},
{collection: "games"}
)

const GameModel = model<Game>("Game", GameSchema);

function index(): Promise<Game[]> {
    return GameModel.find();
}

function get(gameId: String): Promise<Game> {
    return GameModel.find({gameId})
    .then((list) => list[0])
    .catch((err) => {
        throw `${gameId} not found`;
    })
}

function create(json: Game): Promise<Game> {
    const t = new GameModel(json);
    return t.save();
}

function update(gameId: String, game: Game): Promise<Game> {
    return GameModel.findOneAndUpdate({ gameId }, game, {
        new: true
    })
    .then((updated) => {
        if (!updated) throw `${gameId} not found`;
        else return updated as Game;
    })
}

function remove(gameId: String): Promise<void> {
    return GameModel.findOneAndDelete({ gameId })
    .then((deleted) => {
        if (!deleted) throw `${gameId} not deleted`;
    });
}

export default { index, get, create, update, remove }