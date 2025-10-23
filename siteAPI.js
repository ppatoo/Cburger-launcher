WebMC = {};

WebMC.addSidebarItem = function(url, name, icon) {
    var sideBarItem = document.createElement("li");
    var sideBarItemText = document.createElement("a");
    var sideBarItemIcon = document.createElement("img");
    sideBarItem.classList.add("sidebar-content");
    sideBarItem.id = 'sidebar-custom-' + url;
    sideBarItem.addEventListener('click', function() {
        sidebarChangePage('custom-' + url);
    });
    sideBarItemText.innerHTML = name;
    sideBarItemIcon.src = icon;
    sideBarItem.appendChild(sideBarItemIcon);
    sideBarItem.appendChild(sideBarItemText);
    document.querySelector(".sidebar").appendChild(sideBarItem);
    return console.log("Added \"" + name +  "\" to the sidebar");
}

WebMC.addTopbarItem = function(url, name) {
    var topBarItem = document.createElement("a");
    topBarItem.id = 'topbar-custom-' + url;
    topBarItem.addEventListener('click', function() {
        topbarChangePage('custom-' + url);
    });
    topBarItem.innerText = name;
    document.querySelector(".topbar").appendChild(topBarItem);
    return console.log("Added \"" + name +  "\" to the topbar");
}