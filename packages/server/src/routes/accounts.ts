import express, { Request, Response } from "express";
import { Account } from "models";
import Accounts from "../services/account-svc";

const router = express.Router()

router.get("/", (_, res: Response) => {
    Accounts.index()
    .then((list: Account[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:userId", (req: Request, res: Response) => {
    const { userId } = req.params;

    Accounts.get(userId)
    .then((account: Account) => res.json(account))
    .catch((err) => res.status(404).send(err));
});

router.post("/", (req: Request, res: Response) => {
    const newAccount = req.body;

    Accounts.create(newAccount)
    .then((account: Account) => res.status(201).json(account))
    .catch((err) => res.status(500).send(err));
})

router.put("/:userId", (req: Request, res: Response) => {
    const { userId } = req.params;
    const newAccount = req.body;

    Accounts.update(userId, newAccount)
    .then((account: Account) => res.json(account))
    .catch((err) => res.status(404).end());
});

router.delete("/:userId", (req: Request, res: Response) => {
    const { userId } = req.params;

    Accounts.remove(userId)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err));
});

export default router