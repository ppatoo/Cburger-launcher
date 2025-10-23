const launchAPI = {};

// Function to convert options to EaglerOpts
launchAPI.convertToEagOpts = function(opts, version) {
    launchAPI.convertedOpts = {
        container: opts.gameContainer || "game_frame",
        assetsURI: opts.assetsURI || "assets.epk",
        localesURI: opts.locales || "lang/",
        servers: opts.servers || [],
        relays: opts.relays || []
    };
    return launchAPI.convertedOpts;
};

// Initialize eagOpts and its arrays if not defined
if (!launchAPI.eagOpts) {
    launchAPI.eagOpts = {};
}
if (!launchAPI.eagOpts.servers) {
    launchAPI.eagOpts.servers = [];
}
if (!launchAPI.eagOpts.relays) {
    launchAPI.eagOpts.relays = [];
}
if (!launchAPI.eagOpts.gameContainer) {
    launchAPI.eagOpts.gameContainer = launchAPI.container;
}
if (!launchAPI.eagOpts.assetsURI) {
    launchAPI.eagOpts.assetsURI = launchAPI.assets;
}

// Function to add servers and relays to eagOpts
launchAPI.main = function() {
    if (launchAPI.servers && launchAPI.servers.length > 0) {
        for (let i = 0; i < launchAPI.servers.length; i++) {
            let currentServer = {
                addr: launchAPI.servers[i],
                name: launchAPI.servers[i]
            };
            launchAPI.eagOpts.servers.push(currentServer);
        }
    }
    
    if (launchAPI.relays && launchAPI.relays.length > 0) {
        for (let i = 0; i < launchAPI.relays.length; i++) {
            let currentRelay = {
                addr: launchAPI.relays[i],
                comment: launchAPI.relays[i]
            };
            launchAPI.eagOpts.relays.push(currentRelay);
        }
    }

    return launchAPI.convertToEagOpts({
        gameContainer: launchAPI.eagOpts.gameContainer,
        assets: launchAPI.eagOpts.assetsURI,
        locales: launchAPI.eagOpts.localesURI,
        servers: launchAPI.eagOpts.servers,
        relays: launchAPI.eagOpts.relays
    }, "1.8");
};