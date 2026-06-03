import { homeManagerTemplate } from "../templates/home-manager.template.js";
import { usersManagementTemplate } from "../templates/users-management.template.js";
import { hotelsManagementTemplate } from "../templates/hotels-management.template.js";
import { financeManagementTemplate } from "../templates/finance-management.template.js";
import { bookingsManagementTemplate } from "../templates/bookings-management.template.js";
import { profileTemplate } from "../templates/profile.template.js";
import { initUsersManagement } from "./users-management.js";
import { initHotelsManagement } from "./hotels-management.js";
import { initFinanceManagement } from "./finance-management.js";
import { initBookingsManagement } from "./bookings-management.js";
import { initSetting } from "./setting.js";
import { getManagerDashboard } from "../../services/admin.js";
// Swap nội dung vào #manager-content
function loadManagerContent(html, initFn, title = "") {
    const titleEl = document.getElementById("manager-topbar-title");
    const content = document.getElementById("manager-content");
    if (titleEl && title) titleEl.textContent = title;
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

function formatMoney(value) {
    return `${Number(value || 0).toLocaleString("vi-VN")} VND`;
}

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
    }[char]));
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function statusColors(status) {
    const normalized = (status || "").toLowerCase();
    if (normalized === "completed" || normalized === "paid") {
        return ["#dcfce7", "#166534"];
    }
    if (normalized === "cancelled") {
        return ["#fee2e2", "#b91c1c"];
    }
    return ["#fef9c3", "#a16207"];
}

function renderTopHotels(hotels) {
    const container = document.getElementById("manager-top-hotels");
    if (!container) return;

    const topHotels = [...(hotels || [])]
        .sort((a, b) => Number(b.averageStar || 0) - Number(a.averageStar || 0))
        .slice(0, 4);

    if (!topHotels.length) {
        container.innerHTML = `<div style="font-size: 13px; color: #8892a4;">No hotels found</div>`;
        return;
    }

    container.innerHTML = topHotels.map(hotel => `
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
            <div style="width: 52px; height: 40px; border-radius: 5px; flex-shrink: 0; background: #e8e4dc; display: flex; align-items: center; justify-content: center; color: #9aa3b0; font-size: 11px;">
                ${Number(hotel.averageStar || 0).toFixed(1)}
            </div>
            <div style="flex: 1; min-width: 0;">
                <div style="font-size: 12px; font-weight: 500; color: #1a1a2e; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(hotel.address || `Hotel #${hotel.id}`)}</div>
                <div style="display: flex; gap: 12px; margin-top: 3px;">
                    <div><div style="font-size: 10px; color: #8892a4;">Location</div><div style="font-size: 11px; font-weight: 600; color: #1a1a2e;">${escapeHtml(hotel.locationName || "-")}</div></div>
                    <div><div style="font-size: 10px; color: #8892a4;">Rooms</div><div style="font-size: 11px; font-weight: 600; color: #c9a84c;">${Number(hotel.roomCount || 0)}</div></div>
                </div>
            </div>
        </div>
    `).join("");
}

function renderRecentBookings(bookings) {
    const tbody = document.getElementById("manager-recent-bookings");
    if (!tbody) return;

    const recent = [...(bookings || [])].slice(0, 5);
    if (!recent.length) {
        tbody.innerHTML = `<tr><td colspan="5" style="padding: 14px 12px; font-size: 13px; color: #8892a4;">No bookings found</td></tr>`;
        return;
    }

    tbody.innerHTML = recent.map(booking => {
        const [statusBg, statusColor] = statusColors(booking.bookingStatus);
        const dates = booking.checkInDate && booking.checkOutDate
            ? `${booking.checkInDate} - ${booking.checkOutDate}`
            : "-";
        return `
            <tr style="border-bottom: 1px solid #f8f6f2;">
                <td style="padding: 12px 12px; font-size: 13px; color: #1a1a2e;">${escapeHtml(booking.guestName || "Guest")}</td>
                <td style="padding: 12px 12px; font-size: 13px; color: #4b5563;">${escapeHtml(booking.hotelName || "-")}</td>
                <td style="padding: 12px 12px; font-size: 13px; color: #4b5563;">${escapeHtml(dates)}</td>
                <td style="padding: 12px 12px; font-size: 13px; color: #1a1a2e; font-weight: 500;">${formatMoney(booking.totalPrice)}</td>
                <td style="padding: 12px 12px;">
                    <span style="background: ${statusBg}; color: ${statusColor}; padding: 3px 10px; border-radius: 5px; font-size: 12px; font-weight: 500;">${escapeHtml(booking.bookingStatus || "-")}</span>
                </td>
            </tr>
        `;
    }).join("");
}

function renderRevenueChart(monthlyData) {
    const canvas = document.getElementById("manager-revenue-chart");
    if (!canvas) return;

    canvas.width = canvas.parentElement.offsetWidth || 600;
    canvas.height = 220;
    const ctx = canvas.getContext("2d");
    const data = monthlyData?.length ? monthlyData : [];
    const months = data.map(item => (item.month || "").substring(0, 3));
    const values = data.map(item => Number(item.revenue || 0));
    const fallbackMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const labels = months.length ? months : fallbackMonths;
    const revenue = values.length ? values : Array(12).fill(0);

    const width = canvas.width;
    const height = canvas.height;
    const left = 60;
    const right = 16;
    const top = 18;
    const bottom = 34;
    const chartWidth = width - left - right;
    const chartHeight = height - top - bottom;
    const maxValue = Math.max(...revenue, 100000);
    const roundedMax = Math.ceil(maxValue / 100000) * 100000;

    ctx.clearRect(0, 0, width, height);
    ctx.font = "11px Inter, sans-serif";
    ctx.fillStyle = "#9aa3b0";
    ctx.textAlign = "right";

    for (let i = 0; i <= 4; i++) {
        const value = Math.round((roundedMax / 4) * i);
        const y = top + chartHeight - (value / roundedMax) * chartHeight;
        ctx.fillText(`${Math.round(value / 1000)}k`, left - 8, y + 4);
        ctx.beginPath();
        ctx.strokeStyle = "#f0ece4";
        ctx.setLineDash([3, 3]);
        ctx.moveTo(left, y);
        ctx.lineTo(left + chartWidth, y);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    const barGap = chartWidth / labels.length;
    const barWidth = Math.max(8, barGap * 0.45);
    labels.forEach((label, index) => {
        const barHeight = (revenue[index] / roundedMax) * chartHeight;
        const x = left + index * barGap + (barGap - barWidth) / 2;
        const y = top + chartHeight - barHeight;
        ctx.fillStyle = "#c9a84c";
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]) : ctx.rect(x, y, barWidth, barHeight);
        ctx.fill();
        ctx.fillStyle = "#9aa3b0";
        ctx.textAlign = "center";
        ctx.fillText(label, x + barWidth / 2, height - 10);
    });
}

function wireDashboardActions() {
    document.querySelector(".manager-dashboard-action-hotels")?.addEventListener("click", () => {
        document.querySelector(".manager__btn-properties")?.click();
        setTimeout(() => document.querySelector(".hotels-management__add-btn")?.click(), 0);
    });
    document.querySelector(".manager-dashboard-action-finance")?.addEventListener("click", () => {
        document.querySelector(".manager__btn-finance")?.click();
    });
}

async function initManagerDashboard() {
    wireDashboardActions();
    const recentTbody = document.getElementById("manager-recent-bookings");
    if (recentTbody) {
        recentTbody.innerHTML = `<tr><td colspan="5" style="padding: 14px 12px; font-size: 13px; color: #8892a4;">Loading bookings...</td></tr>`;
    }

    try {
        const dashboard = await getManagerDashboard();
        const summary = dashboard?.financeSummary || {};

        setText("manager-stat-revenue", formatMoney(summary?.totalEarnings));
        setText("manager-stat-revenue-sub", `${formatMoney(summary?.pendingPayouts)} pending`);
        setText("manager-stat-active-bookings", String(dashboard?.activeBookings || 0));
        setText("manager-stat-active-bookings-sub", `${dashboard?.totalBookings || 0} total bookings`);
        setText("manager-stat-occupancy", `${dashboard?.occupancyRate || 0}%`);
        setText("manager-stat-occupancy-sub", `${dashboard?.activeBookedRooms || 0}/${dashboard?.totalRooms || 0} rooms active`);
        setText("manager-stat-users", String(dashboard?.totalUsers || 0));
        setText("manager-stat-users-sub", "Loaded from users table");

        renderTopHotels(dashboard?.topHotels || []);
        renderRecentBookings(dashboard?.recentBookings || []);
        renderRevenueChart(dashboard?.monthlyRevenue?.data || []);
    } catch (err) {
        console.error("Could not load manager dashboard", err);
        setText("manager-stat-revenue", "Error");
        setText("manager-stat-active-bookings", "Error");
        setText("manager-stat-occupancy", "Error");
        setText("manager-stat-users", "Error");
        renderTopHotels([]);
        renderRecentBookings([]);
        renderRevenueChart([]);
    }
}

export function initHomeManager() {
    // Map className sidebar => { html, initFn }
    const sidebarRoutes = {
        "manager__btn-dashboard": { title: "Tổng Quan", getHTML: getDashboardHTML,         initFn: initManagerDashboard    },
        "manager__btn-users":     { title: "Quản Lý Người Dùng", getHTML: usersManagementTemplate,  initFn: initUsersManagement     },
        "manager__btn-properties":{ title: "Quản Lý Khách Sạn", getHTML: hotelsManagementTemplate, initFn: initHotelsManagement    },
        "manager__btn-bookings":  { title: "Quản Lý Đặt Phòng", getHTML: bookingsManagementTemplate, initFn: initBookingsManagement },
        "manager__btn-finance":   { title: "Quản Lý Tài Chính", getHTML: financeManagementTemplate, initFn: initFinanceManagement   },
        "manager__btn-settings":  { title: "Thông Tin Cá Nhân", getHTML: profileTemplate, initFn: initSetting },
    };

    document.querySelectorAll(".sidebar-item").forEach(item => {
        item.addEventListener("click", () => {
            setActiveSidebarItem(item);

            // Tìm route khớp với className của item
            const matchedKey = Object.keys(sidebarRoutes).find(cls => item.classList.contains(cls));
            if (matchedKey) {
                const route = sidebarRoutes[matchedKey];
                loadManagerContent(route.getHTML(), route.initFn, route.title);
            }
        });
    });

    initManagerDashboard();
}
