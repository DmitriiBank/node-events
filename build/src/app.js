var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { sayHi } from "./tools.js";
import { createServer } from "node:http";
import { addUser, getAllUsers, getUser, removeUser, updateUser } from "./model/users.js";
const myName = "Konstantin";
sayHi(myName);
// const myEmitter = new EventEmitter();
// myEmitter.on('eventName', (value1, value2) => {
//     console.log("myEvent")
// })
// myEmitter.emit('eventName', [value1, value2])
//
// myEmitter.on('less_than_0.5', (val) => {
//     console.log(`${val} < 0.5`)
// })
// myEmitter.on('greater_than_0.5', (val) => {
//     console.log(`${val} > 0.5`)
// })
// myEmitter.on('equal_0.5', (val) => {
//     console.log(`${val} = 0.5`)
// })
//
//
// for (let i = 0; i < 10; i++) {
//     let rand = Math.random()
//     if (rand === 0.5)
//         myEmitter.emit('equal_0.5', rand);
//     else if (rand < 0.5)
//         myEmitter.emit('less_than_0.5', rand);
//     else if (rand > 0.5)
//         myEmitter.emit('greater_than_0.5', rand);
// }
const myServer = createServer((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url, method } = req;
    const userIdMatch = url === null || url === void 0 ? void 0 : url.match(/^\/api\/users\/(\d+)$/);
    const userId = userIdMatch ? Number(userIdMatch[1]) : null;
    function parseBody(req) {
        return new Promise((resolve, reject) => {
            let body = "";
            req.on("data", (chunk) => {
                body += chunk.toString();
            });
            req.on("end", () => {
                try {
                    resolve(JSON.parse(body));
                }
                catch (e) {
                    reject(new Error('Invalid JSON'));
                }
            });
        });
    }
    switch (url + method) {
        case "/api/users" + "POST": {
            const body = yield parseBody(req);
            if (body) {
                addUser(body);
                res.writeHead(201, { "Content-Type": "text/plain" });
                res.end('User was added');
            }
            else {
                res.writeHead(409, { "Content-Type": "text/plain" });
                res.end('User already exists');
            }
            break;
        }
        case "/api/users" + "PUT": {
            const body = yield parseBody(req);
            if (!body || !body.id) {
                res.writeHead(400, { "Content-Type": "text/plain" });
                res.end("Invalid user data");
                return;
            }
            const isUpdated = updateUser(body);
            if (isUpdated) {
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end("User was updated");
            }
            else {
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("User not found");
            }
            break;
        }
        case `/api/users/${userId}` + "DELETE": {
            if (userId) {
                const deleted = removeUser(userId);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(deleted));
            }
            else {
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("User not found");
            }
            break;
        }
        case "/api/users" + "GET": {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(getAllUsers()));
            break;
        }
        case `/api/users/${userId}` + "GET": {
            if (userId) {
                const user = getUser(userId);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(user));
            }
            else {
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("User not found");
            }
            break;
        }
        default:
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end('Not found');
            break;
    }
}));
myServer.listen(3005, () => console.log("Server runs at http://localhost:3005"));
