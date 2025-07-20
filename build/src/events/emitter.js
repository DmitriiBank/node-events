import { EventEmitter } from "node:events";
export const emitter = new EventEmitter();
emitter.on('user_added', () => {
    console.log('Usr was successfully added');
});
emitter.on('user_removed', () => {
    console.log('Usr was successfully removed');
});
