export function homeManagerTemplate() {
    return `
        <div style="display: flex; min-height: 100vh; background-color: #f0f0eb; font-family: 'Inter', sans-serif;">
            
            <!-- SIDEBAR -->
            <div style="width: 210px; background-color: #1a1a2e; color: white; display: flex; flex-direction: column; padding: 0; flex-shrink: 0; box-shadow: 2px 0 12px rgba(0,0,0,0.3);">
                <!-- Logo -->
                <div style="padding: 20px 20px 18px; border-bottom: 1px solid rgba(255,255,255,0.07);">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #c9a84c, #e8cc7a); border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 16V8l7-5 7 5v8H2z" stroke="#1a1a2e" stroke-width="1.5" stroke-linejoin="round"/><rect x="7" y="10" width="4" height="6" rx="0.5" stroke="#1a1a2e" stroke-width="1.3"/></svg>
                        </div>
                        <div>
                            <div style="font-size: 13px; font-weight: 600; color: #f0e6c8; letter-spacing: 0.3px;">PTBL</div>
                            <div style="font-size: 10px; color: #8892a4; letter-spacing: 0.5px; text-transform: uppercase;">Booking Hotel</div>
                        </div>
                    </div>
                </div>
                
                <nav style="flex: 1; padding: 10px 0;">
                    ${renderSidebarItem("Tổng Quan", "active", "manager__btn-dashboard")}
                    ${renderSidebarItem("Quản Lý Người Dùng", "", "manager__btn-users")}
                    ${renderSidebarItem("Quản Lý Khách Sạn", "", "manager__btn-properties")}
                    ${renderSidebarItem("Quản Lý Đặt Phòng", "", "manager__btn-bookings")}
                    ${renderSidebarItem("Quản Lý Tài Chính", "", "manager__btn-finance")}
                    ${renderSidebarItem("Cài Đặt", "", "manager__btn-settings")}
                </nav>

            </div>

            <!-- MAIN CONTENT -->
            <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden; background: #f4f4f0;">
                
                <!-- Top Bar -->
                <div style="display: flex; align-items: center; padding: 16px 28px; background: white; border-bottom: 1px solid #e8e4dc; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
                    <div style="font-size: 22px; font-weight: 600; color: #1a1a2e;">
                        <span id="manager-topbar-title">Tổng Quan</span>
                    </div>
                </div>

                <!-- Dynamic Content Area -->
                <div id="manager-content" style="flex: 1; padding: 28px; overflow-y: auto;">

                    ${renderDashboardContent()}

                </div>
            </div>
        </div>
    `;
}

function renderDashboardContent() {
    return `
        
        <!-- Stats Grid -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
            ${renderStatCard("Total Revenue", "Loading...", "From paid receipts", "revenue", "manager-stat-revenue", "manager-stat-revenue-sub")}
            ${renderStatCard("Active Bookings", "Loading...", "Current open stays", "bookings", "manager-stat-active-bookings", "manager-stat-active-bookings-sub")}
            ${renderStatCard("Occupancy Rate", "Loading...", "Booked rooms over total rooms", "occupancy", "manager-stat-occupancy", "manager-stat-occupancy-sub")}
            ${renderStatCard("Total Users", "Loading...", "Accounts in database", "users", "manager-stat-users", "manager-stat-users-sub")}
        </div>

        <!-- Chart + Right Panel -->
        <div style="display: grid; grid-template-columns: 1fr 280px; gap: 20px; margin-bottom: 20px;">
            <!-- Revenue vs Bookings Chart -->
            <div style="background: white; border-radius: 12px; padding: 24px; border: 1px solid #e8e4dc;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1a1a2e;">Monthly Revenue</h3>
                    <div style="display: flex; gap: 16px; font-size: 12px; color: #8892a4;">
                        <span style="display: flex; align-items: center; gap: 5px;"><span style="width: 20px; height: 2px; background: #c9a84c; display: inline-block; border-radius: 1px;"></span>Revenue</span>
                    </div>
                </div>
                <canvas id="manager-revenue-chart" style="width: 100%; height: 220px;"></canvas>
            </div>

            <!-- Quick Actions + Top Hotels -->
            <div style="display: flex; flex-direction: column; gap: 16px;">
                <div style="background: white; border-radius: 12px; padding: 20px; border: 1px solid #e8e4dc;">
                    <h4 style="margin: 0 0 14px; font-size: 14px; font-weight: 600; color: #1a1a2e;">Quick Actions</h4>
                    <button class="manager-dashboard-action manager-dashboard-action-hotels" style="width: 100%; padding: 10px; background: linear-gradient(135deg, #c9a84c, #e8cc7a); color: #1a1a2e; border: none; border-radius: 7px; font-size: 13px; font-weight: 600; cursor: pointer; margin-bottom: 8px; transition: opacity 0.2s;" onmouseenter="this.style.opacity='0.85'" onmouseleave="this.style.opacity='1'">Add Hotel</button>
                    <button class="manager-dashboard-action manager-dashboard-action-finance" style="width: 100%; padding: 10px; background: linear-gradient(135deg, #c9a84c, #e8cc7a); color: #1a1a2e; border: none; border-radius: 7px; font-size: 13px; font-weight: 600; cursor: pointer; transition: opacity 0.2s;" onmouseenter="this.style.opacity='0.85'" onmouseleave="this.style.opacity='1'">View Finance</button>
                </div>
                <div style="background: white; border-radius: 12px; padding: 20px; border: 1px solid #e8e4dc; flex: 1; overflow: hidden;">
                    <h4 style="margin: 0 0 14px; font-size: 14px; font-weight: 600; color: #1a1a2e;">Top Performing Hotels</h4>
                    <div id="manager-top-hotels">
                        <div style="font-size: 13px; color: #8892a4;">Loading hotels...</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recent Bookings Table -->
        <div style="background: white; border-radius: 12px; padding: 24px; border: 1px solid #e8e4dc;">
            <h3 style="margin: 0 0 18px; font-size: 16px; font-weight: 600; color: #1a1a2e;">Recent Bookings</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="border-bottom: 1px solid #f0ece4;">
                        <th style="padding: 10px 12px; text-align: left; font-size: 11px; color: #8892a4; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500;">Guest Name</th>
                        <th style="padding: 10px 12px; text-align: left; font-size: 11px; color: #8892a4; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500;">Hotel</th>
                        <th style="padding: 10px 12px; text-align: left; font-size: 11px; color: #8892a4; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500;">Dates</th>
                        <th style="padding: 10px 12px; text-align: left; font-size: 11px; color: #8892a4; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500;">Amount</th>
                        <th style="padding: 10px 12px; text-align: left; font-size: 11px; color: #8892a4; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500;">Status</th>
                    </tr>
                </thead>
                <tbody id="manager-recent-bookings">
                    <tr>
                        <td colspan="5" style="padding: 14px 12px; font-size: 13px; color: #8892a4;">Loading bookings...</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

function renderTopHotel(name, amount, metrics, img) {
    return `
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
            <img src="${img}" alt="${name}" style="width: 52px; height: 40px; object-fit: cover; border-radius: 5px; flex-shrink: 0;" onerror="this.style.background='#e8e4dc'; this.style.border='1px solid #ddd'"/>
            <div style="flex: 1; min-width: 0;">
                <div style="font-size: 12px; font-weight: 500; color: #1a1a2e; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${name}</div>
                <div style="display: flex; gap: 12px; margin-top: 3px;">
                    <div><div style="font-size: 10px; color: #8892a4;">Amount</div><div style="font-size: 11px; font-weight: 600; color: #1a1a2e;">${amount}</div></div>
                    <div><div style="font-size: 10px; color: #8892a4;">Metrics</div><div style="font-size: 11px; font-weight: 600; color: #c9a84c;">${metrics}</div></div>
                </div>
            </div>
        </div>
    `;
}

function renderBookingRow(guest, hotel, dates, amount, status, statusBg, statusColor) {
    return `
        <tr style="border-bottom: 1px solid #f8f6f2;">
            <td style="padding: 12px 12px; font-size: 13px; color: #1a1a2e;">${guest}</td>
            <td style="padding: 12px 12px; font-size: 13px; color: #4b5563;">${hotel}</td>
            <td style="padding: 12px 12px; font-size: 13px; color: #4b5563;">${dates}</td>
            <td style="padding: 12px 12px; font-size: 13px; color: #1a1a2e; font-weight: 500;">${amount}</td>
            <td style="padding: 12px 12px;">
                <span style="background: ${statusBg}; color: ${statusColor}; padding: 3px 10px; border-radius: 5px; font-size: 12px; font-weight: 500;">${status}</span>
            </td>
        </tr>
    `;
}

function renderStatCard(title, value, sub, type, valueId = "", subId = "") {
    const sparkColors = { revenue: "#c9a84c", bookings: "#c9a84c", occupancy: "#c9a84c", users: "#c9a84c" };
    const color = sparkColors[type] || "#c9a84c";
    // Mini sparkline SVG
    const sparklines = {
        revenue:   "M0,18 L10,14 L20,15 L30,10 L40,12 L50,8 L60,5",
        bookings:  "M0,18 L10,15 L20,16 L30,11 L40,13 L50,9 L60,6",
        occupancy: "M0,18 L10,16 L20,14 L30,12 L40,11 L50,9 L60,7",
        users:     "M0,18 L10,16 L20,15 L30,13 L40,11 L50,10 L60,8"
    };
    return `
        <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e8e4dc; position: relative; overflow: hidden;">
            <div style="font-size: 12px; color: #8892a4; margin-bottom: 8px; font-weight: 400;">${title}</div>
            <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                <div>
                    <div ${valueId ? `id="${valueId}"` : ""} style="font-size: 26px; font-weight: 700; color: #1a1a2e; line-height: 1;">${value}</div>
                    <div ${subId ? `id="${subId}"` : ""} style="font-size: 11px; color: ${color}; margin-top: 6px;">${sub}</div>
                </div>
                <svg viewBox="0 0 60 24" width="70" height="36" style="opacity: 0.8;">
                    <polyline points="${sparklines[type]}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
                </svg>
            </div>
        </div>
    `;
}

// ── Sidebar ──────────────────────────────────────────────────────────────────

const SIDEBAR_ICONS = {
    "Tổng Quan":     `<svg class="sidebar-icon" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor"/><rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor"/><rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor"/><rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor"/></svg>`,
    "Quản Lý Người Dùng":     `<svg class="sidebar-icon" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="5" r="2.5" stroke="currentColor" stroke-width="1.5"/><path d="M1 13.5c0-2.5 2-4 5-4s5 1.5 5 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="5" r="2" stroke="currentColor" stroke-width="1.3"/><path d="M12 10c1.5 0 3 .8 3 3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
    "Quản Lý Khách Sạn":    `<svg class="sidebar-icon" viewBox="0 0 16 16" fill="none"><path d="M1 14V7l7-5 7 5v7H1z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><rect x="6" y="9" width="4" height="5" rx="0.5" stroke="currentColor" stroke-width="1.3"/></svg>`,
    "Quản Lý Đặt Phòng":  `<svg class="sidebar-icon" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M5 3V1.5M11 3V1.5M2 7h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M5 10h2m2 0h2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
    "Quản Lý Tài Chính":    `<svg class="sidebar-icon" viewBox="0 0 16 16" fill="none"><rect x="1" y="4" width="14" height="9" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M4 4V3a1 1 0 011-1h6a1 1 0 011 1v1" stroke="currentColor" stroke-width="1.3"/><circle cx="8" cy="8.5" r="1.5" stroke="currentColor" stroke-width="1.3"/></svg>`,
    "Cài Đặt":      `<svg class="sidebar-icon" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" stroke-width="1.5"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.2 3.2l1.4 1.4M11.4 11.4l1.4 1.4M3.2 12.8l1.4-1.4M11.4 4.6l1.4-1.4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
};

function renderSidebarItem(text, status = "", className = "") {
    const isActive = status === "active";
    const activeClass = isActive ? "active" : "";
    const icon = SIDEBAR_ICONS[text] || `<svg class="sidebar-icon" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/></svg>`;
    
    return `
        <div class="sidebar-item ${activeClass} ${className}" style="color: #94a3b8;">
            ${icon}
            <span>${text}</span>
        </div>
    `;
}
