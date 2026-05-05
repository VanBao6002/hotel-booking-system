export function bookingsManagementTemplate() {
    return `
        <div style="font-family: 'Inter', sans-serif; color: #1a1a2e;">

            <h2 style="margin: 0 0 24px; font-size: 22px; font-weight: 700; color: #1a1a2e;">Booking Management</h2>

            <!-- Filter Bar -->
            <div style="background: white; border: 1px solid #e8e4dc; border-radius: 10px; padding: 16px 20px; margin-bottom: 20px; display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
                <!-- Search by Booking ID -->
                <div style="flex: 1; min-width: 160px; display: flex; align-items: center; gap: 8px; border: 1px solid #e2e2da; border-radius: 7px; padding: 9px 14px; background: #fafaf8;">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style="flex-shrink:0;color:#9aa3b0">
                        <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" stroke-width="1.5"/>
                        <path d="M10 10l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    <input id="bm-search-id" type="text" placeholder="Search by Booking ID" style="border: none; background: transparent; outline: none; font-size: 13px; color: #1a1a2e; width: 100%;" />
                </div>

                <!-- Date Range -->
                <div style="flex: 1; min-width: 160px; display: flex; align-items: center; gap: 8px; border: 1px solid #e2e2da; border-radius: 7px; padding: 9px 14px; background: #fafaf8;">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style="flex-shrink:0;color:#9aa3b0">
                        <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
                        <path d="M5 3V1.5M11 3V1.5M2 7h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    <input id="bm-date-range" type="text" placeholder="Date Range (Start - End)" style="border: none; background: transparent; outline: none; font-size: 13px; color: #1a1a2e; width: 100%;" />
                </div>

                <!-- Hotel select -->
                <div style="flex: 1; min-width: 140px; position: relative;">
                    <select id="bm-hotel-select" style="width: 100%; appearance: none; border: 1px solid #e2e2da; border-radius: 7px; padding: 9px 36px 9px 14px; background: #fafaf8; font-size: 13px; color: #1a1a2e; outline: none; cursor: pointer;">
                        <option value="">Hotel</option>
                        <option value="oceanfront">The Oceanfront Villa</option>
                        <option value="presidential">The Presidential Suite</option>
                        <option value="sunset">The Sunset Elite</option>
                    </select>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);pointer-events:none;color:#9aa3b0">
                        <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>

                <!-- Guest Name -->
                <div style="flex: 1; min-width: 140px; display: flex; align-items: center; gap: 8px; border: 1px solid #e2e2da; border-radius: 7px; padding: 9px 14px; background: #fafaf8;">
                    <input id="bm-guest-name" type="text" placeholder="Guest Name" style="border: none; background: transparent; outline: none; font-size: 13px; color: #1a1a2e; width: 100%;" />
                </div>

                <!-- Filter Button -->
                <button id="bm-filter-btn" style="padding: 9px 22px; background: linear-gradient(135deg, #c9a84c, #e8cc7a); color: #1a1a2e; border: none; border-radius: 7px; font-size: 13px; font-weight: 600; cursor: pointer; flex-shrink: 0; transition: opacity 0.2s;" onmouseenter="this.style.opacity='0.85'" onmouseleave="this.style.opacity='1'">Filter</button>
            </div>

            <!-- Bookings Table -->
            <div style="background: white; border-radius: 10px; border: 1px solid #e8e4dc; overflow: hidden;">
                <table style="width: 100%; border-collapse: collapse;" id="bm-table">
                    <thead>
                        <tr style="background: #fafaf8; border-bottom: 2px solid #e8e4dc;">
                            <th style="padding: 13px 16px; text-align: left; font-size: 13px; color: #1a1a2e; font-weight: 600;">Booking ID</th>
                            <th style="padding: 13px 16px; text-align: left; font-size: 13px; color: #1a1a2e; font-weight: 600;">Guest</th>
                            <th style="padding: 13px 16px; text-align: left; font-size: 13px; color: #1a1a2e; font-weight: 600;">Hotel Name</th>
                            <th style="padding: 13px 16px; text-align: left; font-size: 13px; color: #1a1a2e; font-weight: 600;">Check-in / Check-out</th>
                            <th style="padding: 13px 16px; text-align: left; font-size: 13px; color: #1a1a2e; font-weight: 600;">Total Price</th>
                            <th style="padding: 13px 16px; text-align: left; font-size: 13px; color: #1a1a2e; font-weight: 600;">Payment Status</th>
                            <th style="padding: 13px 16px; text-align: left; font-size: 13px; color: #1a1a2e; font-weight: 600;">Booking Status</th>
                            <th style="padding: 13px 16px; text-align: left; font-size: 13px; color: #1a1a2e; font-weight: 600;">Action</th>
                        </tr>
                    </thead>
                    <tbody id="bm-tbody">
                        ${renderBookingRow("B-1001", "John Doe",    "The Oceanfront Villa",    "Oct 20 - Oct 25", "$10,500", "Paid",    "gold",     "Confirmed", "gold")}
                        ${renderBookingRow("B-1002", "Jane Smith",  "The Presidential Suite",  "Nov 1 - Nov 5",   "$25,000", "Partial", "charcoal", "Completed", "charcoal")}
                        ${renderBookingRow("B-1003", "John Doe",    "The Oceanfront Villa",    "Nov 1 - Oct 19",  "$10,500", "Paid",    "gold",     "Confirmed", "charcoal")}
                        ${renderBookingRow("B-1004", "Jane Smith",  "The Presidential Suite",  "Oct 19 - Oct 21", "$25,000", "Paid",    "gold",     "Confirmed", "gold")}
                        ${renderBookingRow("B-1005", "James Curran","The Sunset Elite",        "Nov 22 - Nov 29", "$12,000", "Partial", "charcoal", "Completed", "charcoal")}
                        ${renderBookingRow("B-1006", "Jane Smith",  "The Oceanfront Villa",    "Nov 21 - Nov 25", "$15,500", "Paid",    "gold",     "Completed", "charcoal")}
                    </tbody>
                </table>

                <!-- Pagination -->
                <div id="bm-pagination" style="display: flex; justify-content: space-between; align-items: center; padding: 14px 20px; border-top: 1px solid #e8e4dc; background: #fafaf8;">
                    <span style="font-size: 13px; color: #6b7280;" id="bm-page-info">Đang hiển thị 1 đến 6 trong tổng 6 đặt phòng</span>
                    <div style="display: flex; gap: 6px;" id="bm-page-buttons">
                        <!-- rendered by JS -->
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderBookingRow(id, guest, hotel, dates, price, payStatus, payTag, bookStatus, bookTag) {
    const payStyle = payTag === "gold"
        ? "background: linear-gradient(135deg,#c9a84c,#e8cc7a); color: #1a1a2e;"
        : "background: #1a1a2e; color: #f0e6c8;";

    const bookStyle = bookTag === "gold"
        ? "border: 1.5px solid #c9a84c; color: #c9a84c; background: transparent;"
        : "border: 1.5px solid #1a1a2e; color: #1a1a2e; background: transparent;";

    return `
        <tr class="bm-row" style="border-bottom: 1px solid #f0ece4; transition: background 0.15s;" onmouseenter="this.style.background='#fafaf8'" onmouseleave="this.style.background='white'">
            <td style="padding: 13px 16px; font-size: 13px; color: #1a1a2e; font-weight: 500;">${id}</td>
            <td style="padding: 13px 16px; font-size: 13px; color: #4b5563;">${guest}</td>
            <td style="padding: 13px 16px; font-size: 13px; color: #4b5563;">${hotel}</td>
            <td style="padding: 13px 16px; font-size: 13px; color: #4b5563;">${dates}</td>
            <td style="padding: 13px 16px; font-size: 13px; color: #1a1a2e; font-weight: 500;">${price}</td>
            <td style="padding: 13px 16px;">
                <span style="${payStyle} padding: 4px 12px; border-radius: 5px; font-size: 12px; font-weight: 600; white-space: nowrap;">${payStatus}</span>
            </td>
            <td style="padding: 13px 16px;">
                <span style="${bookStyle} padding: 4px 12px; border-radius: 5px; font-size: 12px; font-weight: 600; white-space: nowrap;">${bookStatus}</span>
            </td>
            <td style="padding: 13px 16px;">
                <a href="#" class="bm-view-details" data-id="${id}" style="font-size: 13px; color: #c9a84c; font-weight: 600; text-decoration: none;" onmouseenter="this.style.textDecoration='underline'" onmouseleave="this.style.textDecoration='none'">View Details</a>
            </td>
        </tr>
    `;
}