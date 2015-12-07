let commands = [
    'PLAYER_JOINED'
];

let ClientCommands = {};

for (let command of commands) {
    ClientCommands[command] = command;
}

export default ClientCommands;
