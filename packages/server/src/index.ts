import express, { Request, Response } from "express";
import { HomePage } from "./pages/homePage";
import { getGame } from "./services/home-svc";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

app.get("/home",
    (req: Request, res: Response) => {
        const data = getGame("");
        const page = new HomePage(data);

        res.set("Content-Type", "text/html").send(page.render());
    }
)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});