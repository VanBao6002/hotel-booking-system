import { getBookings, searchBookings } from "../../services/admin.js";

const PAGE_SIZE = 6;
let allBookings = [];
let filtered = [];
let currentPage = 1;

function formatMoney(value) {
    return `${Number(value || 0).toLocaleString("vi-VN")} VND`;
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
                <td style="padding:13px 16px;font-size:13px;color:#1a1a2e;font-weight:500;">${b.id}</td>
                <td style="padding:13px 16px;font-size:13px;color:#4b5563;">${b.guest}</td>
                <td style="padding:13px 16px;font-size:13px;color:#4b5563;">${b.hotel}</td>
                <td style="padding:13px 16px;font-size:13px;color:#4b5563;">${b.dates}</td>
                <td style="padding:13px 16px;font-size:13px;color:#1a1a2e;font-weight:500;">${b.price}</td>
                <td style="padding:13px 16px;">
                    <span style="${tagStyle(b.payStatus, "payment")} padding:4px 12px;border-radius:5px;font-size:12px;font-weight:600;white-space:nowrap;">${b.payStatus}</span>
                </td>
                <td style="padding:13px 16px;">
                    <span style="${tagStyle(b.bookStatus, "booking")} padding:4px 12px;border-radius:5px;font-size:12px;font-weight:600;white-space:nowrap;">${b.bookStatus}</span>
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
            const booking = allBookings.find(item => item.id === link.dataset.id);
            alert(JSON.stringify(booking, null, 2));
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

async function loadBookings() {
    try {
        allBookings = await getBookings() || [];
        filtered = [...allBookings];
        currentPage = 1;
        renderRows(filtered);
    } catch (err) {
        const tbody = document.getElementById("bm-tbody");
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="8" style="padding:24px;text-align:center;color:#b42318;">${err?.data?.message || "Could not load bookings from database."}</td></tr>`;
        }
    }
}

async function applyServerFilter() {
    const searchId = document.getElementById("bm-search-id")?.value || "";
    const guestName = document.getElementById("bm-guest-name")?.value || "";
    const hotel = document.getElementById("bm-hotel-select")?.value || "";

    try {
        filtered = await searchBookings({ searchId, guestName, hotel }) || [];
        currentPage = 1;
        renderRows(filtered);
    } catch (err) {
        alert(err?.data?.message || "Search failed");
    }
}

export function initBookingsManagement() {
    document.getElementById("bm-filter-btn")?.addEventListener("click", applyServerFilter);
    loadBookings();
}
