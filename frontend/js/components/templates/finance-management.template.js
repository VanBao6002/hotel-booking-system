export function financeManagementTemplate() {
    return `
        <div style="font-family: 'Inter', sans-serif; color: #1a1a2e;">

            <!-- Summary Cards -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 28px;">
                ${renderFinanceCard("Total Earnings", "$5,240,000", "#c9a84c", "#1a1a2e")}
                ${renderFinanceCard("Pending Payouts", "$120,500", "#1a1a2e", "#1a1a2e")}
                ${renderFinanceCard("Tax Summary", "$890,000", "#1a1a2e", "#1a1a2e")}
            </div>

            <!-- Monthly Revenue Distribution Chart -->
            <div style="background: white; border-radius: 12px; padding: 28px; border: 1px solid #e8e4dc; margin-bottom: 28px;">
                <h3 style="margin: 0 0 24px; font-size: 18px; font-weight: 600; color: #1a1a2e;">Monthly Revenue Distribution</h3>
                <div style="position: relative;">
                    <canvas id="finance-bar-chart" style="width: 100%; height: 280px;"></canvas>
                </div>
            </div>

            <!-- Transaction History -->
            <div style="background: white; border-radius: 12px; padding: 28px; border: 1px solid #e8e4dc;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #1a1a2e;">Transaction History</h3>
                    <div style="display: flex; gap: 10px;">
                        <button id="export-csv-btn" style="padding: 9px 18px; background: linear-gradient(135deg, #c9a84c, #e8cc7a); color: #1a1a2e; border: none; border-radius: 7px; font-size: 13px; font-weight: 600; cursor: pointer; transition: opacity 0.2s;" onmouseenter="this.style.opacity='0.85'" onmouseleave="this.style.opacity='1'">Export CSV</button>
                        <button id="export-pdf-btn" style="padding: 9px 18px; background: linear-gradient(135deg, #c9a84c, #e8cc7a); color: #1a1a2e; border: none; border-radius: 7px; font-size: 13px; font-weight: 600; cursor: pointer; transition: opacity 0.2s;" onmouseenter="this.style.opacity='0.85'" onmouseleave="this.style.opacity='1'">Export PDF</button>
                    </div>
                </div>

                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 2px solid #e8e4dc; background: #fafaf8;">
                            <th style="padding: 12px 16px; text-align: left; font-size: 13px; color: #4b5563; font-weight: 600;">Date</th>
                            <th style="padding: 12px 16px; text-align: left; font-size: 13px; color: #4b5563; font-weight: 600;">Description</th>
                            <th style="padding: 12px 16px; text-align: left; font-size: 13px; color: #4b5563; font-weight: 600;">Amount</th>
                            <th style="padding: 12px 16px; text-align: left; font-size: 13px; color: #4b5563; font-weight: 600;">Status</th>
                        </tr>
                    </thead>
                    <tbody id="transaction-tbody">
                        ${renderTransactionRow("Oct 25, 2023", "The Oceanfront Villa Booking", "$3,500", "Completed - Gold status")}
                        ${renderTransactionRow("Sep 21, 2023", "The Oceanfront Villa Booking", "$1,500", "Completed - Gold status")}
                        ${renderTransactionRow("Aug 27, 2023", "The Sunset Hilltop Retreat", "$1,000", "Completed - Gold status")}
                        ${renderTransactionRow("Aug 10, 2023", "The Presidential Suite Booking", "$4,200", "Completed - Gold status")}
                        ${renderTransactionRow("Jul 15, 2023", "The Oceanfront Villa Booking", "$2,800", "Completed - Gold status")}
                        ${renderTransactionRow("Jun 30, 2023", "The Sunset Hilltop Retreat", "$1,750", "Pending")}
                        ${renderTransactionRow("Jun 12, 2023", "The Presidential Suite Booking", "$5,000", "Completed - Gold status")}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderFinanceCard(title, value, bgColor, textColor) {
    const isGold = bgColor === "#c9a84c";
    return `
        <div style="background: ${isGold ? 'linear-gradient(135deg, #c9a84c, #e8cc7a)' : bgColor}; padding: 28px 28px; border-radius: 10px; border: 1px solid ${isGold ? 'transparent' : '#2d2d44'};">
            <div style="font-size: 13px; color: ${isGold ? '#5a3e00' : '#9aa3b0'}; margin-bottom: 10px; font-weight: 500;">${title}</div>
            <div style="font-size: 32px; font-weight: 700; color: ${isGold ? '#1a1a2e' : '#f0e6c8'}; line-height: 1;">${value}</div>
        </div>
    `;
}

function renderTransactionRow(date, desc, amount, status) {
    return `
        <tr style="border-bottom: 1px solid #f0ece4;">
            <td style="padding: 14px 16px; font-size: 13px; color: #4b5563;">${date}</td>
            <td style="padding: 14px 16px; font-size: 13px; color: #1a1a2e;">${desc}</td>
            <td style="padding: 14px 16px; font-size: 13px; font-weight: 600; color: #1a1a2e;">${amount}</td>
            <td style="padding: 14px 16px; font-size: 13px; color: #4b5563;">${status}</td>
        </tr>
    `;
}