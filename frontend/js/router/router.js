const routers = {};
let currentPath = null;

export function addRoute(path, handler) {
    routers[path] = handler;
}

function renderRoute(path) {
    const handler = routers[path];
    if(handler) {
        handler();
    }
}

export function initRouter() {

    window.addEventListener("hashchange", () => {
        currentPath = window.location.hash;
        renderRoute(window.location.hash);
    });

    if(!window.location.hash) {
        window.location.hash = "#home";
    }

    currentPath = window.location.hash;
    renderRoute(currentPath || "#home");
}