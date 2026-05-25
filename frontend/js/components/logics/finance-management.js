import { getFinanceSummary, getFinanceTransactions, getMonthlyRevenue } from "../../services/admin.js";

let latestMonthlyData = [];

export function initFinanceManagement() {
    requestAnimationFrame(async () => {
        await loadFinanceData();
        initExportButtons();
    });
}

function formatMoney(value) {
    return `${Number(value || 0).toLocaleString("vi-VN")} VND`;
}

async function loadFinanceData() {
    try {
        const [summary, transactions, monthlyRevenue] = await Promise.all([
            getFinanceSummary(),
            getFinanceTransactions(),
            getMonthlyRevenue(),
        ]);

        document.getElementById("finance-total-earnings").textContent = formatMoney(summary.totalEarnings);
        document.getElementById("finance-pending-payouts").textContent = formatMoney(summary.pendingPayouts);
        document.getElementById("finance-tax-summary").textContent = formatMoney(summary.taxSummary);

        latestMonthlyData = monthlyRevenue?.data || [];
        renderFinanceBarChart(latestMonthlyData);
        renderTransactions(transactions || []);
    } catch (err) {
        const tbody = document.getElementById("transaction-tbody");
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="4" style="padding:18px 16px;color:#b42318;">${err?.data?.message || "Could not load finance data."}</td></tr>`;
        }
        renderFinanceBarChart([]);
    }
}

function renderTransactions(transactions) {
    const tbody = document.getElementById("transaction-tbody");
    if (!tbody) return;

    if (transactions.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="padding:18px 16px;color:#6b7280;">No transactions found</td></tr>`;
        return;
    }

    tbody.innerHTML = transactions.map(tx => `
        <tr style="border-bottom: 1px solid #f0ece4;">
            <td style="padding: 14px 16px; font-size: 13px; color: #4b5563;">${tx.date || "-"}</td>
            <td style="padding: 14px 16px; font-size: 13px; color: #1a1a2e;">${tx.description || "-"}</td>
            <td style="padding: 14px 16px; font-size: 13px; font-weight: 600; color: #1a1a2e;">${formatMoney(tx.amount)}</td>
            <td style="padding: 14px 16px; font-size: 13px; color: #4b5563;">${tx.status || "-"}</td>
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
        ? monthlyData.map(item => (item.month || "").substring(0, 3))
        : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const revenueData = monthlyData.length ? monthlyData.map(item => Number(item.revenue || 0)) : Array(12).fill(0);
    const expensesData = monthlyData.length ? monthlyData.map(item => Number(item.expenses || 0)) : Array(12).fill(0);

    const width = canvas.width;
    const height = canvas.height;
    const paddingLeft = 70;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 40;
    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    const maxSeriesValue = Math.max(...revenueData, ...expensesData, 100000);
    const maxValue = Math.ceil(maxSeriesValue / 100000) * 100000;
    const ySteps = Array.from({ length: 7 }, (_, index) => Math.round((maxValue / 6) * index));

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
    const barPadding = groupWidth * 0.15;
    const barWidth = (groupWidth - barPadding * 2) / 2 - 2;

    months.forEach((month, i) => {
        const groupX = paddingLeft + i * groupWidth + barPadding;
        const revH = (revenueData[i] / maxValue) * chartHeight;
        const revY = paddingTop + chartHeight - revH;
        ctx.fillStyle = "#c9a84c";
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(groupX, revY, barWidth, revH, [3, 3, 0, 0]) : ctx.rect(groupX, revY, barWidth, revH);
        ctx.fill();

        const expH = (expensesData[i] / maxValue) * chartHeight;
        const expY = paddingTop + chartHeight - expH;
        ctx.fillStyle = "#1a1a2e";
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(groupX + barWidth + 3, expY, barWidth, expH, [3, 3, 0, 0]) : ctx.rect(groupX + barWidth + 3, expY, barWidth, expH);
        ctx.fill();

        ctx.fillStyle = "#9aa3b0";
        ctx.textAlign = "center";
        ctx.font = "11px Inter, sans-serif";
        ctx.fillText(month, groupX + barWidth, height - 8);
    });
}

function initExportButtons() {
    const csvBtn = document.getElementById("export-csv-btn");
    const pdfBtn = document.getElementById("export-pdf-btn");

    if (csvBtn) {
        csvBtn.addEventListener("click", () => {
            const rows = document.querySelectorAll("#transaction-tbody tr");
            let csv = "Date,Description,Amount,Status\n";
            rows.forEach(row => {
                const cells = row.querySelectorAll("td");
                if (cells.length === 4) {
                    csv += Array.from(cells).map(c => `"${c.textContent.trim()}"`).join(",") + "\n";
                }
            });
            downloadFile("transactions.csv", csv, "text/csv");
        });
    }

    if (pdfBtn) {
        pdfBtn.addEventListener("click", () => {
            alert("Export PDF will be integrated later.");
        });
    }
}

function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
