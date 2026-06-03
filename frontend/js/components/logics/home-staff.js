import { renderStaffDashboardContent } from "../templates/home-staff.template.js";
import { bookingsManagementTemplate } from "../templates/bookings-management.template.js";
import { profileTemplate } from "../templates/profile.template.js";
import { initBookingsManagement } from "./bookings-management.js";
import { initSetting } from "./setting.js";
import { getReviewsHotel } from "../../services/hotel.js";
import {
    getStaffDashboard,
    getStaffHotel,
    getStaffRooms,
    getStaffBookings,
    searchStaffBookings,
    updateStaffRoomStatus,
} from "../../services/staff.js";

const ROOM_STATUSES = ["Available", "Booked", "Maintenance"];
const ROOM_STATUS_LABELS = {
    Available: "Còn trống",
    Booked: "Đã đặt",
    Maintenance: "Bảo trì",
};

function roomStatusLabel(status) {
    return ROOM_STATUS_LABELS[status] || status || "-";
}

function roomTypeLabel(typeCode) {
    const normalized = String(typeCode || "").trim().toUpperCase();
    if (normalized === "SINGLE" || normalized === "SINGLE ROOM") return "Phòng đơn";
    if (normalized === "DOUBLE" || normalized === "DOUBLE ROOM") return "Phòng đôi";
    return typeCode || "-";
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

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
    }[char]));
}

function formatMoney(value) {
    return `${Number(value || 0).toLocaleString("vi-VN")} VND`;
}

function getReviewsFromResponse(reviewData) {
    if (Array.isArray(reviewData)) return reviewData;
    if (Array.isArray(reviewData?.reviews)) return reviewData.reviews;
    return [];
}

function getAverageRating(reviewData, reviews) {
    const directAverage = Number(reviewData?.averageStar);
    if (Number.isFinite(directAverage) && directAverage > 0) return directAverage;
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);
    return total / reviews.length;
}

function formatReviewDate(value) {
    if (!value) return "-";
    const rawDate = String(value).split("T")[0];
    const parts = rawDate.split("-");
    if (parts.length === 3) {
        const [year, month, day] = parts;
        return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
    }
    return rawDate;
}

function reviewDateTime(value) {
    if (!value) return 0;
    const raw = String(value);
    const normalized = raw.includes("T") ? raw : `${raw}T00:00:00`;
    const time = new Date(normalized).getTime();
    return Number.isNaN(time) ? 0 : time;
}

function renderStars(rating) {
    const value = Math.max(0, Math.min(5, Math.round(Number(rating || 0))));
    return `<span style="color:#c9a84c;font-size:15px;letter-spacing:1px;white-space:nowrap;">${"★".repeat(value)}${"☆".repeat(5 - value)}</span>`;
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function setStaffContent(title, html, initFn) {
    const titleEl = document.getElementById("staff-topbar-title");
    const content = document.getElementById("staff-content");
    if (titleEl) titleEl.textContent = title;
    if (!content) return;
    content.innerHTML = html;
    if (initFn) initFn();
}

function setActiveSidebarItem(item) {
    document.querySelectorAll(".sidebar-item").forEach(el => {
        el.classList.remove("active");
    });
    item.classList.add("active");
}

function statusStyle(status) {
    const normalized = String(status || "").toLowerCase();
    if (normalized === "available") return "background:#dcfce7;color:#166534;";
    if (normalized === "booked") return "background:#fef9c3;color:#a16207;";
    if (normalized === "maintenance") return "background:#fee2e2;color:#b91c1c;";
    return "background:#f3f4f6;color:#4b5563;";
}

function renderStatusPill(status) {
    return `<span style="${statusStyle(status)}display:inline-flex;align-items:center;height:24px;padding:0 10px;border-radius:6px;font-size:12px;font-weight:700;">${escapeHtml(roomStatusLabel(status))}</span>`;
}

function renderRecentBookings(bookings) {
    const tbody = document.getElementById("staff-recent-bookings");
    if (!tbody) return;

    if (!bookings?.length) {
        tbody.innerHTML = `<tr><td colspan="5" style="padding:14px 12px;font-size:13px;color:#8892a4;">Chưa có đặt phòng</td></tr>`;
        return;
    }

    tbody.innerHTML = bookings.map(booking => {
        const dates = booking.checkInDate && booking.checkOutDate
            ? `${booking.checkInDate} - ${booking.checkOutDate}`
            : "-";
        return `
            <tr style="border-bottom:1px solid #f8f6f2;">
                <td style="padding:12px;font-size:13px;font-weight:700;color:#1a1a2e;">${escapeHtml(booking.id)}</td>
                <td style="padding:12px;font-size:13px;color:#4b5563;">${escapeHtml(booking.guestName || "Khách")}</td>
                <td style="padding:12px;font-size:13px;color:#4b5563;">${escapeHtml(dates)}</td>
                <td style="padding:12px;font-size:13px;font-weight:700;color:#1a1a2e;">${formatMoney(booking.totalPrice)}</td>
                <td style="padding:12px;"><span style="display:inline-flex;align-items:center;height:24px;padding:0 10px;border-radius:6px;background:#f3f4f6;color:#4b5563;font-size:12px;font-weight:700;">${escapeHtml(bookingStatusLabel(booking.bookingStatus))}</span></td>
            </tr>
        `;
    }).join("");
}

function renderRoomBars(dashboard) {
    const container = document.getElementById("staff-room-status-bars");
    if (!container) return;

    const total = Number(dashboard.totalRooms || 0);
    const groups = [
        ["Available", Number(dashboard.availableRooms || 0), "#22c55e"],
        ["Booked", Number(dashboard.bookedRooms || 0), "#c9a84c"],
        ["Maintenance", Number(dashboard.maintenanceRooms || 0), "#ef4444"],
    ];

    setText("staff-room-status-summary", `${total} phòng trong khách sạn được phân công`);

    if (!total) {
        container.innerHTML = `<div style="font-size:13px;color:#8892a4;">Chưa có phòng</div>`;
        return;
    }

    container.innerHTML = groups.map(([label, count, color]) => {
        const percent = Math.round((count / total) * 100);
        return `
            <div>
                <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:13px;color:#4b5563;">
                    <span>${roomStatusLabel(label)}</span>
                    <strong style="color:#1a1a2e;">${count}</strong>
                </div>
                <div style="height:8px;background:#f0ece4;border-radius:999px;overflow:hidden;">
                    <div style="height:100%;width:${percent}%;background:${color};border-radius:999px;"></div>
                </div>
            </div>
        `;
    }).join("");
}

async function initStaffDashboard() {
    try {
        const dashboard = await getStaffDashboard();
        setText("staff-stat-hotel", dashboard?.hotel?.address || `Chi nhánh #${dashboard?.hotelBranchId || "-"}`);
        setText("staff-stat-rooms", String(dashboard?.totalRooms || 0));
        setText("staff-stat-available", String(dashboard?.availableRooms || 0));
        setText("staff-stat-checkins", String(dashboard?.todayCheckIns || 0));
        renderRoomBars(dashboard || {});
        renderRecentBookings(dashboard?.recentBookings || []);
        wireDashboardActions();
    } catch (err) {
        console.error("Không thể tải dashboard nhân viên", err);
        setText("staff-stat-hotel", "Lỗi");
        setText("staff-stat-rooms", "Lỗi");
        setText("staff-stat-available", "Lỗi");
        setText("staff-stat-checkins", "Lỗi");
        renderRecentBookings([]);
        setText("staff-room-status-summary", err?.data?.message || "Không thể tải không gian làm việc của nhân viên");
    }
}

function wireDashboardActions() {
    document.querySelector(".staff-dashboard-action-hotel")?.addEventListener("click", () => {
        document.querySelector(".staff__btn-hotel")?.click();
    });
    document.querySelector(".staff-dashboard-action-bookings")?.addEventListener("click", () => {
        document.querySelector(".staff__btn-bookings")?.click();
    });
    document.querySelector(".staff-dashboard-action-settings")?.addEventListener("click", () => {
        document.querySelector(".staff__btn-settings")?.click();
    });
}

function staffHotelTemplate() {
    return `
        <div>
            <div id="staff-hotel-message" style="display:none;margin-bottom:14px;padding:12px 14px;border-radius:8px;font-size:13px;font-weight:600;"></div>
            <section id="staff-hotel-overview" style="background:white;border:1px solid #e8e4dc;border-radius:8px;padding:22px;margin-bottom:20px;">
                <div style="font-size:13px;color:#8892a4;">Đang tải khách sạn được phân công...</div>
            </section>
            <section style="background:white;border:1px solid #e8e4dc;border-radius:8px;overflow:hidden;">
                <div style="padding:18px 20px;border-bottom:1px solid #f0ece4;display:flex;justify-content:space-between;align-items:center;gap:12px;">
                    <div>
                        <h2 style="margin:0;font-size:18px;font-weight:700;">Danh sách phòng</h2>
                        <p style="margin:4px 0 0;font-size:13px;color:#6b7280;">Nhân viên chỉ được cập nhật trạng thái phòng.</p>
                    </div>
                </div>
                <div style="overflow:auto;">
                    <table style="width:100%;border-collapse:collapse;min-width:820px;">
                        <thead>
                            <tr style="background:#fafaf8;border-bottom:1px solid #e8e4dc;">
                                <th style="padding:13px 16px;text-align:left;font-size:12px;text-transform:uppercase;color:#6b7280;">Phòng</th>
                                <th style="padding:13px 16px;text-align:left;font-size:12px;text-transform:uppercase;color:#6b7280;">Loại</th>
                                <th style="padding:13px 16px;text-align:left;font-size:12px;text-transform:uppercase;color:#6b7280;">Tầng</th>
                                <th style="padding:13px 16px;text-align:left;font-size:12px;text-transform:uppercase;color:#6b7280;">Giường</th>
                                <th style="padding:13px 16px;text-align:left;font-size:12px;text-transform:uppercase;color:#6b7280;">Giá</th>
                                <th style="padding:13px 16px;text-align:left;font-size:12px;text-transform:uppercase;color:#6b7280;">Trạng thái</th>
                                <th style="padding:13px 16px;text-align:left;font-size:12px;text-transform:uppercase;color:#6b7280;">Cập nhật</th>
                            </tr>
                        </thead>
                        <tbody id="staff-rooms-tbody">
                            <tr><td colspan="7" style="padding:24px;text-align:center;color:#8892a4;">Đang tải phòng...</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `;
}

function showStaffHotelMessage(message, type = "success") {
    const el = document.getElementById("staff-hotel-message");
    if (!el) return;
    el.style.display = "block";
    el.style.background = type === "error" ? "#fee2e2" : "#dcfce7";
    el.style.color = type === "error" ? "#b91c1c" : "#166534";
    el.textContent = message;
}

function renderHotelOverview(hotel) {
    const container = document.getElementById("staff-hotel-overview");
    if (!container) return;

    const services = hotel?.services?.length
        ? hotel.services.map(service => `<span style="display:inline-flex;height:26px;align-items:center;padding:0 10px;border-radius:6px;background:#fafaf8;border:1px solid #e8e4dc;font-size:12px;color:#4b5563;">${escapeHtml(service)}</span>`).join("")
        : `<span style="font-size:13px;color:#8892a4;">Chưa có dịch vụ</span>`;

    container.innerHTML = `
        <div style="display:flex;justify-content:space-between;gap:18px;align-items:flex-start;flex-wrap:wrap;">
            <div>
                <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;">${escapeHtml(hotel?.address || "Khách sạn được phân công")}</h2>
                <div style="display:flex;gap:18px;flex-wrap:wrap;font-size:13px;color:#4b5563;">
                    <span><strong style="color:#1a1a2e;">Khu vực:</strong> ${escapeHtml(hotel?.locationName || "-")}</span>
                    <span><strong style="color:#1a1a2e;">Số điện thoại:</strong> ${escapeHtml(hotel?.phoneNumber || "-")}</span>
                    <span><strong style="color:#1a1a2e;">Đánh giá:</strong> ${Number(hotel?.averageStar || 0).toFixed(1)}</span>
                    <span><strong style="color:#1a1a2e;">Số phòng:</strong> ${Number(hotel?.roomCount || 0)}</span>
                </div>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;max-width:420px;justify-content:flex-end;">${services}</div>
        </div>
    `;
}

function renderRooms(rooms) {
    const tbody = document.getElementById("staff-rooms-tbody");
    if (!tbody) return;

    if (!rooms?.length) {
        tbody.innerHTML = `<tr><td colspan="7" style="padding:24px;text-align:center;color:#8892a4;">Chưa có phòng</td></tr>`;
        return;
    }

    tbody.innerHTML = rooms.map(room => `
        <tr style="border-bottom:1px solid #f8f6f2;">
            <td style="padding:13px 16px;font-size:13px;font-weight:700;color:#1a1a2e;">${escapeHtml(room.roomNumber)}</td>
            <td style="padding:13px 16px;font-size:13px;color:#4b5563;">${escapeHtml(roomTypeLabel(room.typeCode))}</td>
            <td style="padding:13px 16px;font-size:13px;color:#4b5563;">${escapeHtml(room.floor)}</td>
            <td style="padding:13px 16px;font-size:13px;color:#4b5563;">${escapeHtml(room.numberOfBed)}</td>
            <td style="padding:13px 16px;font-size:13px;font-weight:700;color:#1a1a2e;">${formatMoney(room.price)}</td>
            <td class="staff-room-status-cell" data-room-id="${room.id}" style="padding:13px 16px;">${renderStatusPill(room.roomStatus)}</td>
            <td style="padding:13px 16px;">
                <select class="staff-room-status-select" data-room-id="${room.id}" style="height:34px;min-width:142px;border:1px solid #e2e2da;border-radius:7px;background:#fafaf8;color:#1a1a2e;padding:0 10px;font-family:inherit;font-size:13px;outline:none;">
                    ${ROOM_STATUSES.map(status => `<option value="${status}" ${status === room.roomStatus ? "selected" : ""}>${roomStatusLabel(status)}</option>`).join("")}
                </select>
            </td>
        </tr>
    `).join("");

    tbody.querySelectorAll(".staff-room-status-select").forEach(select => {
        select.addEventListener("change", async () => {
            const roomId = select.dataset.roomId;
            const roomStatus = select.value;
            select.disabled = true;
            try {
                const updated = await updateStaffRoomStatus(roomId, roomStatus);
                const statusCell = document.querySelector(`.staff-room-status-cell[data-room-id="${roomId}"]`);
                if (statusCell) statusCell.innerHTML = renderStatusPill(updated.roomStatus);
                showStaffHotelMessage(`Phòng ${updated.roomNumber} đã được cập nhật sang ${roomStatusLabel(updated.roomStatus)}.`);
            } catch (err) {
                console.error("Không thể cập nhật trạng thái phòng", err);
                showStaffHotelMessage(err?.data?.message || "Không thể cập nhật trạng thái phòng.", "error");
            } finally {
                select.disabled = false;
            }
        });
    });
}

async function initStaffHotel() {
    try {
        const [hotel, rooms] = await Promise.all([getStaffHotel(), getStaffRooms()]);
        renderHotelOverview(hotel);
        renderRooms(rooms);
    } catch (err) {
        console.error("Không thể tải khách sạn được phân công", err);
        renderHotelOverview({});
        const tbody = document.getElementById("staff-rooms-tbody");
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="7" style="padding:24px;text-align:center;color:#b91c1c;">${escapeHtml(err?.data?.message || "Không thể tải khách sạn của nhân viên.")}</td></tr>`;
        }
    }
}

function staffReviewsTemplate() {
    return `
        <div>
            <section id="staff-reviews-summary" style="background:white;border:1px solid #e8e4dc;border-radius:8px;padding:22px;margin-bottom:20px;">
                <div style="font-size:13px;color:#8892a4;">Đang tải đánh giá khách sạn...</div>
            </section>

            <section style="background:white;border:1px solid #e8e4dc;border-radius:8px;overflow:hidden;">
                <div style="padding:18px 20px;border-bottom:1px solid #f0ece4;display:flex;justify-content:space-between;align-items:center;gap:12px;">
                    <div>
                        <h2 style="margin:0;font-size:18px;font-weight:700;">Danh sách đánh giá</h2>
                        <p style="margin:4px 0 0;font-size:13px;color:#6b7280;">Tất cả đánh giá thuộc khách sạn đang được phân công.</p>
                    </div>
                </div>
                <div style="overflow:auto;">
                    <table style="width:100%;border-collapse:collapse;min-width:820px;">
                        <thead>
                            <tr style="background:#fafaf8;border-bottom:1px solid #e8e4dc;">
                                <th style="padding:13px 16px;text-align:left;font-size:12px;text-transform:uppercase;color:#6b7280;">Khách</th>
                                <th style="padding:13px 16px;text-align:left;font-size:12px;text-transform:uppercase;color:#6b7280;">Điểm</th>
                                <th style="padding:13px 16px;text-align:left;font-size:12px;text-transform:uppercase;color:#6b7280;">Bình luận</th>
                                <th style="padding:13px 16px;text-align:left;font-size:12px;text-transform:uppercase;color:#6b7280;">Ngày đánh giá</th>
                            </tr>
                        </thead>
                        <tbody id="staff-reviews-tbody">
                            <tr><td colspan="4" style="padding:24px;text-align:center;color:#8892a4;">Đang tải đánh giá...</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `;
}

function renderReviewStat(label, value, sub) {
    return `
        <div style="background:#fafaf8;border:1px solid #f0ece4;border-radius:8px;padding:14px;min-width:0;">
            <div style="font-size:12px;color:#6b7280;margin-bottom:7px;">${label}</div>
            <div style="font-size:24px;font-weight:700;line-height:1;color:#1a1a2e;">${value}</div>
            <div style="font-size:11px;color:#c9a84c;margin-top:7px;">${sub}</div>
        </div>
    `;
}

function renderStaffReviewsSummary(hotel, reviewData) {
    const container = document.getElementById("staff-reviews-summary");
    if (!container) return;

    const reviews = getReviewsFromResponse(reviewData);
    const average = getAverageRating(reviewData, reviews);

    container.innerHTML = `
        <div style="display:flex;justify-content:space-between;gap:18px;align-items:stretch;flex-wrap:wrap;">
            <div style="flex:1;min-width:260px;">
                <div style="font-size:13px;color:#8892a4;margin-bottom:6px;">Khách sạn đang quản lý</div>
                <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1a1a2e;">${escapeHtml(hotel?.address || "Khách sạn được phân công")}</h2>
                <div style="display:flex;gap:18px;flex-wrap:wrap;font-size:13px;color:#4b5563;">
                    <span><strong style="color:#1a1a2e;">Khu vực:</strong> ${escapeHtml(hotel?.locationName || "-")}</span>
                    <span><strong style="color:#1a1a2e;">Số điện thoại:</strong> ${escapeHtml(hotel?.phoneNumber || "-")}</span>
                    <span><strong style="color:#1a1a2e;">Số phòng:</strong> ${Number(hotel?.roomCount || 0)}</span>
                </div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(2,minmax(130px,1fr));gap:12px;min-width:300px;">
                ${renderReviewStat("Tổng đánh giá", reviews.length, "Từ khách đã lưu trú")}
                ${renderReviewStat("Điểm trung bình", average.toFixed(1), "Thang điểm 5")}
            </div>
        </div>
    `;
}

function renderStaffReviews(reviewData) {
    const tbody = document.getElementById("staff-reviews-tbody");
    if (!tbody) return;

    const reviews = getReviewsFromResponse(reviewData)
        .slice()
        .sort((a, b) => reviewDateTime(b.createdAt) - reviewDateTime(a.createdAt));

    if (!reviews.length) {
        tbody.innerHTML = `<tr><td colspan="4" style="padding:24px;text-align:center;color:#8892a4;">Chưa có đánh giá nào cho khách sạn này</td></tr>`;
        return;
    }

    tbody.innerHTML = reviews.map(review => {
        const rating = Math.max(0, Math.min(5, Number(review.rating || 0)));
        return `
            <tr style="border-bottom:1px solid #f8f6f2;">
                <td style="padding:13px 16px;font-size:13px;font-weight:700;color:#1a1a2e;">${escapeHtml(review.userName || "Khách hàng")}</td>
                <td style="padding:13px 16px;font-size:13px;color:#4b5563;">
                    <div style="display:flex;align-items:center;gap:8px;">
                        ${renderStars(rating)}
                        <strong style="color:#1a1a2e;">${rating.toFixed(1)}</strong>
                    </div>
                </td>
                <td style="padding:13px 16px;font-size:13px;color:#4b5563;line-height:1.45;max-width:520px;">${escapeHtml(review.comment || "-")}</td>
                <td style="padding:13px 16px;font-size:13px;color:#4b5563;white-space:nowrap;">${escapeHtml(formatReviewDate(review.createdAt))}</td>
            </tr>
        `;
    }).join("");
}

async function initStaffReviews() {
    const summary = document.getElementById("staff-reviews-summary");
    const tbody = document.getElementById("staff-reviews-tbody");

    try {
        const hotel = await getStaffHotel();
        const hotelId = hotel?.id || hotel?.hotelBranchId;
        if (!hotelId) throw new Error("Không tìm thấy khách sạn được phân công.");

        const reviewData = await getReviewsHotel(hotelId);
        renderStaffReviewsSummary(hotel, reviewData);
        renderStaffReviews(reviewData);
    } catch (err) {
        console.error("Không thể tải đánh giá khách sạn của nhân viên", err);
        if (summary) {
            summary.innerHTML = `<div style="font-size:13px;color:#b91c1c;font-weight:600;">${escapeHtml(err?.data?.message || err?.message || "Không thể tải đánh giá khách sạn.")}</div>`;
        }
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="4" style="padding:24px;text-align:center;color:#b91c1c;">Không thể tải danh sách đánh giá.</td></tr>`;
        }
    }
}

function initStaffBookings() {
    initBookingsManagement({
        getBookings: getStaffBookings,
        searchBookings: searchStaffBookings,
    });
}

export function initHomeStaff() {
    const routes = {
        "staff__btn-dashboard": {
            title: "Tổng Quan",
            html: renderStaffDashboardContent,
            initFn: initStaffDashboard,
        },
        "staff__btn-hotel": {
            title: "Quản Lý Khách Sạn",
            html: staffHotelTemplate,
            initFn: initStaffHotel,
        },
        "staff__btn-bookings": {
            title: "Quản Lý Đặt Phòng",
            html: bookingsManagementTemplate,
            initFn: initStaffBookings,
        },
        "staff__btn-reviews": {
            title: "Quản Lý Đánh Giá",
            html: staffReviewsTemplate,
            initFn: initStaffReviews,
        },
        "staff__btn-settings": {
            title: "Thông Tin Cá Nhân",
            html: profileTemplate,
            initFn: initSetting,
        },
    };

    document.querySelectorAll(".sidebar-item").forEach(item => {
        item.addEventListener("click", () => {
            setActiveSidebarItem(item);
            const matchedKey = Object.keys(routes).find(cls => item.classList.contains(cls));
            if (!matchedKey) return;
            const route = routes[matchedKey];
            setStaffContent(route.title, route.html(), route.initFn);
        });
    });

    initStaffDashboard();
}
