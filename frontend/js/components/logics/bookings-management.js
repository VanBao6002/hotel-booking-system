import { getBookings, searchBookings } from "../../services/admin.js";

const PAGE_SIZE = 6;
let allBookings = [];
let filtered = [];
let currentPage = 1;
let bookingsApi = {
    getBookings,
    searchBookings,
};

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

function friendlyError(err, fallback) {
    const message = err?.data?.message || "";
    if (!message || /StatementCallback|PreparedStatementCallback|bad SQL|SELECT | FROM | JOIN |SQL syntax/i.test(message)) {
        return fallback;
    }
    return message;
}

function formatDates(booking) {
    if (booking.formattedDates) return booking.formattedDates;
    if (!booking.checkInDate || !booking.checkOutDate) return "-";
    return `${booking.checkInDate} - ${booking.checkOutDate}`;
}

function mapBooking(booking) {
    return {
        id: booking.id,
        guest: booking.guestName || "Guest",
        hotel: booking.hotelName || "Unknown hotel",
        dates: formatDates(booking),
        price: formatMoney(booking.totalPrice),
        payStatus: booking.paymentStatus || "Pending",
        bookStatus: booking.bookingStatus || "Confirmed",
    };
}

function populateHotelFilter(bookings) {
    const select = document.getElementById("bm-hotel-select");
    if (!select) return;

    const currentValue = select.value;
    const hotels = [...new Set((bookings || [])
        .map(booking => booking.hotelName)
        .filter(Boolean))]
        .sort((a, b) => a.localeCompare(b));

    select.innerHTML = `<option value="">Hotel</option>` + hotels
        .map(hotel => `<option value="${escapeHtml(hotel)}">${escapeHtml(hotel)}</option>`)
        .join("");

    if (hotels.includes(currentValue)) {
        select.value = currentValue;
    }
}

function parseDateRange(value) {
    const dates = String(value || "").match(/\d{4}-\d{2}-\d{2}/g) || [];
    return {
        startDate: dates[0] || "",
        endDate: dates[1] || "",
    };
}

function tagStyle(value, kind) {
    const strong = value === "Paid" || value === "Confirmed";
    if (kind === "payment") {
        return strong
            ? "background: linear-gradient(135deg,#c9a84c,#e8cc7a); color: #1a1a2e;"
            : "background: #1a1a2e; color: #f0e6c8;";
    }
    return strong
        ? "border: 1.5px solid #c9a84c; color: #c9a84c; background: transparent;"
        : "border: 1.5px solid #1a1a2e; color: #1a1a2e; background: transparent;";
}

function renderRows(data) {
    const tbody = document.getElementById("bm-tbody");
    if (!tbody) return;

    const start = (currentPage - 1) * PAGE_SIZE;
    const pageData = data.slice(start, start + PAGE_SIZE);

    if (pageData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="padding:24px;text-align:center;color:#6b7280;">No bookings found</td></tr>`;
        updatePagination(data);
        return;
    }

    tbody.innerHTML = pageData.map(raw => {
        const b = mapBooking(raw);
        return `
            <tr class="bm-row" style="border-bottom:1px solid #f0ece4; background:white; transition: background 0.15s;" onmouseenter="this.style.background='#fafaf8'" onmouseleave="this.style.background='white'">
                <td style="padding:13px 16px;font-size:13px;color:#1a1a2e;font-weight:500;">${escapeHtml(b.id)}</td>
                <td style="padding:13px 16px;font-size:13px;color:#4b5563;">${escapeHtml(b.guest)}</td>
                <td style="padding:13px 16px;font-size:13px;color:#4b5563;">${escapeHtml(b.hotel)}</td>
                <td style="padding:13px 16px;font-size:13px;color:#4b5563;">${escapeHtml(b.dates)}</td>
                <td style="padding:13px 16px;font-size:13px;color:#1a1a2e;font-weight:500;">${escapeHtml(b.price)}</td>
                <td style="padding:13px 16px;">
                    <span style="${tagStyle(b.payStatus, "payment")} padding:4px 12px;border-radius:5px;font-size:12px;font-weight:600;white-space:nowrap;">${escapeHtml(b.payStatus)}</span>
                </td>
                <td style="padding:13px 16px;">
                    <span style="${tagStyle(b.bookStatus, "booking")} padding:4px 12px;border-radius:5px;font-size:12px;font-weight:600;white-space:nowrap;">${escapeHtml(b.bookStatus)}</span>
                </td>
                <td style="padding:13px 16px;">
                    <a href="#" class="bm-view-details" data-id="${b.id}" style="font-size:13px;color:#c9a84c;font-weight:600;text-decoration:none;">View Details</a>
                </td>
            </tr>
        `;
    }).join("");

    tbody.querySelectorAll(".bm-view-details").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const booking = filtered.find(item => item.id === link.dataset.id)
                || allBookings.find(item => item.id === link.dataset.id);
            showBookingDetails(booking);
        });
    });

    updatePagination(data);
}

function updatePagination(data) {
    const total = data.length;
    const start = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
    const end = Math.min(currentPage * PAGE_SIZE, total);
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    const info = document.getElementById("bm-page-info");
    if (info) info.textContent = `Dang hien thi ${start} den ${end} trong tong ${total} dat phong`;

    const btns = document.getElementById("bm-page-buttons");
    if (!btns) return;
    btns.innerHTML = "";

    btns.appendChild(makePagerBtn("<", currentPage === 1, () => { currentPage--; renderRows(filtered); }));
    for (let p = 1; p <= totalPages; p++) {
        const btn = makePagerBtn(p, false, () => { currentPage = p; renderRows(filtered); });
        if (p === currentPage) {
            btn.style.background = "linear-gradient(135deg,#c9a84c,#e8cc7a)";
            btn.style.color = "#1a1a2e";
            btn.style.borderColor = "transparent";
            btn.style.fontWeight = "700";
        }
        btns.appendChild(btn);
    }
    btns.appendChild(makePagerBtn(">", currentPage === totalPages, () => { currentPage++; renderRows(filtered); }));
}

function makePagerBtn(label, disabled, onClick) {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.disabled = disabled;
    btn.style.cssText = `
        min-width: 34px; height: 34px; padding: 0 10px;
        border: 1.5px solid #e2e2da; border-radius: 7px;
        background: white; color: #4b5563;
        font-size: 13px; font-weight: 500; cursor: pointer;
        transition: all 0.15s;
        opacity: ${disabled ? 0.4 : 1};
    `;
    if (!disabled) btn.addEventListener("click", onClick);
    return btn;
}

function showBookingDetails(booking) {
    if (!booking) return;
    document.querySelector(".bm-detail-modal")?.remove();

    const mapped = mapBooking(booking);
    const rooms = booking.bookingRooms || [];
    document.body.insertAdjacentHTML("beforeend", `
        <div class="bm-detail-modal">
            <div class="bm-detail-modal__backdrop" data-close-booking-modal></div>
            <section class="bm-detail-modal__panel" role="dialog" aria-modal="true">
                <header class="bm-detail-modal__header">
                    <div>
                        <h3>Booking ${escapeHtml(mapped.id)}</h3>
                        <p>${escapeHtml(mapped.hotel)}</p>
                    </div>
                    <button type="button" class="bm-detail-modal__close" data-close-booking-modal aria-label="Close">
                        <i class="fa fa-times"></i>
                    </button>
                </header>
                <div class="bm-detail-modal__body">
                    <div class="bm-detail-grid">
                        <div><span>Guest</span><strong>${escapeHtml(mapped.guest)}</strong></div>
                        <div><span>Email</span><strong>${escapeHtml(booking.guestEmail || "-")}</strong></div>
                        <div><span>Dates</span><strong>${escapeHtml(mapped.dates)}</strong></div>
                        <div><span>Total</span><strong>${escapeHtml(mapped.price)}</strong></div>
                        <div><span>Payment</span><strong>${escapeHtml(mapped.payStatus)}</strong></div>
                        <div><span>Status</span><strong>${escapeHtml(mapped.bookStatus)}</strong></div>
                    </div>
                    <div class="bm-detail-rooms">
                        <h4>Rooms</h4>
                        ${rooms.length ? rooms.map(room => `
                            <div class="bm-detail-room">
                                <span>Room ${escapeHtml(room.roomNumber || room.roomId || "-")}</span>
                                <strong>${escapeHtml(room.roomType || "-")} | ${formatMoney(room.roomPrice)}</strong>
                            </div>
                        `).join("") : `<div class="bm-detail-room bm-detail-room--empty">No room details</div>`}
                    </div>
                </div>
            </section>
        </div>
    `);

    const modal = document.querySelector(".bm-detail-modal");
    const close = () => modal?.remove();
    modal.querySelectorAll("[data-close-booking-modal]").forEach(el => el.addEventListener("click", close));
    document.addEventListener("keydown", function handleEsc(event) {
        if (event.key === "Escape") {
            close();
            document.removeEventListener("keydown", handleEsc);
        }
    });
}

async function loadBookings() {
    try {
        allBookings = await bookingsApi.getBookings() || [];
        populateHotelFilter(allBookings);
        filtered = [...allBookings];
        currentPage = 1;
        renderRows(filtered);
    } catch (err) {
        console.error("Could not load bookings", err);
        const tbody = document.getElementById("bm-tbody");
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="8" style="padding:24px;text-align:center;color:#b42318;">${friendlyError(err, "Could not load bookings from database.")}</td></tr>`;
        }
    }
}

async function applyServerFilter() {
    const searchId = document.getElementById("bm-search-id")?.value || "";
    const guestName = document.getElementById("bm-guest-name")?.value || "";
    const hotel = document.getElementById("bm-hotel-select")?.value || "";
    const { startDate, endDate } = parseDateRange(document.getElementById("bm-date-range")?.value);

    try {
        filtered = await bookingsApi.searchBookings({ searchId, guestName, hotel, startDate, endDate }) || [];
        currentPage = 1;
        renderRows(filtered);
    } catch (err) {
        console.error("Booking search failed", err);
        const tbody = document.getElementById("bm-tbody");
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="8" style="padding:24px;text-align:center;color:#b42318;">${friendlyError(err, "Search failed.")}</td></tr>`;
        }
    }
}

export function initBookingsManagement(options = {}) {
    bookingsApi = {
        getBookings: options.getBookings || getBookings,
        searchBookings: options.searchBookings || searchBookings,
    };
    allBookings = [];
    filtered = [];
    currentPage = 1;
    document.getElementById("bm-filter-btn")?.addEventListener("click", applyServerFilter);
    loadBookings();
}
