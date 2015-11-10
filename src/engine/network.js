// import SocketClient from 'socket.io-client';
//
// const SERVER = 'http://localhost:8888';
//
// let socket = SocketClient(SERVER);
//
// socket.on('update', (data) => {
//     console.log('update', data);
// });
//
// let socketIdPlayerPair = new Map();
//
// let Network = {
//     listen () {
//         socket.on('update', (data) => {
//             if (data.players) {
//                 for (let player of data.players) {
//                     if (!socketIdPlayerPair.has(player.id)) {
//                         socketIdPlayerPair.add(player)
//                     }
//                 }
//             }
//         });
//     },
//
//     setWorld (world) {
//         this.world = world;
//     },
//
//     update () {
//         socket.emit('update', {
//             position: this.world.player.position
//         });
//     }
// };
//
// export default Network;
