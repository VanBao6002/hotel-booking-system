import { getBookings, searchBookings } from "../../services/admin.js";
import { downloadCsv, downloadTablePdf, reportDateStamp } from "../../utils/table-export.js";

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

function translateMonthText(value) {
    const months = {
        Jan: "Tháng 1",
        Feb: "Tháng 2",
        Mar: "Tháng 3",
        Apr: "Tháng 4",
        May: "Tháng 5",
        Jun: "Tháng 6",
        Jul: "Tháng 7",
        Aug: "Tháng 8",
        Sep: "Tháng 9",
        Oct: "Tháng 10",
        Nov: "Tháng 11",
        Dec: "Tháng 12",
    };
    return String(value || "").replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g, month => months[month] || month);
}

function formatDateVi(value) {
    if (!value) return "";
    const raw = String(value);
    const normalized = /^\d{4}-\d{2}-\d{2}$/.test(raw) ? `${raw}T00:00:00` : raw;
    const date = new Date(normalized);
    if (Number.isNaN(date.getTime())) return translateMonthText(raw);
    return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

function formatDates(booking) {
    const checkIn = formatDateVi(booking.checkInDate);
    const checkOut = formatDateVi(booking.checkOutDate);
    if (checkIn && checkOut) return `${checkIn} - ${checkOut}`;
    if (booking.formattedDates) return translateMonthText(booking.formattedDates);
    return "-";
}

function roomTypeLabel(type) {
    const normalized = String(type || "").trim().toUpperCase();
    if (normalized === "SINGLE" || normalized === "SINGLE ROOM") return "Phòng đơn";
    if (normalized === "DOUBLE" || normalized === "DOUBLE ROOM") return "Phòng đôi";
    return type || "-";
}

function mapBooking(booking) {
    const reviewed = booking.reviewed === true;
    return {
        id: booking.id,
        guest: booking.guestName || "Khách",
        hotel: booking.hotelName || "Chưa rõ khách sạn",
        dates: formatDates(booking),
        price: formatMoney(booking.totalPrice),
        reviewed,
        bookStatus: reviewed ? "ĐÃ ĐÁNH GIÁ" : "CHƯA ĐÁNH GIÁ",
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

    select.innerHTML = `<option value="">Khách sạn</option>` + hotels
        .map(hotel => `<option value="${escapeHtml(hotel)}">${escapeHtml(hotel)}</option>`)
        .join("");

    if (hotels.includes(currentValue)) {
        select.value = currentValue;
    }
}

function tagStyle(reviewed) {
    return reviewed
        ? "border: 1.5px solid #c9a84c; color: #c9a84c; background: transparent;"
        : "border: 1.5px solid #1a1a2e; color: #1a1a2e; background: transparent;";
}

function renderRows(data) {
    const tbody = document.getElementById("bm-tbody");
    if (!tbody) return;

    const start = (currentPage - 1) * PAGE_SIZE;
    const pageData = data.slice(start, start + PAGE_SIZE);

    if (pageData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="padding:24px;text-align:center;color:#6b7280;">Chưa có đặt phòng</td></tr>`;
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
                    <span style="${tagStyle(b.reviewed)} padding:4px 12px;border-radius:5px;font-size:12px;font-weight:600;white-space:nowrap;">${escapeHtml(b.bookStatus)}</span>
                </td>
                <td style="padding:13px 16px;">
                    <a href="#" class="bm-view-details" data-id="${b.id}" style="font-size:13px;color:#c9a84c;font-weight:600;text-decoration:none;">Xem chi tiết</a>
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
    if (info) info.textContent = `Đang hiển thị ${start} đến ${end} trong tổng ${total} đặt phòng`;

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
                        <h3>Đặt phòng ${escapeHtml(mapped.id)}</h3>
                        <p>${escapeHtml(mapped.hotel)}</p>
                    </div>
                    <button type="button" class="bm-detail-modal__close" data-close-booking-modal aria-label="Đóng">
                        <i class="fa fa-times"></i>
                    </button>
                </header>
                <div class="bm-detail-modal__body">
                    <div class="bm-detail-grid">
                        <div><span>Khách</span><strong>${escapeHtml(mapped.guest)}</strong></div>
                        <div><span>Email</span><strong>${escapeHtml(booking.guestEmail || "-")}</strong></div>
                        <div><span>Ngày</span><strong>${escapeHtml(mapped.dates)}</strong></div>
                        <div><span>Tổng tiền</span><strong>${escapeHtml(mapped.price)}</strong></div>
                        <div><span>Trạng thái</span><strong>${escapeHtml(mapped.bookStatus)}</strong></div>
                    </div>
                    <div class="bm-detail-rooms">
                        <h4>Phòng</h4>
                        ${rooms.length ? rooms.map(room => `
                            <div class="bm-detail-room">
                                <span>Phòng ${escapeHtml(room.roomNumber || room.roomId || "-")}</span>
                                <strong>${escapeHtml(roomTypeLabel(room.roomType))} | ${formatMoney(room.roomPrice)}</strong>
                            </div>
                        `).join("") : `<div class="bm-detail-room bm-detail-room--empty">Chưa có chi tiết phòng</div>`}
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
        console.error("Không thể tải đặt phòng", err);
        const tbody = document.getElementById("bm-tbody");
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="7" style="padding:24px;text-align:center;color:#b42318;">${friendlyError(err, "Không thể tải đặt phòng từ cơ sở dữ liệu.")}</td></tr>`;
        }
    }
}

async function applyServerFilter() {
    const searchId = document.getElementById("bm-search-id")?.value || "";
    const guestName = document.getElementById("bm-guest-name")?.value || "";
    const hotel = document.getElementById("bm-hotel-select")?.value || "";
    const startDate = document.getElementById("bm-start-date")?.value || "";
    const endDate = document.getElementById("bm-end-date")?.value || "";

    if (startDate && endDate && startDate > endDate) {
        const endInput = document.getElementById("bm-end-date");
        endInput?.setCustomValidity("Ngày kết thúc phải bằng hoặc sau ngày bắt đầu.");
        endInput?.reportValidity();
        return;
    }

    try {
        filtered = await bookingsApi.searchBookings({ searchId, guestName, hotel, startDate, endDate }) || [];
        currentPage = 1;
        renderRows(filtered);
    } catch (err) {
        console.error("Tìm kiếm đặt phòng thất bại", err);
        const tbody = document.getElementById("bm-tbody");
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="7" style="padding:24px;text-align:center;color:#b42318;">${friendlyError(err, "Tìm kiếm thất bại.")}</td></tr>`;
        }
    }
}

function bookingExportRows() {
    return filtered.map(booking => {
        const mapped = mapBooking(booking);
        return [
            mapped.id,
            mapped.guest,
            mapped.hotel,
            mapped.dates,
            mapped.price,
            mapped.bookStatus,
        ];
    });
}

function wireDateInputs() {
    const startInput = document.getElementById("bm-start-date");
    const endInput = document.getElementById("bm-end-date");
    startInput?.addEventListener("change", () => {
        if (!endInput) return;
        endInput.min = startInput.value || "";
        endInput.setCustomValidity("");
        if (startInput.value && endInput.value && endInput.value < startInput.value) {
            endInput.value = startInput.value;
        }
    });
    endInput?.addEventListener("change", () => endInput.setCustomValidity(""));
}

function wireExportButtons() {
    const headers = ["Mã đặt phòng", "Khách", "Khách sạn", "Nhận / Trả phòng", "Tổng tiền", "Trạng thái đánh giá"];

    document.getElementById("bm-export-csv-btn")?.addEventListener("click", () => {
        downloadCsv(`danh-sach-dat-phong-${reportDateStamp()}.csv`, headers, bookingExportRows());
    });

    document.getElementById("bm-export-pdf-btn")?.addEventListener("click", async (event) => {
        const button = event.currentTarget;
        const originalText = button.innerHTML;
        button.disabled = true;
        button.textContent = "Đang tạo PDF...";
        try {
            await downloadTablePdf({
                filename: `danh-sach-dat-phong-${reportDateStamp()}.pdf`,
                title: "Danh sách đặt phòng",
                headers,
                rows: bookingExportRows(),
                columnWidths: [0.1, 0.15, 0.24, 0.2, 0.14, 0.17],
            });
        } catch (error) {
            console.error("Không thể tạo báo cáo đặt phòng PDF", error);
            alert("Không thể tạo file PDF. Vui lòng thử lại.");
        } finally {
            button.disabled = false;
            button.innerHTML = originalText;
        }
    });
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
    wireDateInputs();
    wireExportButtons();
    loadBookings();
}
