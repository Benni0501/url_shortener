"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _DBAccess_client;
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
class DBAccess {
    constructor() {
        _DBAccess_client.set(this, void 0);
        __classPrivateFieldSet(this, _DBAccess_client, new pg_1.Client({
            host: process.env.DATABASE_HOST || "10.0.0.19",
            user: process.env.DATABASE_USER || "postgres",
            password: process.env.DATABASE_PASSWORD || "benni0501",
            database: "url_shortener",
            //@ts-ignore
            port: process.env.DATABASE_PORT || 5432,
            keepAlive: true,
            keepAliveInitialDelayMillis: 10000
        }), "f");
        dotenv_1.default.config();
    }
    connect() {
        __classPrivateFieldGet(this, _DBAccess_client, "f").connect((err) => {
            if (err) {
                console.error('connection error', err.stack);
            }
            else {
                console.log('connected');
            }
        });
        __classPrivateFieldGet(this, _DBAccess_client, "f").on('error', (err) => {
            console.error('connection error', err.stack);
            console.log('trying to reconnect');
            __classPrivateFieldGet(this, _DBAccess_client, "f").connect((err) => {
                if (err) {
                    console.error('connection error', err.stack);
                }
                else {
                    console.log('connected');
                }
            });
        });
    }
    getUrlforID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield __classPrivateFieldGet(this, _DBAccess_client, "f").query('SELECT url FROM public.url WHERE id=$1', [id]);
            if (res.rowCount == 0)
                return "";
            return res.rows[0].url;
        });
    }
    addURL(id, url) {
        return __awaiter(this, void 0, void 0, function* () {
            yield __classPrivateFieldGet(this, _DBAccess_client, "f").query('INSERT INTO public.url VALUES($1, $2)', [id, url]);
        });
    }
    checkIfIDExists(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield __classPrivateFieldGet(this, _DBAccess_client, "f").query('SELECT COUNT(*) FROM public.url WHERE id=$1', [id]);
            return res.rows[0] == 0 ? false : true;
        });
    }
}
exports.default = DBAccess;
_DBAccess_client = new WeakMap();
