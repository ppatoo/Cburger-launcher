if(location.protocol=='http:'){var proto='ws'}else if(location.protocol=='https:'){var proto='wss'};window.WebMCSocketTemplate=(proto+'://'+location.host.replace('m.', ''));
window.eaglercraftXOpts = {
    enableMinceraft: false,
    container: "game_frame",
    assetsURI: "assets.epk",
    localesURI: "lang/",
    servers: [
        {
            addr: window.WebMCSocketTemplate+'/server',
            name: "✫ WebMC", 
            hideAddress: true
        },
        {
            addr: window.WebMCSocketTemplate+'/server/eaglesmp',
            name: "✫ EagleSMP", 
            hideAddress: true
        },
        //{
        //    addr: "wss://eagler-backrooms.colbster937.dev",
        //    name: "✫ The Backrooms", 
        //    hideAddress: true
        //},
        {
            addr: "wss://necronis.betterthanarchmc.lol",
            name: "✫ Necron Network", 
            hideAddress: true
        },
        {
            addr: "wss://play.cburger.net",
            name: "✫ Cheeseburger Network", 
            hideAddress: true
        },
        {
            addr: "wss://mc.arch.lol",
            name: "ArchMC", 
            hideAddress: true
        },
        {
            addr: "wss://x.mess.eu.org",
            name: "MessCraft", 
            hideAddress: true
        },
        {
            addr: "wss://sus.shhnowisnottheti.me",
            name: "CreaCraft/ayunboom", 
            hideAddress: true
        },
        {
            addr: "wss://reading-gs.q13x.com",
            name: "q13x Anarchy", 
            hideAddress: true
        },
        {
            addr: "wss://proxy.theludos.com",
            name: "EaglerProxy", 
            hideAddress: true
        }
    ],
    "relays": [
        {
            "addr": window.WebMCSocketTemplate+'/relay',
            "comment": "WebMC Relay",
            "primary": true
        },
        {
            "addr": "wss://relay.deev.is/",
            "comment": "LAX1DUDE's Shared World Relay #1",
            "primary": false
        },
        {
            "addr": "wss://relay.lax1dude.net/",
            "comment": "LAX1DUDE's Shared World Relay #2",
            "primary": false
        }//,
//        {
//            "addr": "wss://relay.shhnowisnottheti.me/",
//            "comment": "ayunami's Public Relay",
//            "primary": false
//        }
    ]
};
