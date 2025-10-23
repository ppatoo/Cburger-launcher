const appVersion = '1.0';
window.isWebMC = true;
function iniframe() {
    return window.self !== window.top;
}
let gameRunning = true;
let versionDropdownOpen = false;
let isFullscreen = true;
//if(iniframe()==true){location.href='/iframe.html'};
var q = window.location.search;
if(q.toString().startsWith("?")) {
    q = new URLSearchParams(q);
    var s = q.get("server");
    if(s) var s = '?server=' + s;
    var v = q.get("version");
    if(v) changeVersion(v);
    var al = q.get("autolaunch");
    var fs = q.get("fullscreen");
    if(s||v||al||fs) history.replaceState('/','/','/');
} else {
    var s = '';
}
const passwd = localStorage.getItem('passwd');
if(passwd){if(!sessionStorage.getItem('loggedIn')){while(true){{if(prompt('Please log in!')==localStorage.getItem('passwd')){sessionStorage.setItem('loggedIn', 'true');break}else{alert('Incorrect password')}}}}};
window.addEventListener('load', function() {
    const loader = document.querySelector('.loader');
    loader.classList.add('loader--hidden');
    loader.addEventListener('transitionend', function() {
        loader.remove();
    });
    window.addEventListener('DOMContentLoaded', function() {
        document.getElementById('game-frame-load').srcdoc = window.loaderHTML;
    });
});
const lastCaptchaDate = localStorage.getItem('lastCaptchaDate');
window.addEventListener('DOMContentLoaded', function() {
    if (!lastCaptchaDate || (Date.now() - new Date(lastCaptchaDate).getTime()) > 3 * 24 * 60 * 60 * 1000) {
        fetch("/loadCaptcha.js").then(r => r.text()).then(r => eval(r));
    }
    document.addEventListener('contextmenu', event => event.preventDefault());
    document.querySelector('.dev-info > span').innerHTML = (document.querySelector('.dev-info > span').innerHTML.replace('${appVersion}', appVersion));
    window.gameFrame = document.querySelector('.game-frame');
    window.gameFrame.addEventListener('contextmenu', event => event.preventDefault());
    if(al){if(v){playGame()}};
    if(fs){openFullscreen()}else{exitFullscreen()};
    customVersions();
    if(sessionStorage.getItem('lastVersion')!==null){changeVersion(sessionStorage.getItem('lastVersion'))};
});
function customVersions() {
    const installations = getInstallationsFromLocalStorage();
    installations.forEach(installation => {
        const [version, versionName] = installation.split("|");
        addVersionToDropdown(version, versionName);
    });
    function getInstallationsFromLocalStorage() {
        const installations = localStorage.getItem("installations");
        return installations ? JSON.parse(installations) : [];
    }
    function addVersionToDropdown(version, versionName) {
        const versionContent = document.getElementById("versionContent");
        if (versionContent) {
            const a = document.createElement('a');
            a.className = "custom";
            a.id = "dropdown-custom-version-"+version;
            a.innerHTML = versionName;
            a.onclick = () => changeVersion('dropdown-custom-version-'+version);
            versionContent.appendChild(a);
        }
    }
}
function reloadCustomVersions() {
    const customversions = document.querySelectorAll('.version-content .custom');
    for (let i = 0; i < customversions.length; i++) {
        customversions[i].remove();
    }
    customVersions();
}
function versionDropdown(action) {
    if (action=='close') {
        versionDropdownOpen = true;
    } else if (action=='open') {
        versionDropdownOpen = false;
    }
    if (versionDropdownOpen) {
        document.querySelector('.version-content').style.display = 'none';
        if(document.querySelector('#version-btn-arrow')){document.querySelector('#version-btn-arrow').style.transform = 'rotate(0deg)'};
        versionDropdownOpen = false;
    } else if (!versionDropdownOpen) {
        document.querySelector('.version-content').style.display = 'block';
        if(document.querySelector('#version-btn-arrow')){document.querySelector('#version-btn-arrow').style.transform = 'rotate(180deg)'};
        versionDropdownOpen = true;
    }
}
function changeVersion(version) {
    if (version.includes('dropdown-custom-version-')) {
        window.friendlyVersion = document.getElementById('dropdown-custom-version-'+version.replace('dropdown-custom-version-', '')).innerHTML;
    } else {
        window.friendlyVersion = document.querySelector('a[onclick="changeVersion(\'' + version + '\')"]').innerHTML;
        //window.friendlyVersion = version.replace('classic', 'Classic').replace('ms-Classic', 'Classic (Microsoft Recreation)').replace('beta-1.7.3', 'Beta 1.7.3').replace('beta-1.3', 'Beta 1.3').replace('alpha-1.2.6', 'Alpha 1.2.6').replace('dragonx-client', 'DragonX Client').replace('resent', 'Resent Client').replace('optifine', 'Shadow Client').replace('flame', 'Flame Client').replace('1.9', '1.9.4');
    }
    document.querySelector('.version-btn').innerHTML = window.friendlyVersion;
    if(gameRunning==true&&window.currentVersion!==version.toString().toLowerCase().replaceAll(' ', '-')){document.querySelector('.play-btn').innerHTML='RELAUNCH';document.querySelector('.play-btn').classList.add('play-btn-relaunch');document.querySelector('.play-btn').setAttribute('onclick', 'playGame()')};
    window.currentVersion = version.toString().toLowerCase().replaceAll(' ', '-');
    sessionStorage.setItem('lastVersion', window.currentVersion);
    versionDropdown('close');
}
function playGame() {
    if(s==null){s=''};
    const playBtn = document.querySelector('.play-btn');
    playBtn.classList.remove('play-btn-relaunch');
    playBtn.classList.add('play-btn-running');
    playBtn.innerHTML = 'STOP';
    playBtn.setAttribute('onclick', 'stopGame()');
    document.querySelector('.game-frame-load').srcdoc=(window.loaderHTML);
    if (!window.currentVersion || window.currentVersion == null) {
        const defaultVersion = '1.8.8';
        const defaultVersion_fri = '1.8.8';
        changeVersion(defaultVersion);
        window.friendlyVersion = defaultVersion_fri;
    }
    gameRunning = true;
    if(localStorage.getItem('cloakTab')!=='true'){document.title='WebMC Launcher | '+window.friendlyVersion};
    if (!window.currentVersion.includes('dropdown-custom-version-')) {
        document.querySelector('.game-frame').src = `/mc/${window.currentVersion}/${s}`;
    } else {
        document.querySelector('.game-frame').src = `${window.currentVersion.replace('dropdown-custom-version-', '')}/${s}`;
    }
    document.getElementById('fullscreen-btn').style.visibility = 'visible';
    document.getElementById('aboutBlank-btn').style.visibility = 'visible';
    document.getElementById('reload-btn').style.visibility = 'visible';
    setTimeout(function() {
        document.getElementById('fullscreen-btn').style.opacity = '1';
        document.getElementById('aboutBlank-btn').style.opacity = '1';
        document.getElementById('reload-btn').style.opacity = '1';
        document.querySelector('.game-frame').contentWindow.focus();
    }, 100);
}
function stopGame() {
    gameRunning = false;
    window.gameFrame.src = "about:blank";
    window.gameFrame.onload = function() {
        if (window.gameFrame.contentWindow.location.href.includes("about:blank")) {
            document.querySelector('.game-frame-load').removeAttribute('srcdoc');
            if(localStorage.getItem('cloakTab')!=='true'){document.title='WebMC Launcher'}
            const playBtn = document.querySelector('.play-btn');
            playBtn.classList.remove('play-btn-running');
            playBtn.innerHTML = 'PLAY';
            playBtn.setAttribute('onclick', 'playGame()');
            const fullscreenBtn = document.getElementById('fullscreen-btn');
            const aboutBlankBtn = document.getElementById('aboutBlank-btn');
            const reloadBtn = document.getElementById('reload-btn');
            fullscreenBtn.style.opacity = '0';
            aboutBlankBtn.style.opacity = '0';
            reloadBtn.style.opacity = '0';
            setTimeout(function() {
                if (window.gameFrame.contentWindow.location.href.includes(location.origin + "/blank.html")) {
                    fullscreenBtn.style.visibility = 'hidden';
                    aboutBlankBtn.style.visibility = 'hidden';
                    reloadBtn.style.visibility = 'hidden';
                }
            }, 2000);
        }
    }
}
function openAboutBlankWindow(version) {
    const newAboutBlankWindow = window.open('about:blank');
    const loadiframe = document.createElement('iframe');
    loadiframe.srcdoc = window.loaderHTML;
    loadiframe.style.border = 'none';
    loadiframe.border = '0';
    loadiframe.style.position = 'absolute';
    loadiframe.style.left = 0;
    loadiframe.style.top = 0;
    loadiframe.style.width = '100%';
    loadiframe.style.height = '100%';
    loadiframe.allow = "fullscreen";
    loadiframe.referrerpolicy = "no-referrer";
    loadiframe.style.margin = '0';
    loadiframe.style.padding = '0';
    loadiframe.style.zIndex = '5';
    
    const iframe = document.createElement('iframe');
    newAboutBlankWindow.document.body.style.margin = '0';
    newAboutBlankWindow.document.body.style.overflow = 'hidden';
    newAboutBlankWindow.document.title = 'about:blank';
    iframe.src = `/mc/${version}/index.html`;
    iframe.style.border = 'none';
    iframe.border = '0';
    iframe.style.position = 'absolute';
    iframe.style.left = 0;
    iframe.style.top = 0;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.allow = "fullscreen";
    iframe.referrerpolicy = "no-referrer";
    iframe.style.margin = '0';
    iframe.style.padding = '0';
    iframe.style.zIndex = '10';
    iframe.setAttribute('onload', 'this.contentWindow.focus()');
    
    newAboutBlankWindow.document.body.appendChild(loadiframe);
    newAboutBlankWindow.document.body.appendChild(iframe);
    
}
function openInNewTab() {
    window.open(location.origin + `/mc/${window.currentVersion}`, '_blank');
}
function openFullscreen() {
    isFullscreen = true;
    window.gameFrame.classList.add('game-frame-fs');
    document.querySelector('.game-frame-load').classList.add('game-frame-load-fs');
    document.getElementById('fullscreen-btn').style.bottom = '7px';
    document.querySelector('#fullscreen-btn > i').classList.remove('fa-expand');
    document.querySelector('#fullscreen-btn > i').classList.add('fa-compress');

    // old function
    //var gameFrame = document.querySelector('.game-frame');
    //if (gameFrame.requestFullscreen) {
    //    gameFrame.requestFullscreen();
    //} else if (gameFrame.webkitRequestFullscreen) {
    //    gameFrame.webkitRequestFullscreen();
    //} else if (gameFrame.msRequestFullscreen) {
    //    gameFrame.msRequestFullscreen();
    //}
    //gameFrame.contentWindow.focus();
}
function exitFullscreen() {
    isFullscreen = false;
    window.gameFrame.classList.remove('game-frame-fs');
    document.querySelector('.game-frame-load').classList.remove('game-frame-load-fs');
    document.getElementById('fullscreen-btn').style.bottom = 'calc(7.5% + 7px)';
    document.querySelector('#fullscreen-btn > i').classList.remove('fa-compress');
    document.querySelector('#fullscreen-btn > i').classList.add('fa-expand');

    // old function
    //document.exitFullscreen();
}
function toggleFullscreen() {
    window.gameFrame.contentWindow.focus();
    if (isFullscreen) {
        exitFullscreen();
    } else {
        openFullscreen();
    }
}
function writeError(error) {
    document.write(error);
}
let lastSidebarChange = 'launcher';
function sidebarChangePage(changeTo) {
    if (lastSidebarChange === changeTo) {
        return;
    } else {
        lastSidebarChange = changeTo;
    }
    const sidebarFrame = document.querySelector('.sidebar_frame');
    if (changeTo === 'launcher') {
        sidebarFrame.src = 'about:blank';
        sidebarFrame.style.visibility = 'hidden';
        const sidebar_content_items = document.body.querySelectorAll('.sidebar-content')
        for (let i = 0; i < sidebar_content_items.length; i++) {
            sidebar_content_items[i].classList.remove('sidebar-content-selected');
        }
        document.getElementById('sidebar-'+changeTo).classList.add('sidebar-content-selected');
    } else if(!changeTo.includes('custom')) {
        sidebarFrame.src = '/'+changeTo+'.html';
        sidebarFrame.style.visibility = 'visible';
        const sidebar_content_items = document.body.querySelectorAll('.sidebar-content')
        for (let i = 0; i < sidebar_content_items.length; i++) {
            sidebar_content_items[i].classList.remove('sidebar-content-selected');
        }
        document.getElementById('sidebar-'+changeTo).classList.add('sidebar-content-selected');
    } else {
        sidebarFrame.src = changeTo.replace('custom-', '');
        sidebarFrame.style.visibility = 'visible';
        const sidebar_content_items = document.body.querySelectorAll('.sidebar-content')
        for (let i = 0; i < sidebar_content_items.length; i++) {
            sidebar_content_items[i].classList.remove('sidebar-content-selected');
        }
        document.getElementById('sidebar-'+changeTo).classList.add('sidebar-content-selected'); 
    }
}
let lastTopbarPage = 'play';
function topbarChangePage(changeTo) {
    if (lastTopbarPage !== changeTo) {
        lastTopbarPage = changeTo;
        const topbarFrame = document.querySelector('.topbar_frame');
        const topbarElements = document.body.querySelectorAll('.topbar > a');
        for (let i = 0; i < topbarElements.length; i++) {
            topbarElements[i].classList.remove('active');
        }
        document.getElementById('topbar-'+changeTo).classList.add('active');
        if (changeTo !== 'play' && changeTo.includes('custom')) {
            topbarFrame.src='/topbar/'+changeTo+'.html';
            topbarFrame.style.visibility = 'visible';
        } else if(changeTo.includes('custom')) {
            topbarFrame.src=changeTo.replace('custom-', '');
            topbarFrame.style.visibility = 'visible';
        } else {
            topbarFrame.src='about:blank';
            topbarFrame.style.visibility = 'hidden';
        }
    }
}
function playVersion(version, server) {
    changeVersion(version);
    if (server) {
        s = '?server='+server;
    }
    sidebarChangePage('launcher');
    topbarChangePage('play');
    playGame();
}
if(!localStorage.getItem('custom-profile-name')){localStorage.setItem('custom-profile-name', 'WebMCGuest')};
if(localStorage.getItem('custom-profile-icon')){document.querySelector('.sidebar_profile_icon').src=localStorage.getItem('custom-profile-icon')}
document.querySelector('.sidebar_profile > a').innerText = localStorage.getItem('custom-profile-name');
if(localStorage.getItem('loadscript')){eval(localStorage.getItem('loadscript'))};
