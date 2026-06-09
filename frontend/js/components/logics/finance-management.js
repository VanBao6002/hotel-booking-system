import { getFinanceSummary, getFinanceTransactions, getMonthlyRevenue } from "../../services/admin.js";

let latestMonthlyData = [];
let latestTransactions = [];

export function initFinanceManagement() {
    requestAnimationFrame(async () => {
        await loadFinanceData();
        initExportButtons();
    });
}

function formatMoney(value) {
    return `${Number(value || 0).toLocaleString("vi-VN")} VND`;
}

function reportDateStamp(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function friendlyError(err, fallback) {
    const message = err?.data?.message || "";
    if (!message || /StatementCallback|PreparedStatementCallback|bad SQL|SELECT | FROM | JOIN |SQL syntax/i.test(message)) {
        return fallback;
    }
    return message;
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

function transactionStatusLabel(status) {
    const normalized = String(status || "").toLowerCase();
    if (normalized === "completed") return "Hoàn tất";
    if (normalized === "paid") return "Đã thanh toán";
    if (normalized === "booked") return "Đã đặt";
    if (normalized === "pending") return "Đang chờ";
    if (normalized === "cancelled" || normalized === "canceled") return "Đã hủy";
    return status || "-";
}

function transactionDescription(description) {
    return String(description || "-")
        .replace(/^Booking\s+(\d+)\s+-\s+Unknown hotel$/i, "Đặt phòng $1 - Chưa rõ khách sạn")
        .replace(/^Booking\s+(\d+)\s+-\s+/i, "Đặt phòng $1 - ");
}

async function loadFinanceData() {
    try {
        const [summary, transactions, monthlyRevenue] = await Promise.all([
            getFinanceSummary(),
            getFinanceTransactions(),
            getMonthlyRevenue(),
        ]);

        document.getElementById("finance-total-earnings").textContent = formatMoney(summary.totalEarnings);
        document.getElementById("finance-tax-summary").textContent = formatMoney(summary.taxSummary);

        latestMonthlyData = monthlyRevenue?.data || [];
        latestTransactions = transactions || [];
        renderFinanceBarChart(latestMonthlyData);
        renderTransactions(latestTransactions);
    } catch (err) {
        console.error("Không thể tải dữ liệu tài chính", err);
        const tbody = document.getElementById("transaction-tbody");
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="4" style="padding:18px 16px;color:#b42318;">${friendlyError(err, "Không thể tải dữ liệu tài chính.")}</td></tr>`;
        }
        renderFinanceBarChart([]);
        latestTransactions = [];
    }
}

function renderTransactions(transactions) {
    const tbody = document.getElementById("transaction-tbody");
    if (!tbody) return;

    if (transactions.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="padding:18px 16px;color:#6b7280;">Chưa có giao dịch</td></tr>`;
        return;
    }

    tbody.innerHTML = transactions.map(tx => `
        <tr style="border-bottom: 1px solid #f0ece4;">
            <td style="padding: 14px 16px; font-size: 13px; color: #4b5563;">${tx.date || "-"}</td>
            <td style="padding: 14px 16px; font-size: 13px; color: #1a1a2e;">${escapeHtml(transactionDescription(tx.description))}</td>
            <td style="padding: 14px 16px; font-size: 13px; font-weight: 600; color: #1a1a2e;">${formatMoney(tx.amount)}</td>
            <td style="padding: 14px 16px; font-size: 13px; color: #4b5563;">${escapeHtml(transactionStatusLabel(tx.status))}</td>
        </tr>
    `).join("");
}

function renderFinanceBarChart(monthlyData) {
    const canvas = document.getElementById("finance-bar-chart");
    if (!canvas) return;

    canvas.width = canvas.parentElement.offsetWidth || 900;
    canvas.height = 280;

    const ctx = canvas.getContext("2d");
    const months = monthlyData.length
        ? monthlyData.map(item => monthLabel(item.month))
        : ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];
    const revenueData = monthlyData.length ? monthlyData.map(item => Number(item.revenue || 0)) : Array(12).fill(0);
    const width = canvas.width;
    const height = canvas.height;
    const paddingLeft = 76;
    const paddingRight = 28;
    const paddingTop = 38;
    const paddingBottom = 46;
    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    const maxSeriesValue = Math.max(...revenueData, 100000);
    const maxValue = Math.ceil((maxSeriesValue * 1.15) / 100000) * 100000;
    const ySteps = Array.from({ length: 6 }, (_, index) => Math.round((maxValue / 5) * index));

    ctx.clearRect(0, 0, width, height);
    ctx.font = "11px Inter, sans-serif";
    ctx.fillStyle = "#9aa3b0";
    ctx.textAlign = "right";

    ySteps.forEach(val => {
        const y = paddingTop + chartHeight - (val / maxValue) * chartHeight;
        ctx.fillText((val / 1000).toFixed(0) + "k", paddingLeft - 8, y + 4);
        ctx.beginPath();
        ctx.strokeStyle = "#f0ece4";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.moveTo(paddingLeft, y);
        ctx.lineTo(paddingLeft + chartWidth, y);
        ctx.stroke();
        ctx.setLineDash([]);
    });

    const groupWidth = chartWidth / months.length;
    const barWidth = Math.min(42, groupWidth * 0.42);

    months.forEach((month, i) => {
        const groupCenter = paddingLeft + (i + 0.5) * groupWidth;
        const barX = groupCenter - barWidth / 2;
        const revH = (revenueData[i] / maxValue) * chartHeight;
        const revY = paddingTop + chartHeight - revH;
        ctx.fillStyle = "#c9a84c";
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(barX, revY, barWidth, revH, [3, 3, 0, 0]) : ctx.rect(barX, revY, barWidth, revH);
        ctx.fill();

        ctx.fillStyle = "#9aa3b0";
        ctx.textAlign = "center";
        ctx.font = "11px Inter, sans-serif";
        ctx.fillText(month, groupCenter, height - 8);
    });
}

function initExportButtons() {
    const csvBtn = document.getElementById("export-csv-btn");
    const pdfBtn = document.getElementById("export-pdf-btn");

    if (csvBtn) {
        csvBtn.addEventListener("click", () => {
            let csv = "Ngày,Mô tả,Số tiền,Trạng thái\n";
            latestTransactions.forEach(tx => {
                csv += [
                    tx.date || "",
                    transactionDescription(tx.description),
                    formatMoney(tx.amount),
                    transactionStatusLabel(tx.status),
                ].map(value => `"${String(value).replaceAll('"', '""')}"`).join(",") + "\n";
            });
            downloadFile(
                `lich-su-giao-dich-${reportDateStamp()}.csv`,
                `\uFEFF${csv}`,
                "text/csv;charset=utf-8",
            );
        });
    }

    if (pdfBtn) {
        pdfBtn.addEventListener("click", async () => {
            const originalText = pdfBtn.textContent;
            pdfBtn.disabled = true;
            pdfBtn.textContent = "Đang tạo PDF...";
            try {
                await downloadPdfReport(latestTransactions);
            } catch (error) {
                console.error("Không thể tạo báo cáo PDF", error);
                alert("Không thể tạo file PDF. Vui lòng thử lại.");
            } finally {
                pdfBtn.disabled = false;
                pdfBtn.textContent = originalText;
            }
        });
    }
}

async function downloadPdfReport(transactions) {
    const rows = transactions.length ? transactions : [];
    const rowsPerPage = 28;
    const pageCount = Math.max(1, Math.ceil(rows.length / rowsPerPage));
    const generatedAt = new Date().toLocaleString("vi-VN");
    const pageImages = [];

    for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
        const pageRows = rows.slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage);
        const canvas = renderPdfPage(pageRows, pageIndex + 1, pageCount, generatedAt);
        pageImages.push(new Uint8Array(await canvasToJpegBlob(canvas).then(blob => blob.arrayBuffer())));
    }

    const pdfBlob = buildImagePdf(pageImages, 1240, 1754);
    downloadBlob(`lich-su-giao-dich-${reportDateStamp()}.pdf`, pdfBlob);
}

function renderPdfPage(rows, pageNumber, pageCount, generatedAt) {
    const canvas = document.createElement("canvas");
    canvas.width = 1240;
    canvas.height = 1754;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#1B3055";
    ctx.font = "700 42px Arial, sans-serif";
    ctx.fillText("PTBL Booking Hotel", 72, 82);

    ctx.fillStyle = "#C8A96C";
    ctx.fillRect(72, 104, 1096, 5);

    ctx.fillStyle = "#1B3055";
    ctx.font = "700 34px Arial, sans-serif";
    ctx.fillText("Lịch Sử Giao Dịch", 72, 166);

    ctx.fillStyle = "#7A7685";
    ctx.font = "20px Arial, sans-serif";
    ctx.fillText(`Ngày xuất báo cáo: ${generatedAt}`, 72, 207);
    ctx.textAlign = "right";
    ctx.fillText(`Trang ${pageNumber}/${pageCount}`, 1168, 207);
    ctx.textAlign = "left";

    const columns = [
        { label: "Ngày", x: 72, width: 185 },
        { label: "Mô tả", x: 257, width: 510 },
        { label: "Số tiền", x: 767, width: 260 },
        { label: "Trạng thái", x: 1027, width: 141 },
    ];
    const headerY = 250;
    const rowHeight = 48;

    ctx.fillStyle = "#F7F4EE";
    ctx.fillRect(72, headerY, 1096, rowHeight);
    ctx.strokeStyle = "#E2DDD5";
    ctx.strokeRect(72, headerY, 1096, rowHeight);
    ctx.fillStyle = "#1B3055";
    ctx.font = "700 19px Arial, sans-serif";
    columns.forEach(column => ctx.fillText(column.label, column.x + 12, headerY + 31));

    if (!rows.length) {
        ctx.fillStyle = "#7A7685";
        ctx.font = "20px Arial, sans-serif";
        ctx.fillText("Chưa có giao dịch", 84, headerY + rowHeight + 38);
        return canvas;
    }

    rows.forEach((tx, index) => {
        const y = headerY + rowHeight * (index + 1);
        if (index % 2 === 1) {
            ctx.fillStyle = "#FBF8F1";
            ctx.fillRect(72, y, 1096, rowHeight);
        }
        ctx.strokeStyle = "#E2DDD5";
        ctx.beginPath();
        ctx.moveTo(72, y + rowHeight);
        ctx.lineTo(1168, y + rowHeight);
        ctx.stroke();

        ctx.fillStyle = "#1B3055";
        ctx.font = "18px Arial, sans-serif";
        ctx.fillText(fitCanvasText(ctx, tx.date || "-", columns[0].width - 24), columns[0].x + 12, y + 31);
        ctx.fillText(
            fitCanvasText(ctx, transactionDescription(tx.description), columns[1].width - 24),
            columns[1].x + 12,
            y + 31,
        );
        ctx.font = "700 18px Arial, sans-serif";
        ctx.fillText(fitCanvasText(ctx, formatMoney(tx.amount), columns[2].width - 24), columns[2].x + 12, y + 31);
        ctx.font = "18px Arial, sans-serif";
        ctx.fillText(
            fitCanvasText(ctx, transactionStatusLabel(tx.status), columns[3].width - 24),
            columns[3].x + 12,
            y + 31,
        );
    });

    return canvas;
}

function fitCanvasText(ctx, value, maxWidth) {
    const text = String(value || "-");
    if (ctx.measureText(text).width <= maxWidth) return text;

    let shortened = text;
    while (shortened.length > 1 && ctx.measureText(`${shortened}...`).width > maxWidth) {
        shortened = shortened.slice(0, -1);
    }
    return `${shortened}...`;
}

function canvasToJpegBlob(canvas) {
    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            if (blob) resolve(blob);
            else reject(new Error("Không thể tạo ảnh cho báo cáo PDF."));
        }, "image/jpeg", 0.92);
    });
}

function buildImagePdf(pageImages, imageWidth, imageHeight) {
    const encoder = new TextEncoder();
    const ascii = value => encoder.encode(value);
    const concatBytes = parts => {
        const totalLength = parts.reduce((total, part) => total + part.length, 0);
        const result = new Uint8Array(totalLength);
        let offset = 0;
        parts.forEach(part => {
            result.set(part, offset);
            offset += part.length;
        });
        return result;
    };

    const objectCount = 2 + pageImages.length * 3;
    const objects = new Array(objectCount + 1);
    const pageIds = pageImages.map((_, index) => 3 + index * 3);

    objects[1] = ascii("<< /Type /Catalog /Pages 2 0 R >>");
    objects[2] = ascii(`<< /Type /Pages /Count ${pageIds.length} /Kids [${pageIds.map(id => `${id} 0 R`).join(" ")}] >>`);

    pageImages.forEach((imageBytes, index) => {
        const pageId = pageIds[index];
        const imageId = pageId + 1;
        const contentId = pageId + 2;
        const content = ascii("q\n595.28 0 0 841.89 0 0 cm\n/Im0 Do\nQ\n");

        objects[pageId] = ascii(
            `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im0 ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`,
        );
        objects[imageId] = concatBytes([
            ascii(`<< /Type /XObject /Subtype /Image /Width ${imageWidth} /Height ${imageHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageBytes.length} >>\nstream\n`),
            imageBytes,
            ascii("\nendstream"),
        ]);
        objects[contentId] = concatBytes([
            ascii(`<< /Length ${content.length} >>\nstream\n`),
            content,
            ascii("endstream"),
        ]);
    });

    const parts = [ascii("%PDF-1.4\n%PTBL\n")];
    const offsets = new Array(objectCount + 1).fill(0);
    let byteOffset = parts[0].length;

    for (let objectId = 1; objectId <= objectCount; objectId++) {
        const objectBytes = concatBytes([
            ascii(`${objectId} 0 obj\n`),
            objects[objectId],
            ascii("\nendobj\n"),
        ]);
        offsets[objectId] = byteOffset;
        parts.push(objectBytes);
        byteOffset += objectBytes.length;
    }

    const xrefOffset = byteOffset;
    const xrefEntries = offsets
        .slice(1)
        .map(offset => `${String(offset).padStart(10, "0")} 00000 n \n`)
        .join("");
    parts.push(ascii(
        `xref\n0 ${objectCount + 1}\n0000000000 65535 f \n${xrefEntries}trailer\n<< /Size ${objectCount + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`,
    ));

    return new Blob(parts, { type: "application/pdf" });
}

function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    downloadBlob(filename, blob);
}

function downloadBlob(filename, blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
}
