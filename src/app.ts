import {sayHi} from "./tools.ts";
import EventEmitter from "node:events";
import {createServer, IncomingMessage} from "node:http";
import {
    addUser,
    getAllUsers,
    getUser, removeUser,
    updateUser,
    User
} from "./model/users.js";

const myName = "Konstantin"
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

const myServer = createServer(async (req, res) => {
    const {url, method} = req;

    const userIdMatch = url?.match(/^\/api\/users\/(\d+)$/);
    const userId = userIdMatch ? Number(userIdMatch[1]) : null;

    function parseBody(req: InstanceType<typeof IncomingMessage>) {
        return new Promise((resolve, reject) => {
            let body = "";
            req.on("data", (chunk) => {
                body += chunk.toString()
            })
            req.on("end", () => {
                try {
                    resolve(JSON.parse(body))
                } catch (e) {
                    reject(new Error('Invalid JSON'))
                }
            })
        })
    }

    switch (url! + method) {
        case "/api/users" + "POST": {
            const body = await parseBody(req)
            if (body) {
                addUser(body as User)
                res.writeHead(201, {"Content-Type": "text/plain"})
                res.end('User was added')
            } else {
                res.writeHead(409, {"Content-Type": "text/plain"})
                res.end('User already exists')
            }
            break;
        }
        case "/api/users" + "PUT": {
            const body = await parseBody(req) as User | null;
            if (!body || !body.id) {
                res.writeHead(400, { "Content-Type": "text/plain" });
                res.end("Invalid user data");
                return;
            }

            const isUpdated = updateUser(body);
            if (isUpdated) {
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end("User was updated");
            } else {
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("User not found");
            }
            break;
        }
        case `/api/users/${userId}` + "DELETE": {
            if (userId) {
                const deleted = removeUser(userId);
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(deleted));
            } else {
                res.writeHead(404, {"Content-Type": "text/plain"});
                res.end("User not found");
            }
            break;
        }
        case "/api/users" + "GET": {
            res.writeHead(200, {"Content-Type": "application/json"})
            res.end(JSON.stringify(getAllUsers()))
            break;
        }
        case `/api/users/${userId}` + "GET": {
            if (userId) {
                const user = getUser(userId);
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(user));
            } else {
                res.writeHead(404, {"Content-Type": "text/plain"});
                res.end("User not found");
            }
            break;
        }
        default:
            res.writeHead(404, {"Content-Type": "text/plain"})
            res.end('Not found')
            break;

    }

})

myServer.listen(3005, () => console.log("Server runs at http://localhost:3005"))