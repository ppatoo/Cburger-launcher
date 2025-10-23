if(location.protocol=='http:'){var proto='ws'}else if(location.protocol=='https:'){var proto='wss'};window.WebMCSocketTemplate=(proto+'://'+location.host.replace('m.', ''));
window.eaglercraftOpts = {
    container: "game_frame",
    assetsURI: "assets.epk",
    serverWorkerURI: "worker_bootstrap.js",
    servers: [
        {
            serverAddress: window.WebMCSocketTemplate+'/server/1.5.2',
            serverName: "✫ WebMC", 
            hideAddress: false
        },
        {
            serverAddress: "wss://x.mess.eu.org",
            serverName: "MessCraft", 
            hideAddress: false
        },
        {
            serverAddress: "wss://sus.shhnowisnottheti.me",
            serverName: "CreaCraft", 
            hideAddress: false
        },
        {
            serverAddress: "address here",
            serverName: "placeholder", 
            hideAddress: false
        }
    ],
    relays: [
        { 
            addr: window.WebMCSocketTemplate+'/relay',
            name: "WebMC Relay",
            primary: relayId == 0
        },
        {
            addr: "wss://relay.deev.is/",
            name: "lax1dude relay #1",
            primary: relayId == 1
        },
        {
            addr: "wss://relay.lax1dude.net/",
            name: "lax1dude relay #2",
            primary: relayId == 2
        }//,
//        {
//            addr: "wss://relay.shhnowisnottheti.me/",
//            name: "ayunami relay #1",
//            primary: relayId == 3
//        }
    ],
    mainMenu: { 
        splashes: [
            " "
        ], 
        eaglerLogo: false
    }
};