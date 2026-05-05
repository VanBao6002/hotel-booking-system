export function initFinanceManagement() {
    // Render bar chart after DOM is ready
    requestAnimationFrame(() => {
        renderFinanceBarChart();
        initExportButtons();
    });
}

function renderFinanceBarChart() {
    const canvas = document.getElementById("finance-bar-chart");
    if (!canvas) return;

    // Set explicit dimensions
    canvas.width = canvas.parentElement.offsetWidth || 900;
    canvas.height = 280;

    const ctx = canvas.getContext("2d");

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Two data series matching the mockup
    const revenueData = [34000, 25000, 32000, 36000, 51000, 41000, 48000, 55000, 57000, 50000, 45000, 43000];
    const expensesData = [19000, 24000, 28000, 25000, 41000, 30000, 35000, 46000, 49000, 44000, 43000, 31000];

    const width = canvas.width;
    const height = canvas.height;
    const paddingLeft = 70;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 40;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const maxValue = 60000;
    const ySteps = [0, 10000, 20000, 30000, 40000, 50000, 60000];

    // Background
    ctx.clearRect(0, 0, width, height);

    // Draw Y axis grid lines and labels
    ctx.font = "11px Inter, sans-serif";
    ctx.fillStyle = "#9aa3b0";
    ctx.textAlign = "right";
    ySteps.forEach(val => {
        const y = paddingTop + chartHeight - (val / maxValue) * chartHeight;
        ctx.fillText("$" + (val >= 1000 ? (val / 1000).toFixed(0) + ",000" : val), paddingLeft - 8, y + 4);

        ctx.beginPath();
        ctx.strokeStyle = "#f0ece4";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.moveTo(paddingLeft, y);
        ctx.lineTo(paddingLeft + chartWidth, y);
        ctx.stroke();
        ctx.setLineDash([]);
    });

    // Bar dimensions
    const groupWidth = chartWidth / months.length;
    const barPadding = groupWidth * 0.15;
    const barWidth = (groupWidth - barPadding * 2) / 2 - 2;

    months.forEach((month, i) => {
        const groupX = paddingLeft + i * groupWidth + barPadding;

        // Revenue bar (gold)
        const revH = (revenueData[i] / maxValue) * chartHeight;
        const revY = paddingTop + chartHeight - revH;
        ctx.fillStyle = "#c9a84c";
        ctx.beginPath();
        ctx.roundRect
            ? ctx.roundRect(groupX, revY, barWidth, revH, [3, 3, 0, 0])
            : ctx.rect(groupX, revY, barWidth, revH);
        ctx.fill();

        // Expenses bar (dark)
        const expH = (expensesData[i] / maxValue) * chartHeight;
        const expY = paddingTop + chartHeight - expH;
        ctx.fillStyle = "#1a1a2e";
        ctx.beginPath();
        ctx.roundRect
            ? ctx.roundRect(groupX + barWidth + 3, expY, barWidth, expH, [3, 3, 0, 0])
            : ctx.rect(groupX + barWidth + 3, expY, barWidth, expH);
        ctx.fill();

        // X axis label
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
                const line = Array.from(cells).map(c => `"${c.textContent.trim()}"`).join(",");
                csv += line + "\n";
            });
            downloadFile("transactions.csv", csv, "text/csv");
        });
    }

    if (pdfBtn) {
        pdfBtn.addEventListener("click", () => {
            alert("Export PDF — tính năng sẽ tích hợp thư viện PDF sau.");
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