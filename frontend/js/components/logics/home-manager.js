import { homeManagerTemplate } from "../templates/home-manager.template.js";
import { usersManagementTemplate } from "../templates/users-management.template.js";
import { hotelsManagementTemplate } from "../templates/hotels-management.template.js";
import { financeManagementTemplate } from "../templates/finance-management.template.js";
import { bookingsManagementTemplate } from "../templates/bookings-management.template.js";
import { initUsersManagement } from "./users-management.js";
import { initHotelsManagement } from "./hotels-management.js";
import { initFinanceManagement } from "./finance-management.js";
import { initBookingsManagement } from "./bookings-management.js";
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

function bookingStatusLabel(status) {
    const normalized = String(status || "").toLowerCase();
    if (normalized === "completed" || normalized === "paid") return "Hoàn tất";
    if (normalized === "cancelled") return "Đã hủy";
    if (normalized === "confirmed") return "Đã xác nhận";
    if (normalized === "pending") return "Đang chờ";
    if (normalized === "booked") return "Đã đặt";
    return status || "-";
}

function monthLabel(month) {
    const labels = {
        JAN: "T1",
        FEB: "T2",
        MAR: "T3",
        APR: "T4",
        MAY: "T5",
        JUN: "T6",
        JUL: "T7",
        AUG: "T8",
        SEP: "T9",
        OCT: "T10",
        NOV: "T11",
        DEC: "T12",
    };
    return labels[String(month || "").substring(0, 3).toUpperCase()] || month || "";
}

function renderTopHotels(hotels) {
    const container = document.getElementById("manager-top-hotels");
    if (!container) return;

    const topHotels = [...(hotels || [])]
        .sort((a, b) => Number(b.averageStar || 0) - Number(a.averageStar || 0))
        .slice(0, 4);

    if (!topHotels.length) {
        container.innerHTML = `<div style="font-size: 13px; color: #8892a4;">Chưa có khách sạn</div>`;
        return;
    }

    container.innerHTML = topHotels.map(hotel => `
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
            <div style="width: 52px; height: 40px; border-radius: 5px; flex-shrink: 0; background: #e8e4dc; display: flex; align-items: center; justify-content: center; color: #9aa3b0; font-size: 11px;">
                ${Number(hotel.averageStar || 0).toFixed(1)}
            </div>
            <div style="flex: 1; min-width: 0;">
                <div style="font-size: 12px; font-weight: 500; color: #1a1a2e; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(hotel.address || `Khách sạn #${hotel.id}`)}</div>
                <div style="display: flex; gap: 12px; margin-top: 3px;">
                    <div><div style="font-size: 10px; color: #8892a4;">Khu vực</div><div style="font-size: 11px; font-weight: 600; color: #1a1a2e;">${escapeHtml(hotel.locationName || "-")}</div></div>
                    <div><div style="font-size: 10px; color: #8892a4;">Phòng</div><div style="font-size: 11px; font-weight: 600; color: #c9a84c;">${Number(hotel.roomCount || 0)}</div></div>
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
        tbody.innerHTML = `<tr><td colspan="5" style="padding: 14px 12px; font-size: 13px; color: #8892a4;">Chưa có đặt phòng</td></tr>`;
        return;
    }

    tbody.innerHTML = recent.map(booking => {
        const [statusBg, statusColor] = statusColors(booking.bookingStatus);
        const dates = booking.checkInDate && booking.checkOutDate
            ? `${booking.checkInDate} - ${booking.checkOutDate}`
            : "-";
        return `
            <tr style="border-bottom: 1px solid #f8f6f2;">
                <td style="padding: 12px 12px; font-size: 13px; color: #1a1a2e;">${escapeHtml(booking.guestName || "Khách")}</td>
                <td style="padding: 12px 12px; font-size: 13px; color: #4b5563;">${escapeHtml(booking.hotelName || "-")}</td>
                <td style="padding: 12px 12px; font-size: 13px; color: #4b5563;">${escapeHtml(dates)}</td>
                <td style="padding: 12px 12px; font-size: 13px; color: #1a1a2e; font-weight: 500;">${formatMoney(booking.totalPrice)}</td>
                <td style="padding: 12px 12px;">
                    <span style="background: ${statusBg}; color: ${statusColor}; padding: 3px 10px; border-radius: 5px; font-size: 12px; font-weight: 500;">${escapeHtml(bookingStatusLabel(booking.bookingStatus))}</span>
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
    const rootStyles = getComputedStyle(document.documentElement);
    const accentColor = rootStyles.getPropertyValue("--gold-color").trim() || "#C8A96C";
    const mutedColor = rootStyles.getPropertyValue("--text-gray-color").trim() || "#7A7685";
    const gridColor = rootStyles.getPropertyValue("--lightGray-color").trim() || "#E2DDD5";
    const data = monthlyData?.length ? monthlyData : [];
    const months = data.map(item => monthLabel(item.month));
    const values = data.map(item => Number(item.revenue || 0));
    const fallbackMonths = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];
    const labels = months.length ? months : fallbackMonths;
    const revenue = values.length ? values : Array(12).fill(0);

    const width = canvas.width;
    const height = canvas.height;
    const left = 64;
    const right = 20;
    const top = 34;
    const bottom = 38;
    const chartWidth = width - left - right;
    const chartHeight = height - top - bottom;
    const maxValue = Math.max(...revenue, 100000);
    const roundedMax = Math.ceil((maxValue * 1.15) / 100000) * 100000;

    ctx.clearRect(0, 0, width, height);
    ctx.font = "11px Inter, sans-serif";
    ctx.fillStyle = mutedColor;
    ctx.textAlign = "right";

    for (let i = 0; i <= 4; i++) {
        const value = Math.round((roundedMax / 4) * i);
        const y = top + chartHeight - (value / roundedMax) * chartHeight;
        ctx.fillText(`${Math.round(value / 1000)}k`, left - 8, y + 4);
        ctx.beginPath();
        ctx.strokeStyle = gridColor;
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
        ctx.fillStyle = accentColor;
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]) : ctx.rect(x, y, barWidth, barHeight);
        ctx.fill();
        ctx.fillStyle = mutedColor;
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
        recentTbody.innerHTML = `<tr><td colspan="5" style="padding: 14px 12px; font-size: 13px; color: #8892a4;">Đang tải đặt phòng...</td></tr>`;
    }

    try {
        const dashboard = await getManagerDashboard();
        const summary = dashboard?.financeSummary || {};

        setText("manager-stat-revenue", formatMoney(summary?.totalEarnings));
        setText("manager-stat-revenue-sub", "Tính cả doanh thu từ đặt phòng");
        setText("manager-stat-active-bookings", String(dashboard?.activeBookings || 0));
        setText("manager-stat-active-bookings-sub", `${dashboard?.totalBookings || 0} đặt phòng`);
        setText("manager-stat-occupancy", `${dashboard?.occupancyRate || 0}%`);
        setText("manager-stat-occupancy-sub", `${dashboard?.activeBookedRooms || 0}/${dashboard?.totalRooms || 0} phòng đang dùng`);
        setText("manager-stat-users", String(dashboard?.totalUsers || 0));
        setText("manager-stat-users-sub", "Lấy từ bảng người dùng");

        renderTopHotels(dashboard?.topHotels || []);
        renderRecentBookings(dashboard?.recentBookings || []);
        renderRevenueChart(dashboard?.monthlyRevenue?.data || []);
    } catch (err) {
        console.error("Không thể tải dashboard quản lý", err);
        setText("manager-stat-revenue", "Lỗi");
        setText("manager-stat-active-bookings", "Lỗi");
        setText("manager-stat-occupancy", "Lỗi");
        setText("manager-stat-users", "Lỗi");
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
