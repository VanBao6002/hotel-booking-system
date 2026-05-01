import { homeManagerTemplate } from "../templates/home-manager.template.js";
import { usersManagementTemplate } from "../templates/users-management.template.js";
import { initUsersManagement } from "./users-management.js";

// Swap nội dung vào #manager-content
function loadManagerContent(html, initFn) {
    const content = document.getElementById("manager-content");
    if (!content) return;
    content.innerHTML = html;
    if (initFn) initFn();
}

// Cập nhật active state sidebar
function setActiveSidebarItem(clickedEl) {
    document.querySelectorAll(".sidebar-item").forEach(el => el.classList.remove("active"));
    clickedEl.classList.add("active");
}

// Lấy nội dung Dashboard từ template (phần bên trong #manager-content)
function getDashboardHTML() {
    const tmp = document.createElement("div");
    tmp.innerHTML = homeManagerTemplate();
    const inner = tmp.querySelector("#manager-content");
    return inner ? inner.innerHTML : "";
}

export function initHomeManager() {
    // Map className sidebar => { html, initFn }
    const sidebarRoutes = {
        "manager__btn-dashboard": { getHTML: getDashboardHTML,      initFn: null           },
        "manager__btn-users":     { getHTML: usersManagementTemplate,    initFn: initUsersManagement },
        // Thêm các mục khác vào đây sau
        // "manager__btn-properties": { getHTML: propertiesTemplate, initFn: initProperties },
    };

    document.querySelectorAll(".sidebar-item").forEach(item => {
        item.addEventListener("click", () => {
            setActiveSidebarItem(item);

            // Tìm route khớp với className của item
            const matchedKey = Object.keys(sidebarRoutes).find(cls => item.classList.contains(cls));
            if (matchedKey) {
                const route = sidebarRoutes[matchedKey];
                loadManagerContent(route.getHTML(), route.initFn);
            }
        });
    });
}