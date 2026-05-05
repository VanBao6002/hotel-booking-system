export function initBookingsManagement() {
    // All booking data — in production replace with API fetch
    const allBookings = [
        { id: "B-1001", guest: "John Doe",     hotel: "The Oceanfront Villa",   dates: "Oct 20 - Oct 25", price: "$10,500", payStatus: "Paid",    payTag: "gold",     bookStatus: "Confirmed", bookTag: "gold"     },
        { id: "B-1002", guest: "Jane Smith",   hotel: "The Presidential Suite", dates: "Nov 1 - Nov 5",   price: "$25,000", payStatus: "Partial", payTag: "charcoal", bookStatus: "Completed", bookTag: "charcoal" },
        { id: "B-1003", guest: "John Doe",     hotel: "The Oceanfront Villa",   dates: "Nov 1 - Oct 19",  price: "$10,500", payStatus: "Paid",    payTag: "gold",     bookStatus: "Confirmed", bookTag: "charcoal" },
        { id: "B-1004", guest: "Jane Smith",   hotel: "The Presidential Suite", dates: "Oct 19 - Oct 21", price: "$25,000", payStatus: "Paid",    payTag: "gold",     bookStatus: "Confirmed", bookTag: "gold"     },
        { id: "B-1005", guest: "James Curran", hotel: "The Sunset Elite",       dates: "Nov 22 - Nov 29", price: "$12,000", payStatus: "Partial", payTag: "charcoal", bookStatus: "Completed", bookTag: "charcoal" },
        { id: "B-1006", guest: "Jane Smith",   hotel: "The Oceanfront Villa",   dates: "Nov 21 - Nov 25", price: "$15,500", payStatus: "Paid",    payTag: "gold",     bookStatus: "Completed", bookTag: "charcoal" },
        { id: "B-1007", guest: "Michael Tran", hotel: "The Oceanfront Villa",   dates: "Dec 1 - Dec 5",   price: "$18,000", payStatus: "Paid",    payTag: "gold",     bookStatus: "Confirmed", bookTag: "gold"     },
        { id: "B-1008", guest: "Sara Lee",     hotel: "The Presidential Suite", dates: "Dec 10 - Dec 15", price: "$30,000", payStatus: "Partial", payTag: "charcoal", bookStatus: "Pending",   bookTag: "charcoal" },
    ];

    const PAGE_SIZE = 6;
    let currentPage = 1;
    let filtered = [...allBookings];

    function renderRows(data) {
        const tbody = document.getElementById("bm-tbody");
        if (!tbody) return;

        const start = (currentPage - 1) * PAGE_SIZE;
        const pageData = data.slice(start, start + PAGE_SIZE);

        tbody.innerHTML = pageData.map(b => {
            const payStyle = b.payTag === "gold"
                ? "background: linear-gradient(135deg,#c9a84c,#e8cc7a); color: #1a1a2e;"
                : "background: #1a1a2e; color: #f0e6c8;";
            const bookStyle = b.bookTag === "gold"
                ? "border: 1.5px solid #c9a84c; color: #c9a84c; background: transparent;"
                : "border: 1.5px solid #1a1a2e; color: #1a1a2e; background: transparent;";
            return `
                <tr class="bm-row" style="border-bottom:1px solid #f0ece4; background:white; transition: background 0.15s;" onmouseenter="this.style.background='#fafaf8'" onmouseleave="this.style.background='white'">
                    <td style="padding:13px 16px;font-size:13px;color:#1a1a2e;font-weight:500;">${b.id}</td>
                    <td style="padding:13px 16px;font-size:13px;color:#4b5563;">${b.guest}</td>
                    <td style="padding:13px 16px;font-size:13px;color:#4b5563;">${b.hotel}</td>
                    <td style="padding:13px 16px;font-size:13px;color:#4b5563;">${b.dates}</td>
                    <td style="padding:13px 16px;font-size:13px;color:#1a1a2e;font-weight:500;">${b.price}</td>
                    <td style="padding:13px 16px;">
                        <span style="${payStyle} padding:4px 12px;border-radius:5px;font-size:12px;font-weight:600;white-space:nowrap;">${b.payStatus}</span>
                    </td>
                    <td style="padding:13px 16px;">
                        <span style="${bookStyle} padding:4px 12px;border-radius:5px;font-size:12px;font-weight:600;white-space:nowrap;">${b.bookStatus}</span>
                    </td>
                    <td style="padding:13px 16px;">
                        <a href="#" class="bm-view-details" data-id="${b.id}" style="font-size:13px;color:#c9a84c;font-weight:600;text-decoration:none;" onmouseenter="this.style.textDecoration='underline'" onmouseleave="this.style.textDecoration='none'">View Details</a>
                    </td>
                </tr>
            `;
        }).join("");

        // Attach view details events
        tbody.querySelectorAll(".bm-view-details").forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                alert("View details for booking: " + link.dataset.id);
            });
        });

        updatePagination(data);
    }

    function updatePagination(data) {
        const total = data.length;
        const start = (currentPage - 1) * PAGE_SIZE + 1;
        const end = Math.min(currentPage * PAGE_SIZE, total);
        const totalPages = Math.ceil(total / PAGE_SIZE);

        const info = document.getElementById("bm-page-info");
        if (info) info.textContent = `Đang hiển thị ${start} đến ${end} trong tổng ${total} đặt phòng`;

        const btns = document.getElementById("bm-page-buttons");
        if (!btns) return;
        btns.innerHTML = "";

        // Prev
        const prev = makePagerBtn("‹", currentPage === 1, () => { currentPage--; renderRows(filtered); });
        btns.appendChild(prev);

        // Page numbers
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

        // Next
        const next = makePagerBtn("›", currentPage === totalPages, () => { currentPage++; renderRows(filtered); });
        btns.appendChild(next);
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
        if (!disabled) {
            btn.addEventListener("mouseenter", () => { btn.style.borderColor = "#c9a84c"; btn.style.color = "#c9a84c"; });
            btn.addEventListener("mouseleave", () => { btn.style.borderColor = "#e2e2da"; btn.style.color = "#4b5563"; });
            btn.addEventListener("click", onClick);
        }
        return btn;
    }

    // Filter logic
    const filterBtn = document.getElementById("bm-filter-btn");
    if (filterBtn) {
        filterBtn.addEventListener("click", () => {
            const searchId  = (document.getElementById("bm-search-id")?.value   || "").toLowerCase();
            const guestName = (document.getElementById("bm-guest-name")?.value  || "").toLowerCase();
            const hotel     = (document.getElementById("bm-hotel-select")?.value || "");

            filtered = allBookings.filter(b => {
                const matchId    = !searchId  || b.id.toLowerCase().includes(searchId);
                const matchGuest = !guestName || b.guest.toLowerCase().includes(guestName);
                const matchHotel = !hotel     || b.hotel.toLowerCase().includes(hotel);
                return matchId && matchGuest && matchHotel;
            });

            currentPage = 1;
            renderRows(filtered);
        });
    }

    // Initial render
    renderRows(filtered);
}