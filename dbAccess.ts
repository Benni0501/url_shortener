import {Client, QueryResult, DatabaseError} from 'pg'
import dotenv from 'dotenv';

export default class DBAccess{
    #client:Client;
// tssts
    constructor(){
        this.#client = new Client({
            host: process.env.DATABASE_HOST || "localhost",
            user: process.env.DATABASE_USER || "postgres",
            password: process.env.DATABASE_PASSWORD || "",
            database: "url_shortener",
			//@ts-ignore
			port: process.env.DATABASE_PORT || 5432,
			keepAlive: true,
			keepAliveInitialDelayMillis: 10000
        });
		dotenv.config();
		
    }

    connect(): void{
        this.#client.connect((err) => {
			if (err) {
			console.error('connection error', err.stack);
			} else {
			console.log('connected');
			}
      })
	  	this.#client.on('error', (err) => {
			console.error('connection error', err.stack);
			console.log('trying to reconnect');
			this.#client.connect((err) => {
				if (err) {
				console.error('connection error', err.stack);
				} else {
				console.log('connected');
				}
		    })
		})
    }

    async getUrlforID(id:string): Promise<string>{
        const res : QueryResult = await this.#client.query('SELECT url FROM public.url WHERE id=$1', [id]);
		if (res.rowCount == 0) return "";
        return res.rows[0].url;
    }

    async addURL(id:string, url:string): Promise<void>{
		await this.#client.query('INSERT INTO public.url VALUES($1, $2)', [id, url]);
    }
	
	async checkIfIDExists(id:string): Promise<boolean>{
		const res: QueryResult = await this.#client.query('SELECT COUNT(*) FROM public.url WHERE id=$1', [id])
		return res.rows[0] == 0 ? false : true;
 	}
}
