export function homeStaffTemplate() {
    return `
        <div class="management-shell" style="display:flex;height:calc(100vh - var(--header-height) - 20px);min-height:560px;overflow:hidden;background-color:#f0f0eb;font-family:'Roboto',Arial,sans-serif;color:#1a1a2e;">
            <aside class="management-sidebar" style="position:sticky;top:calc(var(--header-height) + 20px);width:210px;height:100%;background-color:#1a1a2e;color:white;display:flex;flex-direction:column;padding:0;flex-shrink:0;box-shadow:2px 0 12px rgba(0,0,0,0.3);overflow-y:auto;">
                <div style="padding:20px 20px 18px;border-bottom:1px solid rgba(255,255,255,0.07);">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <div style="width:32px;height:32px;background:linear-gradient(135deg,#c9a84c,#e8cc7a);border-radius:6px;display:flex;align-items:center;justify-content:center;color:#1a1a2e;">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 16V8l7-5 7 5v8H2z" stroke="#1a1a2e" stroke-width="1.5" stroke-linejoin="round"/><rect x="7" y="10" width="4" height="6" rx="0.5" stroke="#1a1a2e" stroke-width="1.3"/></svg>
                        </div>
                        <div>
                            <div style="font-size:13px;font-weight:600;color:#f0e6c8;letter-spacing:0.3px;">PTBL</div>
                            <div style="font-size:10px;color:#8892a4;letter-spacing:0.5px;text-transform:uppercase;">Booking Hotel</div>
                        </div>
                    </div>
                </div>
                <nav style="flex:1;padding:10px 0;">
                    ${renderStaffSidebarItem("Tổng Quan", "staff__btn-dashboard", true)}
                    ${renderStaffSidebarItem("Quản Lý Khách Sạn", "staff__btn-hotel")}
                    ${renderStaffSidebarItem("Quản Lý Đặt Phòng", "staff__btn-bookings")}
                    ${renderStaffSidebarItem("Quản Lý Đánh Giá", "staff__btn-reviews")}
                </nav>
            </aside>

            <section style="flex:1;display:flex;flex-direction:column;min-width:0;height:100%;overflow:hidden;background:#f4f4f0;">
                <div style="display:flex;align-items:center;flex-shrink:0;padding:16px 28px;background:white;border-bottom:1px solid #e8e4dc;box-shadow:0 1px 3px rgba(0,0,0,0.04);">
                    <h1 id="staff-topbar-title" style="margin:0;font-size:22px;font-weight:600;color:#1a1a2e;">Tổng Quan</h1>
                </div>
                <div id="staff-content" style="flex:1;min-height:0;padding:28px;overflow:auto;">
                    ${renderStaffDashboardContent()}
                </div>
            </section>
        </div>
    `;
}

export function renderStaffDashboardContent() {
    return `
        <div style="display:grid;grid-template-columns:repeat(4,minmax(160px,1fr));gap:16px;margin-bottom:22px;">
            ${renderStatCard("Khách sạn", "Đang tải...", "Chi nhánh đang phụ trách", "staff-stat-hotel")}
            ${renderStatCard("Tổng phòng", "Đang tải...", "Phòng trong cơ sở dữ liệu", "staff-stat-rooms")}
            ${renderStatCard("Phòng trống", "Đang tải...", "Có thể đón khách", "staff-stat-available")}
            ${renderStatCard("Check-in hôm nay", "Đang tải...", "Lượt đến trong ngày", "staff-stat-checkins")}
        </div>

        <div style="display:grid;grid-template-columns:1fr 320px;gap:20px;margin-bottom:20px;">
            <section style="background:white;border:1px solid #e8e4dc;border-radius:8px;padding:22px;min-width:0;">
                <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:16px;">
                    <div>
                        <h2 style="margin:0;font-size:18px;font-weight:700;">Tình trạng phòng</h2>
                        <p id="staff-room-status-summary" style="margin:4px 0 0;font-size:13px;color:#6b7280;">Đang tải tình trạng phòng...</p>
                    </div>
                    <button class="staff-dashboard-action staff-dashboard-action-hotel" type="button" style="height:36px;padding:0 14px;border:0;border-radius:7px;background:linear-gradient(135deg,#c9a84c,#e8cc7a);color:#1a1a2e;font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;">
                        Phòng
                    </button>
                </div>
                <div id="staff-room-status-bars" style="display:flex;flex-direction:column;gap:10px;">
                    <div style="font-size:13px;color:#8892a4;">Đang tải phòng...</div>
                </div>
            </section>

            <section style="background:white;border:1px solid #e8e4dc;border-radius:8px;padding:22px;">
                <h2 style="margin:0 0 14px;font-size:18px;font-weight:700;">Thao tác nhanh</h2>
                <button class="staff-dashboard-action staff-dashboard-action-bookings" type="button" style="width:100%;height:38px;margin-bottom:10px;border:0;border-radius:7px;background:#1a1a2e;color:#f0e6c8;font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;">
                    Xem đặt phòng
                </button>
                <button class="staff-dashboard-action staff-dashboard-action-reviews" type="button" style="width:100%;height:38px;border:1px solid #e8e4dc;border-radius:7px;background:#fafaf8;color:#1a1a2e;font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;">
                    Xem đánh giá
                </button>
            </section>
        </div>

        <section style="background:white;border:1px solid #e8e4dc;border-radius:8px;padding:22px;">
            <h2 style="margin:0 0 16px;font-size:18px;font-weight:700;">Đặt phòng gần đây</h2>
            <div style="overflow:auto;">
                <table style="width:100%;border-collapse:collapse;min-width:760px;">
                    <thead>
                        <tr style="border-bottom:1px solid #f0ece4;">
                            <th style="padding:10px 12px;text-align:left;font-size:11px;color:#8892a4;text-transform:uppercase;font-weight:600;">Mã đặt phòng</th>
                            <th style="padding:10px 12px;text-align:left;font-size:11px;color:#8892a4;text-transform:uppercase;font-weight:600;">Khách</th>
                            <th style="padding:10px 12px;text-align:left;font-size:11px;color:#8892a4;text-transform:uppercase;font-weight:600;">Ngày</th>
                            <th style="padding:10px 12px;text-align:left;font-size:11px;color:#8892a4;text-transform:uppercase;font-weight:600;">Tổng tiền</th>
                            <th style="padding:10px 12px;text-align:left;font-size:11px;color:#8892a4;text-transform:uppercase;font-weight:600;">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody id="staff-recent-bookings">
                        <tr><td colspan="5" style="padding:14px 12px;font-size:13px;color:#8892a4;">Đang tải đặt phòng...</td></tr>
                    </tbody>
                </table>
            </div>
        </section>
    `;
}

function renderStatCard(title, value, sub, id) {
    const valueStyle = id === "staff-stat-hotel"
        ? "font-size:21px;font-weight:700;line-height:1.25;color:#1a1a2e;min-height:52px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;word-break:break-word;"
        : "font-size:25px;font-weight:700;line-height:1;color:#1a1a2e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;";

    return `
        <section style="background:white;border:1px solid #e8e4dc;border-radius:8px;padding:18px;min-width:0;">
            <div style="font-size:12px;color:#6b7280;margin-bottom:8px;">${title}</div>
            <div id="${id}" style="${valueStyle}">${value}</div>
            <div style="font-size:11px;color:#c9a84c;margin-top:7px;">${sub}</div>
        </section>
    `;
}

const STAFF_SIDEBAR_ICONS = {
    "Tổng Quan": `<svg class="sidebar-icon" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor"/><rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor"/><rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor"/><rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor"/></svg>`,
    "Quản Lý Khách Sạn": `<svg class="sidebar-icon" viewBox="0 0 16 16" fill="none"><path d="M1 14V7l7-5 7 5v7H1z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><rect x="6" y="9" width="4" height="5" rx="0.5" stroke="currentColor" stroke-width="1.3"/></svg>`,
    "Quản Lý Đặt Phòng": `<svg class="sidebar-icon" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M5 3V1.5M11 3V1.5M2 7h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M5 10h2m2 0h2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
    "Quản Lý Đánh Giá": `<svg class="sidebar-icon" viewBox="0 0 16 16" fill="none"><path d="M8 1.7l1.7 3.5 3.8.5-2.8 2.7.7 3.8L8 10.4l-3.4 1.8.7-3.8-2.8-2.7 3.8-.5L8 1.7z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>`,
};

function renderStaffSidebarItem(text, className, active = false) {
    return `
        <div class="sidebar-item ${active ? "active" : ""} ${className}" style="color:#94a3b8;">
            ${STAFF_SIDEBAR_ICONS[text]}
            <span>${text}</span>
        </div>
    `;
}
