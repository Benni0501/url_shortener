import express, { Express, Request, Response } from 'express';
import cors from "cors";
import compression from 'compression';
import DBAccess from './dbAccess.js';
import dotenv from 'dotenv';
const app: Express = express();
const port = 8060;
const config = process.env;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(express.static('static'));
dotenv.config();
const dbAccess = new DBAccess();
dbAccess.connect();

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
    while(await dbAccess.checkIfIDExists(id) == false){
        id = guid();
    }
    dbAccess.addURL(id, url);
    res.send(JSON.stringify({id:id}))
})

app.get('/:id', async (req:Request, res:Response) => {
    let url:string = await dbAccess.getUrlforID(req.params.id);
    if (url == ""){
        res.sendStatus(404);
    } else {
        res.redirect(url);
    }
})

app.listen(port, () => console.log(`Server is runnning on port ${port}`))