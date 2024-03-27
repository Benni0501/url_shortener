import express, { Express, Request, Response } from 'express';
import cors from "cors";
import compression from 'compression';
import {createClient } from 'redis';
const app: Express = express();
const port = 8060;
const config = process.env;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(express.static('static'));
const redisClient = await createClient({
    url: "redis://10.0.0.19:6379"
})
    .on('error', (err: any) => console.log('Redis Client Error', err))
    .on("connect", () => console.log("connected to redis!"))
    .connect();


const guid = ():string => {
    const s4 = ():string => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + s4();
}

app.post('/', async (req:Request, res:Response) => {
    let url:string = req.body.url;
    let id:string = guid();
    while(await redisClient.EXISTS(id) != 0){
        id = guid();
    }
    redisClient.set(id, url);
    res.send(JSON.stringify({id:id}))
})

app.get('/:id', async (req:Request, res:Response) => {
    let url:string | null = await redisClient.get(req.params.id);
    if (url == "" || url == null){
        res.sendStatus(404);
    } else {
        res.redirect(url);
    }
})

app.listen(port, async () => {
    console.log(`Server is runnning on port ${port}`)
} )