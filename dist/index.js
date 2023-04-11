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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const dbAccess_js_1 = __importDefault(require("./dbAccess.js"));
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
const port = 8060;
const config = process.env;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, compression_1.default)());
app.use(express_1.default.static('static'));
dotenv_1.default.config();
const dbAccess = new dbAccess_js_1.default();
dbAccess.connect();
const guid = () => {
    const s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    return s4() + s4() + s4();
};
app.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let url = req.body.url;
    let id = guid();
    while ((yield dbAccess.checkIfIDExists(id)) == false) {
        id = guid();
    }
    dbAccess.addURL(id, url);
    res.send(JSON.stringify({ id: id }));
}));
app.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let url = yield dbAccess.getUrlforID(req.params.id);
    if (url == "") {
        res.sendStatus(404);
    }
    else {
        res.redirect(url);
    }
}));
app.listen(port, () => console.log(`Server is runnning on port ${port}`));
