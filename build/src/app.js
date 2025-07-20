var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createServer } from "node:http";
import { addUser, getAllUsers, getUser, removeUser, updateUser } from "./model/users.js";
import { myLogger } from "./events/logger.js";
const myServer = createServer((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    myLogger.log('We got the request');
    const { url, method } = req;
    const parsedUrl = new URL(url, "http://localhost:3005");
    let user;
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
    switch (parsedUrl.pathname + method) {
        case "/api/users" + "POST": {
            const body = yield parseBody(req);
            const isSuccess = addUser(body);
            if (isSuccess) {
                myLogger.save(`User with id ${body.id} was successfully added`);
                res.writeHead(201, { "Content-Type": "text/plain" });
                res.end('User was added');
                // emitter.emit('user_added')
                myLogger.log(`Response for add user with id ${body.id} was send`);
            }
            else {
                res.writeHead(409, { "Content-Type": "text/plain" });
                res.end('User already exists');
                myLogger.log(`User with id ${body.id} already exists`);
                myLogger.save(`User with id ${body.id} already exists`);
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
        case "/api/users" + "DELETE": {
            user = (yield parseBody(req));
            const deleted = removeUser(user.id);
            if (deleted) {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(deleted));
                // emitter.emit('user_removed')
                myLogger.save(`User with id ${user.id} was deleted`);
            }
            else {
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("User not found");
            }
            break;
        }
        case "/api/users" + "GET": {
            const users = getAllUsers();
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(users));
            break;
        }
        case "/api/user" + "GET": {
            const id = parsedUrl.searchParams.get('userId');
            if (!id) {
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("User not found");
            }
            else {
                const founded = getUser(+id);
                if (founded !== null) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(founded));
                }
                else {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end('User not found');
                }
            }
            break;
        }
        case '/api/logger' + 'GET': {
            const allLogs = myLogger.getLogArray();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(allLogs));
            break;
        }
        default:
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end('Not found');
            break;
    }
}));
myServer.listen(3005, () => console.log("Server runs at http://localhost:3005"));
