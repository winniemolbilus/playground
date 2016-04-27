// Copyright 2016 Las Venturas Playground. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

const CommandManager = require('components/command_manager/command_manager.js');
const Database = require('components/database/database.js');
const PlayerManager = require('entities/player_manager.js');

// The Server object is the global instance of the Las Venturas Playground run-time. It is globally
// available and exposes an interface that enables any aspect of the server to be changed.
class Server {
    constructor() {
        this.database_ = new Database();

        this.commandManager_ = new CommandManager();
        this.playerManager_ = new PlayerManager();
    }

    // Gets the global command manager that owns all commands available to players.
    get commandManager() { return this.commandManager_; }

    // Gets the global player manager that knows the details and whereabouts of all in-game players.
    get playerManager() { return this.playerManager_; }

    // Gets the connection to the Las Venturas Playground database.
    get database() { return this.database_; }

    // Disposes and uninitializes the server object and all objects owned by it.
    dispose() {
        this.playerManager_.dispose();
        this.commandManager_.dispose();

        this.database_.dispose();
    }
}

exports = Server;

// The Server object is exposed on the global scope. It must, however, be instantiated manually when
// the test runner has finished verifying the state of the gamemode.
global.server = null;
