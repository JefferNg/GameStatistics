import express, { Request, Response } from "express";
import { HomePage } from "./pages/homePage";
import { getGame } from "./services/home-svc";
import { connect } from "./services/mongo";
import { AccountPage } from "./pages/accountPage";
import Account from "./services/account-svc";
import accounts from "./routes/accounts";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

connect("gamedata");
app.use(express.json());
app.use("/api/accounts", accounts);

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

app.get("/",
    (req: Request, res: Response) => {
        const data = getGame();
        const page = new HomePage(data);

        res.set("Content-Type", "text/html").send(page.render());
    }
)

app.get("/account/:accountId",
    (req: Request, res: Response) => {
        const { accountId } = req.params;

        Account.get(accountId)
        .then((data) => {
            res.set("Content-Type", "text/html").send(new AccountPage(data).render())
        })
    }
)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.use(express.static(staticDir)); //grabs index.html if start page not found