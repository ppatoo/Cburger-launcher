const appVersion = '2.0';
window.isWebMC = true;

// Modern JavaScript with better organization
class EaglercraftLauncher {
    constructor() {
        this.gameRunning = false;
        this.versionDropdownOpen = false;
        this.isFullscreen = false;
        this.currentVersion = null;
        this.friendlyVersion = 'Select Version';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserPreferences();
        this.setupVersionDropdown();
        this.updateUI();
    }

    setupEventListeners() {
        // Version dropdown toggle
        document.addEventListener('click', (e) => {
            const versionBtn = document.querySelector('.version-btn');
            const versionDropdown = document.getElementById('versionContent');
            
            if (versionBtn && versionBtn.contains(e.target)) {
                this.toggleVersionDropdown();
            } else if (versionDropdown && !versionDropdown.contains(e.target)) {
                this.closeVersionDropdown();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeVersionDropdown();
            }
        });
    }

    loadUserPreferences() {
        // Load last version
        const lastVersion = sessionStorage.getItem('lastVersion');
        if (lastVersion) {
            this.changeVersion(lastVersion);
        }

        // Load custom profile
        const customName = localStorage.getItem('custom-profile-name') || 'Guest';
        const customIcon = localStorage.getItem('custom-profile-icon');
        
        const profileName = document.querySelector('.profile-name');
        const profileAvatar = document.querySelector('.profile-avatar');
        
        if (profileName) profileName.textContent = customName;
        if (profileAvatar && customIcon) profileAvatar.src = customIcon;
    }

    setupVersionDropdown() {
        // Add custom versions from localStorage
        this.loadCustomVersions();
    }

    loadCustomVersions() {
        const installations = JSON.parse(localStorage.getItem("installations") || "[]");
        const versionDropdown = document.getElementById('versionContent');
        
        if (!versionDropdown) return;

        // Clear existing custom versions
        const existingCustom = versionDropdown.querySelectorAll('.version-option.custom');
        existingCustom.forEach(el => el.remove());

        // Add custom versions
        installations.forEach(installation => {
            const [version, versionName] = installation.split("|");
            this.addCustomVersion(version, versionName);
        });
    }

    addCustomVersion(version, versionName) {
        const versionDropdown = document.getElementById('versionContent');
        if (!versionDropdown) return;

        const customCategory = versionDropdown.querySelector('.version-category:last-child');
        if (!customCategory) return;

        const versionOption = document.createElement('a');
        versionOption.className = 'version-option custom';
        versionOption.textContent = versionName;
        versionOption.onclick = () => this.changeVersion(`custom-${version}`);
        
        customCategory.appendChild(versionOption);
    }

    toggleVersionDropdown() {
        const dropdown = document.getElementById('versionContent');
        const arrow = document.getElementById('version-arrow');
        
        if (!dropdown) {
            console.error('Version dropdown not found!');
            return;
        }

        console.log('Current dropdown state:', this.versionDropdownOpen);
        console.log('Dropdown element:', dropdown);
        console.log('Dropdown classes:', dropdown.className);

        this.versionDropdownOpen = !this.versionDropdownOpen;
        
        if (this.versionDropdownOpen) {
            dropdown.classList.add('show');
            dropdown.style.display = 'block';
            if (arrow) arrow.style.transform = 'rotate(180deg)';
            console.log('Dropdown opened, display:', dropdown.style.display);
        } else {
            dropdown.classList.remove('show');
            dropdown.style.display = 'none';
            if (arrow) arrow.style.transform = 'rotate(0deg)';
            console.log('Dropdown closed, display:', dropdown.style.display);
        }
    }

    closeVersionDropdown() {
        const dropdown = document.getElementById('versionContent');
        const arrow = document.getElementById('version-arrow');
        
        if (!dropdown) return;

        this.versionDropdownOpen = false;
        dropdown.classList.remove('show');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    }

    changeVersion(version) {
        // Handle custom versions
        if (version.startsWith('custom-')) {
            const customVersion = version.replace('custom-', '');
            this.friendlyVersion = document.querySelector(`a[onclick*="custom-${customVersion}"]`)?.textContent || customVersion;
            this.currentVersion = customVersion;
        } else {
            // Handle regular versions
            const versionElement = document.querySelector(`a[onclick="changeVersion('${version}')"]`);
            this.friendlyVersion = versionElement?.textContent || version;
            this.currentVersion = version;
        }

        // Update UI
        const versionText = document.getElementById('version-text');
        if (versionText) versionText.textContent = this.friendlyVersion;

        // Update play button if game is running
        if (this.gameRunning && this.currentVersion !== version) {
            this.updatePlayButton('relaunch');
        }

        // Save to session storage
        sessionStorage.setItem('lastVersion', this.currentVersion);
        
        // Close dropdown
        this.closeVersionDropdown();
    }

    updatePlayButton(state = 'play') {
        const playBtn = document.querySelector('.play-button');
        if (!playBtn) return;

        playBtn.className = 'play-button';
        
        switch (state) {
            case 'running':
                playBtn.classList.add('running');
                playBtn.innerHTML = '<i class="fa-solid fa-stop"></i><span>STOP</span>';
                playBtn.onclick = () => this.stopGame();
                break;
            case 'relaunch':
                playBtn.classList.add('relaunch');
                playBtn.innerHTML = '<i class="fa-solid fa-refresh"></i><span>RELAUNCH</span>';
                playBtn.onclick = () => this.playGame();
                break;
            default:
                playBtn.innerHTML = '<i class="fa-solid fa-play"></i><span>PLAY</span>';
                playBtn.onclick = () => this.playGame();
        }
    }

    playGame() {
        if (!this.currentVersion) {
            this.changeVersion('1.8.8');
        }

        this.gameRunning = true;
        this.updatePlayButton('running');

        // Update title
        if (localStorage.getItem('cloakTab') !== 'true') {
            document.title = `Eaglercraft Launcher | ${this.friendlyVersion}`;
        }

        // Load game frame
        const gameFrame = document.querySelector('.game-frame');
        if (gameFrame) {
            if (this.currentVersion.startsWith('custom-')) {
                gameFrame.src = this.currentVersion.replace('custom-', '');
            } else {
                gameFrame.src = `/mc/${this.currentVersion}/`;
            }
        }

        // Show loading frame
        const gameFrameLoad = document.querySelector('.game-frame-load');
        if (gameFrameLoad && window.loaderHTML) {
            gameFrameLoad.srcdoc = window.loaderHTML;
        }

        // Focus game frame
        setTimeout(() => {
            if (gameFrame && gameFrame.contentWindow) {
                gameFrame.contentWindow.focus();
            }
        }, 100);
    }

    stopGame() {
        this.gameRunning = false;
        this.updatePlayButton('play');

        const gameFrame = document.querySelector('.game-frame');
        if (gameFrame) {
            gameFrame.src = 'about:blank';
        }

        // Clear loading frame
        const gameFrameLoad = document.querySelector('.game-frame-load');
        if (gameFrameLoad) {
            gameFrameLoad.removeAttribute('srcdoc');
        }

        // Update title
        if (localStorage.getItem('cloakTab') !== 'true') {
            document.title = 'Eaglercraft Launcher';
        }
    }

    toggleFullscreen() {
        const gameFrame = document.querySelector('.game-frame');
        if (!gameFrame) return;

        this.isFullscreen = !this.isFullscreen;
        
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        const fullscreenIcon = fullscreenBtn?.querySelector('i');
        
        if (this.isFullscreen) {
            gameFrame.classList.add('game-frame-fs');
            if (fullscreenIcon) {
                fullscreenIcon.classList.remove('fa-expand');
                fullscreenIcon.classList.add('fa-compress');
            }
        } else {
            gameFrame.classList.remove('game-frame-fs');
            if (fullscreenIcon) {
                fullscreenIcon.classList.remove('fa-compress');
                fullscreenIcon.classList.add('fa-expand');
            }
        }

        // Focus game frame
        if (gameFrame.contentWindow) {
            gameFrame.contentWindow.focus();
        }
    }

    openInNewTab() {
        if (this.currentVersion) {
            const url = this.currentVersion.startsWith('custom-') 
                ? this.currentVersion.replace('custom-', '')
                : `/mc/${this.currentVersion}`;
            window.open(url, '_blank');
        }
    }

    updateUI() {
        // Update version text
        const versionText = document.getElementById('version-text');
        if (versionText) versionText.textContent = this.friendlyVersion;

        // Update app version
        const versionInfo = document.querySelector('.version-text');
        if (versionInfo) {
            versionInfo.textContent = `v${appVersion}`;
        }
    }
}

// Initialize launcher
let launcher;

function iniframe() {
    return window.self !== window.top;
}
// Legacy compatibility functions
let s = '';
let al = false;
let fs = false;

// Handle URL parameters
var q = window.location.search;
if(q.toString().startsWith("?")) {
    q = new URLSearchParams(q);
    s = q.get("server");
    if(s) s = '?server=' + s;
    var v = q.get("version");
    if(v) {
        // Will be handled by launcher instance
        window.urlVersion = v;
    }
    al = q.get("autolaunch") === 'true';
    fs = q.get("fullscreen") === 'true';
    if(s||v||al||fs) history.replaceState('/','/','/');
}

// Password protection
const passwd = localStorage.getItem('passwd');
if(passwd && !sessionStorage.getItem('loggedIn')){
    while(true){
        if(prompt('Please log in!') === localStorage.getItem('passwd')){
            sessionStorage.setItem('loggedIn', 'true');
            break;
        } else {
            alert('Incorrect password');
        }
    }
}

// Initialize launcher when DOM is ready
window.addEventListener('DOMContentLoaded', function() {
    // Initialize the launcher
    launcher = new EaglercraftLauncher();
    
    // Handle URL version parameter
    if(window.urlVersion) {
        launcher.changeVersion(window.urlVersion);
    }
    
    // Handle autolaunch
    if(al && window.urlVersion) {
        launcher.playGame();
    }
    
    // Handle fullscreen
    if(fs) {
        launcher.toggleFullscreen();
    }
    
    // Set up game frame reference
    window.gameFrame = document.querySelector('.game-frame');
    if (window.gameFrame) {
        window.gameFrame.addEventListener('contextmenu', event => event.preventDefault());
    }
    
    // Load captcha if needed (disabled for now)
    // const lastCaptchaDate = localStorage.getItem('lastCaptchaDate');
    // if (!lastCaptchaDate || (Date.now() - new Date(lastCaptchaDate).getTime()) > 3 * 24 * 60 * 60 * 1000) {
    //     fetch("/loadCaptcha.js")
    //         .then(r => r.text())
    //         .then(r => eval(r))
    //         .catch(error => {
    //             console.warn('Failed to load captcha script:', error);
    //         });
    // }
    
    // Prevent context menu
    document.addEventListener('contextmenu', event => event.preventDefault());
});

// Loading screen
window.addEventListener('load', function() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.classList.add('loader--hidden');
        loader.addEventListener('transitionend', function() {
            loader.remove();
        });
    }
});
// Legacy compatibility functions for existing functionality
function customVersions() {
    if (launcher) {
        launcher.loadCustomVersions();
    }
}

function reloadCustomVersions() {
    if (launcher) {
        launcher.loadCustomVersions();
    }
}

function versionDropdown(action) {
    if (launcher) {
        if (action === 'close') {
            launcher.closeVersionDropdown();
        } else if (action === 'open') {
            launcher.toggleVersionDropdown();
        } else {
            launcher.toggleVersionDropdown();
        }
    }
}

function toggleVersionDropdown() {
    console.log('toggleVersionDropdown called');
    if (launcher) {
        console.log('Launcher found, calling toggleVersionDropdown');
        launcher.toggleVersionDropdown();
    } else {
        console.error('Launcher not initialized yet');
    }
}

// Test function to check dropdown element
function testDropdown() {
    const dropdown = document.getElementById('versionContent');
    const selector = document.querySelector('.version-selector');
    
    console.log('Dropdown element:', dropdown);
    console.log('Selector element:', selector);
    console.log('Dropdown position:', dropdown ? dropdown.getBoundingClientRect() : 'not found');
    console.log('Selector position:', selector ? selector.getBoundingClientRect() : 'not found');
}

function changeVersion(version) {
    if (launcher) {
        launcher.changeVersion(version);
    }
}

function playGame() {
    if (launcher) {
        launcher.playGame();
    }
}

function stopGame() {
    if (launcher) {
        launcher.stopGame();
    }
}
// Additional legacy functions
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
    if (launcher) {
        launcher.openInNewTab();
    }
}

function toggleFullscreen() {
    if (launcher) {
        launcher.toggleFullscreen();
    }
}
function writeError(error) {
    document.write(error);
}
// Navigation functions
let lastSidebarChange = 'launcher';
function sidebarChangePage(changeTo) {
    console.log('Sidebar change requested:', changeTo);
    
    if (lastSidebarChange === changeTo) {
        return;
    }
    
    lastSidebarChange = changeTo;
    
    // Update active nav item
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    const activeItem = document.getElementById(`sidebar-${changeTo}`);
    if (activeItem) {
        activeItem.classList.add('active');
        console.log('Active item updated:', activeItem);
    } else {
        console.error('Active item not found:', `sidebar-${changeTo}`);
    }
    
    // Handle content loading
    const contentFrame = document.querySelector('.content-frame');
    if (!contentFrame) {
        console.error('Content frame not found!');
        return;
    }
    
    if (changeTo === 'launcher') {
        contentFrame.src = 'about:blank';
        contentFrame.style.visibility = 'hidden';
        console.log('Launcher view - hiding content frame');
    } else if (!changeTo.includes('custom')) {
        contentFrame.src = `/${changeTo}.html`;
        contentFrame.style.visibility = 'visible';
        console.log('Loading page:', `/${changeTo}.html`);
    } else {
        contentFrame.src = changeTo.replace('custom-', '');
        contentFrame.style.visibility = 'visible';
        console.log('Loading custom page:', changeTo.replace('custom-', ''));
    }
}

let lastTopbarPage = 'play';
function topbarChangePage(changeTo) {
    if (lastTopbarPage === changeTo) {
        return;
    }
    
        lastTopbarPage = changeTo;
    
    // Update active tab
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => tab.classList.remove('active'));
    
    const activeTab = document.getElementById(`topbar-${changeTo}`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // Handle content loading
    const contentFrame = document.querySelector('.content-frame');
    if (!contentFrame) return;
    
    if (changeTo === 'play') {
        contentFrame.src = 'about:blank';
        contentFrame.style.visibility = 'hidden';
    } else if (changeTo.includes('custom')) {
        contentFrame.src = changeTo.replace('custom-', '');
        contentFrame.style.visibility = 'visible';
        } else {
        contentFrame.src = `/${changeTo}.html`;
        contentFrame.style.visibility = 'visible';
    }
}
// Utility functions
function playVersion(version, server) {
    if (launcher) {
        launcher.changeVersion(version);
    }
    if (server) {
        s = '?server=' + server;
    }
    sidebarChangePage('launcher');
    topbarChangePage('play');
    playGame();
}

function writeError(error) {
    document.write(error);
}

// Initialize user preferences
if (!localStorage.getItem('custom-profile-name')) {
    localStorage.setItem('custom-profile-name', 'Guest');
}

// Load custom profile icon if available
if (localStorage.getItem('custom-profile-icon')) {
    const profileAvatar = document.querySelector('.profile-avatar');
    if (profileAvatar) {
        profileAvatar.src = localStorage.getItem('custom-profile-icon');
    }
}

// Load custom profile name
const profileName = document.querySelector('.profile-name');
if (profileName) {
    profileName.textContent = localStorage.getItem('custom-profile-name');
}

// Load custom script if available
if (localStorage.getItem('loadscript')) {
    try {
        eval(localStorage.getItem('loadscript'));
    } catch (error) {
        console.warn('Failed to load custom script:', error);
    }
}
