import express, { Application, Request, Response } from 'express';
import router from './router/user.router';

const app: Application = express();
app.use(express.json());
const PORT = 3000;

app.get("/", (req: Request, res: Response) => {

    res.send("Hello test Project");
});

//routers
app.use("/auth", router);
app.listen(PORT, (): void => {
    console.log(`App is runnin on port ${PORT}`);
})