// export function homeManagerTemplate() {
//     return `
//         <div style="display: flex; min-height: 100vh; background-color: #f8f9fa; font-family: 'Inter', sans-serif;">
            
//             <!-- SIDEBAR (Thanh chức năng bên trái) -->
//             <div style="width: 240px; background-color: rgb(0, 129, 167); color: white; display: flex; flex-direction: column; padding: 20px 0;">
//                 <div style="padding: 0 24px 30px; font-size: 20px; font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.1);">
//                     StayHub | Admin
//                 </div>
                
//                 <nav style="flex: 1; padding: 20px 0;">
//                     ${renderSidebarItem("Dashboard", "active", "manager__btn-dashboard")}
//                     ${renderSidebarItem("Users", "", "manager__btn-users")}
//                     ${renderSidebarItem("Properties")}
//                     ${renderSidebarItem("Bookings")}
//                     ${renderSidebarItem("Finance")}
//                     ${renderSidebarItem("CMS")}
//                     ${renderSidebarItem("Marketing")}
//                 </nav>

//                 <div style="padding: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
//                     ${renderSidebarItem("Settings")}
//                 </div>
//             </div>

//             <!-- MAIN CONTENT (Phần nội dung chính bên phải) -->
//             <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
                
//                 <!-- Top Search Bar (cố định, không bị swap) -->
//                 <div style="display: flex; justify-content: space-between; align-items: center; padding: 24px 24px 0; margin-bottom: 0;">
//                     <div style="position: relative; width: 400px;">
//                         <input type="text" placeholder="Search across users, hotels..." 
//                                style="width: 100%; padding: 10px 15px; border-radius: 8px; border: 1px solid #ddd; outline: none;">
//                     </div>
//                     <div style="display: flex; align-items: center; gap: 20px;">
//                         <span style="font-size: 20px; cursor: pointer;">🔔</span>
//                     </div>
//                 </div>

//                 <!-- Vùng nội dung động — chỉ phần này bị swap khi đổi route -->
//                 <div id="manager-content" style="flex: 1; padding: 24px; overflow-y: auto;">

//                     <h2 style="margin: 0 0 24px; font-size: 24px;">Dashboard</h2>

//                     <!-- Stats Grid -->
//                     <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px;">
//                         ${renderStatCard("Total Bookings", "1,245", "", "#0081a7")}
//                         ${renderStatCard("Gross Revenue", "36,000", "", "#2a9d8f")}
//                         ${renderStatCard("Pending Properties", "18", "", "#f4a261")}
//                         ${renderStatCard("User Growth", "+352", "", "#e76f51")}
//                     </div>

//                     <!-- Bottom Section: Table & Notifications -->
//                     <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
//                         <div style="background: white; padding: 24px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
//                             <h3 style="margin-top: 0; margin-bottom: 20px;">Recent Booking Activity</h3>
//                             <table style="width: 100%; border-collapse: collapse;">
//                                 <thead>
//                                     <tr style="text-align: left; color: #888; font-size: 13px; border-bottom: 1px solid #eee;">
//                                         <th style="padding-bottom: 15px;">Booking ID</th>
//                                         <th style="padding-bottom: 15px;">Property Name</th>
//                                         <th style="padding-bottom: 15px;">Status</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     ${renderTableRow("10000001", "Luxury Suite", "Confirmed", "#dcfce7", "#15803d")}
//                                     ${renderTableRow("10000002", "Standard Room", "Pending", "#fef9c3", "#a16207")}
//                                 </tbody>
//                             </table>
//                         </div>

//                         <div style="background: white; padding: 24px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
//                             <h3 style="margin-top: 0; margin-bottom: 20px;">Key System Notifications</h3>
//                             <div style="display: flex; flex-direction: column; gap: 15px;">
//                                 ${renderNotiItem("New Property Approval", "3 hours ago")}
//                                 ${renderNotiItem("System Update", "2 days ago")}
//                             </div>
//                         </div>
//                     </div>

//                 </div>
//             </div>
//         </div>
//     `;
// }

// // Các hàm bổ trợ (Helpers)
// // Trong file home-manager.template.js
// function renderSidebarItem(text, status = "", className = "") {
//     const isActive = status === "active";
//     const activeClass = isActive ? "active" : "";
    
//     return `
//         <div class="sidebar-item ${activeClass} ${className}">
//             <span>${text}</span>
//         </div>
//     `;
// }

// function renderStatCard(title, value, trend, color) {
//     return `
//         <div style="background: white; padding: 20px; border-radius: 12px; border-top: 4px solid ${color}; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
//             <div style="color: #666; font-size: 13px; margin-bottom: 8px;">${title}</div>
//             <div style="display: flex; align-items: center; gap: 10px;">
//                 <span style="font-size: 22px; font-weight: bold;">${value}</span>
//                 <span style="color: #22c55e; font-size: 12px;">${trend}</span>
//             </div>
//         </div>
//     `;
// }

// function renderTableRow(id, name, status, bg, color) {
//     return `
//         <tr style="border-bottom: 1px solid #f9f9f9;">
//             <td style="padding: 15px 0; font-size: 14px;">#${id}</td>
//             <td style="padding: 15px 0; font-size: 14px;">${name}</td>
//             <td style="padding: 15px 0;">
//                 <span style="background: ${bg}; color: ${color}; padding: 4px 10px; border-radius: 6px; font-size: 12px;">${status}</span>
//             </td>
//         </tr>
//     `;
// }

// function renderNotiItem(title, time) {
//     return `
//         <div style="display: flex; gap: 10px; align-items: flex-start;">
//             <div style="width: 8px; height: 8px; background: #0081a7; border-radius: 50%; margin-top: 5px;"></div>
//             <div>
//                 <div style="font-size: 13px; font-weight: 600;">${title}</div>
//                 <div style="font-size: 11px; color: #999;">${time}</div>
//             </div>
//         </div>
//     `;
// }
// export function homeManagerTemplate() {
//     return `
//         <div style="display: flex; min-height: 100vh; background-color: #f8f9fa; font-family: 'Inter', sans-serif;">
            
//             <!-- SIDEBAR (Thanh chức năng bên trái) -->
//             <div style="width: 240px; background-color: #0f172a; color: white; display: flex; flex-direction: column; padding: 20px 0;">
//                 <div style="padding: 0 24px 30px; font-size: 20px; font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.1);">
//                     StayHub | Admin
//                 </div>
                
//                 <nav style="flex: 1; padding: 12px 0;">
//                     ${renderSidebarItem("Dashboard", "active")}
//                     ${renderSidebarItem("Users", "", "manager__btn-users")}
//                     ${renderSidebarItem("Properties")}
//                     ${renderSidebarItem("Bookings")}
//                     ${renderSidebarItem("Finance")}
//                     ${renderSidebarItem("CMS")}
//                     ${renderSidebarItem("Marketing")}
//                 </nav>

//                 <div style="padding: 20px; border-top: 1px solid rgba(255,255,255,0.08);">
//                     ${renderSidebarItem("Settings")}
//                 </div>
//             </div>

//             <!-- MAIN CONTENT (Phần nội dung chính bên phải) -->
//             <div style="flex: 1; padding: 24px; overflow-y: auto;">
                
//                 <!-- Top Search Bar -->
//                 <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
//                     <div style="position: relative; width: 400px;">
//                         <input type="text" placeholder="Search across users, hotels..." 
//                                style="width: 100%; padding: 10px 15px; border-radius: 8px; border: 1px solid #ddd; outline: none;">
//                     </div>
//                     <div style="display: flex; align-items: center; gap: 20px;">
//                         <span style="font-size: 20px; cursor: pointer;">🔔</span>
//                     </div>
//                 </div>

//                 <h2 style="margin: 0 0 24px; font-size: 24px;">Dashboard</h2>

//                 <!-- Stats Grid -->
//                 <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px;">
//                     ${renderStatCard("Total Bookings", "1,245", "", "#0081a7")}
//                     ${renderStatCard("Gross Revenue", "36,000", "", "#2a9d8f")}
//                     ${renderStatCard("Pending Properties", "18", "", "#f4a261")}
//                     ${renderStatCard("User Growth", "+352", "", "#e76f51")}
//                 </div>

//                 <!-- Bottom Section: Table & Notifications -->
//                 <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
//                     <div style="background: white; padding: 24px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
//                         <h3 style="margin-top: 0; margin-bottom: 20px;">Recent Booking Activity</h3>
//                         <table style="width: 100%; border-collapse: collapse;">
//                             <thead>
//                                 <tr style="text-align: left; color: #888; font-size: 13px; border-bottom: 1px solid #eee;">
//                                     <th style="padding-bottom: 15px;">Booking ID</th>
//                                     <th style="padding-bottom: 15px;">Property Name</th>
//                                     <th style="padding-bottom: 15px;">Status</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 ${renderTableRow("10000001", "Luxury Suite", "Confirmed", "#dcfce7", "#15803d")}
//                                 ${renderTableRow("10000002", "Standard Room", "Pending", "#fef9c3", "#a16207")}
//                             </tbody>
//                         </table>
//                     </div>

//                     <div style="background: white; padding: 24px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
//                         <h3 style="margin-top: 0; margin-bottom: 20px;">Key System Notifications</h3>
//                         <div style="display: flex; flex-direction: column; gap: 15px;">
//                             ${renderNotiItem("New Property Approval", "3 hours ago")}
//                             ${renderNotiItem("System Update", "2 days ago")}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     `;
// }

// // Các hàm bổ trợ (Helpers)
// // Trong file home-manager.template.js
// function renderSidebarItem(text, status = "", className = "") {
//     const isActive = status === "active";
//     const activeClass = isActive ? "active" : "";
    
//     return `
//         <div class="sidebar-item ${activeClass} ${className}">
//             <span>${text}</span>
//         </div>
//     `;
// }

// function renderStatCard(title, value, trend, color) {
//     return `
//         <div style="background: white; padding: 20px; border-radius: 12px; border-top: 4px solid ${color}; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
//             <div style="color: #666; font-size: 13px; margin-bottom: 8px;">${title}</div>
//             <div style="display: flex; align-items: center; gap: 10px;">
//                 <span style="font-size: 22px; font-weight: bold;">${value}</span>
//                 <span style="color: #22c55e; font-size: 12px;">${trend}</span>
//             </div>
//         </div>
//     `;
// }

// function renderTableRow(id, name, status, bg, color) {
//     return `
//         <tr style="border-bottom: 1px solid #f9f9f9;">
//             <td style="padding: 15px 0; font-size: 14px;">#${id}</td>
//             <td style="padding: 15px 0; font-size: 14px;">${name}</td>
//             <td style="padding: 15px 0;">
//                 <span style="background: ${bg}; color: ${color}; padding: 4px 10px; border-radius: 6px; font-size: 12px;">${status}</span>
//             </td>
//         </tr>
//     `;
// }

// function renderNotiItem(title, time) {
//     return `
//         <div style="display: flex; gap: 10px; align-items: flex-start;">
//             <div style="width: 8px; height: 8px; background: #0081a7; border-radius: 50%; margin-top: 5px;"></div>
//             <div>
//                 <div style="font-size: 13px; font-weight: 600;">${title}</div>
//                 <div style="font-size: 11px; color: #999;">${time}</div>
//             </div>
//         </div>
//     `;
// }
//==================================================================================================
// export function homeManagerTemplate() {
//     return `
//         <div style="display: flex; min-height: 100vh; background-color: #f8f9fa; font-family: 'Inter', sans-serif;">
            
//             <!-- SIDEBAR (Thanh chức năng bên trái) -->
//             <div style="width: 240px; background-color: #0f172a; color: white; display: flex; flex-direction: column; padding: 20px 0;">
//                 <div style="padding: 0 24px 30px; font-size: 20px; font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.1);">
//                     StayHub | Admin
//                 </div>
                
//                 <nav style="flex: 1; padding: 12px 0;">
//                     ${renderSidebarItem("Dashboard", "active")}
//                     ${renderSidebarItem("Users", "", "manager__btn-users")}
//                     ${renderSidebarItem("Properties")}
//                     ${renderSidebarItem("Bookings")}
//                     ${renderSidebarItem("Finance")}
//                     ${renderSidebarItem("CMS")}
//                     ${renderSidebarItem("Marketing")}
//                 </nav>
 
//                 <div style="padding: 20px; border-top: 1px solid rgba(255,255,255,0.08);">
//                     ${renderSidebarItem("Settings")}
//                 </div>
//             </div>
 
//             <!-- MAIN CONTENT (Phần nội dung chính bên phải) -->
//             <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
                
//                 <!-- Top Search Bar (cố định, không bị swap) -->
//                 <div style="display: flex; justify-content: space-between; align-items: center; padding: 24px 24px 0; margin-bottom: 0;">
//                     <div style="position: relative; width: 400px;">
//                         <input type="text" placeholder="Search across users, hotels..." 
//                                style="width: 100%; padding: 10px 15px; border-radius: 8px; border: 1px solid #ddd; outline: none;">
//                     </div>
//                     <div style="display: flex; align-items: center; gap: 20px;">
//                         <span style="font-size: 20px; cursor: pointer;">🔔</span>
//                     </div>
//                 </div>
 
//                 <!-- Vùng nội dung động — chỉ phần này bị swap khi đổi route -->
//                 <div id="manager-content" style="flex: 1; padding: 24px; overflow-y: auto;">
 
//                     <h2 style="margin: 0 0 24px; font-size: 24px;">Dashboard</h2>
 
//                     <!-- Stats Grid -->
//                     <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px;">
//                         ${renderStatCard("Total Bookings", "1,245", "", "#0081a7")}
//                         ${renderStatCard("Gross Revenue", "36,000", "", "#2a9d8f")}
//                         ${renderStatCard("Pending Properties", "18", "", "#f4a261")}
//                         ${renderStatCard("User Growth", "+352", "", "#e76f51")}
//                     </div>
 
//                     <!-- Bottom Section: Table & Notifications -->
//                     <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
//                         <div style="background: white; padding: 24px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
//                             <h3 style="margin-top: 0; margin-bottom: 20px;">Recent Booking Activity</h3>
//                             <table style="width: 100%; border-collapse: collapse;">
//                                 <thead>
//                                     <tr style="text-align: left; color: #888; font-size: 13px; border-bottom: 1px solid #eee;">
//                                         <th style="padding-bottom: 15px;">Booking ID</th>
//                                         <th style="padding-bottom: 15px;">Property Name</th>
//                                         <th style="padding-bottom: 15px;">Status</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     ${renderTableRow("10000001", "Luxury Suite", "Confirmed", "#dcfce7", "#15803d")}
//                                     ${renderTableRow("10000002", "Standard Room", "Pending", "#fef9c3", "#a16207")}
//                                 </tbody>
//                             </table>
//                         </div>
 
//                         <div style="background: white; padding: 24px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
//                             <h3 style="margin-top: 0; margin-bottom: 20px;">Key System Notifications</h3>
//                             <div style="display: flex; flex-direction: column; gap: 15px;">
//                                 ${renderNotiItem("New Property Approval", "3 hours ago")}
//                                 ${renderNotiItem("System Update", "2 days ago")}
//                             </div>
//                         </div>
//                     </div>
 
//                 </div>
//             </div>
//         </div>
//     `;
// }
 
// // Các hàm bổ trợ (Helpers)
// // Trong file home-manager.template.js
// function renderSidebarItem(text, status = "", className = "") {
//     const isActive = status === "active";
//     const activeClass = isActive ? "active" : "";
    
//     return `
//         <div class="sidebar-item ${activeClass} ${className}">
//             <span>${text}</span>
//         </div>
//     `;
// }
 
// function renderStatCard(title, value, trend, color) {
//     return `
//         <div style="background: white; padding: 20px; border-radius: 12px; border-top: 4px solid ${color}; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
//             <div style="color: #666; font-size: 13px; margin-bottom: 8px;">${title}</div>
//             <div style="display: flex; align-items: center; gap: 10px;">
//                 <span style="font-size: 22px; font-weight: bold;">${value}</span>
//                 <span style="color: #22c55e; font-size: 12px;">${trend}</span>
//             </div>
//         </div>
//     `;
// }
 
// function renderTableRow(id, name, status, bg, color) {
//     return `
//         <tr style="border-bottom: 1px solid #f9f9f9;">
//             <td style="padding: 15px 0; font-size: 14px;">#${id}</td>
//             <td style="padding: 15px 0; font-size: 14px;">${name}</td>
//             <td style="padding: 15px 0;">
//                 <span style="background: ${bg}; color: ${color}; padding: 4px 10px; border-radius: 6px; font-size: 12px;">${status}</span>
//             </td>
//         </tr>
//     `;
// }
 
// function renderNotiItem(title, time) {
//     return `
//         <div style="display: flex; gap: 10px; align-items: flex-start;">
//             <div style="width: 8px; height: 8px; background: #0081a7; border-radius: 50%; margin-top: 5px;"></div>
//             <div>
//                 <div style="font-size: 13px; font-weight: 600;">${title}</div>
//                 <div style="font-size: 11px; color: #999;">${time}</div>
//             </div>
//         </div>
//     `;
// }
//==================================================================================================
// export function homeManagerTemplate() {
//     return `
//         <div class="home-manager__container" style="padding: 24px; background-color: #f8f9fa; min-height: 100vh;">
//             <!-- Header Section -->
//             <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
//                 <div>
//                     <h2 style="margin: 0; font-size: 28px; color: #333;">Dashboard</h2>
//                     <p style="margin: 4px 0 0; color: #666;">Chào mừng quay trở lại, Admin!</p>
//                 </div>
//                 <div style="display: flex; gap: 12px;">
//                     <button class="btn manager__btn-users" style="background-color: #0091ff; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 500;">
//                         Quản lý người dùng
//                     </button>
//                     <button class="btn" style="background-color: white; border: 1px solid #ddd; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
//                         Xuất báo cáo
//                     </button>
//                 </div>
//             </div>

//             <!-- Stats Grid -->
//             <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
//                 ${renderStatCard("Total Bookings", "1,245", "+15%", "#e3f2fd", "#0091ff")}
//                 ${renderStatCard("Gross Revenue", "$145,320", "+8%", "#e8f5e9", "#4caf50")}
//                 ${renderStatCard("Pending Requests", "18", "", "#fff3e0", "#ff9800")}
//                 ${renderStatCard("User Growth", "+352", "+12%", "#f3e5f5", "#9c27b0")}
//             </div>

//             <!-- Main Content Area -->
//             <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
//                 <!-- Recent Bookings Table -->
//                 <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #eee; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
//                     <h3 style="margin-top: 0; margin-bottom: 20px;">Recent Booking Activity</h3>
//                     <table style="width: 100%; border-collapse: collapse; text-align: left;">
//                         <thead>
//                             <tr style="border-bottom: 2px solid #f8f9fa; color: #888; font-size: 14px;">
//                                 <th style="padding: 12px 8px;">Booking ID</th>
//                                 <th style="padding: 12px 8px;">Property</th>
//                                 <th style="padding: 12px 8px;">Check-In</th>
//                                 <th style="padding: 12px 8px;">Status</th>
//                             </tr>
//                         </thead>
//                         <tbody style="font-size: 14px;">
//                             ${renderTableRow("10000001", "Luxury Suite", "03/02/2026", "Confirmed", "#e8f5e9", "#2e7d32")}
//                             ${renderTableRow("10000002", "Standard Room", "03/03/2026", "Pending", "#fff3e0", "#ed6c02")}
//                             ${renderTableRow("10000003", "Deluxe Ocean", "03/04/2026", "Cancelled", "#ffebee", "#d32f2f")}
//                         </tbody>
//                     </table>
//                 </div>

//                 <!-- System Notifications Side -->
//                 <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #eee;">
//                     <h3 style="margin-top: 0; margin-bottom: 20px;">Key System Notifications</h3>
//                     <div style="display: flex; flex-direction: column; gap: 16px;">
//                         ${renderNotification("Yêu cầu phê duyệt mới", "Khách sạn Sunrise yêu cầu duyệt phòng.", "3 giờ trước")}
//                         ${renderNotification("Cập nhật hệ thống", "Phiên bản v2.1 đã được triển khai.", "1 ngày trước")}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     `;
// }

// // Hàm bổ trợ để render các thẻ thống kê
// function renderStatCard(title, value, trend, bgColor, iconColor) {
//     return `
//         <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #eee; display: flex; flex-direction: column; gap: 8px;">
//             <span style="color: #666; font-size: 14px; font-weight: 500;">${title}</span>
//             <div style="display: flex; align-items: baseline; gap: 8px;">
//                 <span style="font-size: 24px; font-weight: bold;">${value}</span>
//                 <span style="color: #4caf50; font-size: 12px; font-weight: bold;">${trend}</span>
//             </div>
//             <div style="width: 40px; height: 4px; background: ${iconColor}; border-radius: 2px; margin-top: 4px;"></div>
//         </div>
//     `;
// }

// function renderTableRow(id, name, date, status, statusBg, statusColor) {
//     return `
//         <tr style="border-bottom: 1px solid #f8f9fa;">
//             <td style="padding: 16px 8px; font-weight: 500;">#${id}</td>
//             <td style="padding: 16px 8px;">${name}</td>
//             <td style="padding: 16px 8px; color: #666;">${date}</td>
//             <td style="padding: 16px 8px;">
//                 <span style="background: ${statusBg}; color: ${statusColor}; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
//                     ${status}
//                 </span>
//             </td>
//         </tr>
//     `;
// }

// function renderNotification(title, desc, time) {
//     return `
//         <div style="border-left: 4px solid #0091ff; padding-left: 12px;">
//             <div style="font-weight: 600; font-size: 14px;">${title}</div>
//             <div style="font-size: 13px; color: #666; margin: 4px 0;">${desc}</div>
//             <div style="font-size: 11px; color: #999;">${time}</div>
//         </div>
//     `;
// }
export function homeManagerTemplate() {
    return `
        <div style="display: flex; min-height: 100vh; background-color: #f8f9fa; font-family: 'Inter', sans-serif;">
            
            <!-- SIDEBAR (Thanh chức năng bên trái) -->
            <div style="width: 240px; background-color: #0f172a; color: white; display: flex; flex-direction: column; padding: 20px 0;">
                <div style="padding: 16px 16px 16px; border-bottom: 1px solid rgba(255,255,255,0.08);">
                    <div style="font-size: 10px; color: #475569; letter-spacing: 1px; text-transform: uppercase; font-weight: 500;">PTBL Booking</div>
                    <div style="font-size: 16px; font-weight: 500; color: #f1f5f9; margin-top: 2px;">Admin Panel</div>
                </div>
                
                <nav style="flex: 1; padding: 12px 0;">
                    ${renderSidebarItem("Dashboard", "active", "manager__btn-dashboard")}
                    ${renderSidebarItem("Users", "", "manager__btn-users")}
                    ${renderSidebarItem("Properties")}
                    ${renderSidebarItem("Bookings")}
                    ${renderSidebarItem("Finance")}
                    ${renderSidebarItem("CMS")}
                    ${renderSidebarItem("Marketing")}
                </nav>

                <div style="padding: 20px; border-top: 1px solid rgba(255,255,255,0.08);">
                    ${renderSidebarItem("Settings")}
                </div>
            </div>

            <!-- MAIN CONTENT (Phần nội dung chính bên phải) -->
            <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
                
                <!-- Top Search Bar (cố định, không bị swap) -->
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 24px 24px 0; margin-bottom: 0;">
                    <div style="position: relative; width: 400px;">
                        <input type="text" placeholder="Search across users, hotels..." 
                               style="width: 100%; padding: 10px 15px; border-radius: 8px; border: 1px solid #ddd; outline: none;">
                    </div>
                    <div style="display: flex; align-items: center; gap: 20px;">
                        <span style="font-size: 20px; cursor: pointer;">🔔</span>
                    </div>
                </div>

                <!-- Vùng nội dung động — chỉ phần này bị swap khi đổi route -->
                <div id="manager-content" style="flex: 1; padding: 24px; overflow-y: auto;">

                    <h2 style="margin: 0 0 24px; font-size: 24px;">Dashboard</h2>

                    <!-- Stats Grid -->
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px;">
                        ${renderStatCard("Total Bookings", "1,245", "", "#0081a7")}
                        ${renderStatCard("Gross Revenue", "36,000", "", "#2a9d8f")}
                        ${renderStatCard("Pending Properties", "18", "", "#f4a261")}
                        ${renderStatCard("User Growth", "+352", "", "#e76f51")}
                    </div>

                    <!-- Bottom Section: Table & Notifications -->
                    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
                        <div style="background: white; padding: 24px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                            <h3 style="margin-top: 0; margin-bottom: 20px;">Recent Booking Activity</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                <thead>
                                    <tr style="text-align: left; color: #888; font-size: 13px; border-bottom: 1px solid #eee;">
                                        <th style="padding-bottom: 15px;">Booking ID</th>
                                        <th style="padding-bottom: 15px;">Property Name</th>
                                        <th style="padding-bottom: 15px;">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${renderTableRow("10000001", "Luxury Suite", "Confirmed", "#dcfce7", "#15803d")}
                                    ${renderTableRow("10000002", "Standard Room", "Pending", "#fef9c3", "#a16207")}
                                </tbody>
                            </table>
                        </div>

                        <div style="background: white; padding: 24px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                            <h3 style="margin-top: 0; margin-bottom: 20px;">Key System Notifications</h3>
                            <div style="display: flex; flex-direction: column; gap: 15px;">
                                ${renderNotiItem("New Property Approval", "3 hours ago")}
                                ${renderNotiItem("System Update", "2 days ago")}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    `;
}

// Các hàm bổ trợ (Helpers)
// Trong file home-manager.template.js
const SIDEBAR_ICONS = {
    "Dashboard": `<svg class="sidebar-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor"/><rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor"/><rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor"/><rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor"/></svg>`,
    "Users":     `<svg class="sidebar-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="5" r="2.5" stroke="currentColor" stroke-width="1.5"/><path d="M1 13.5c0-2.5 2-4 5-4s5 1.5 5 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="5" r="2" stroke="currentColor" stroke-width="1.3"/><path d="M12 10c1.5 0 3 .8 3 3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
    "Properties":`<svg class="sidebar-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 14V7l7-5 7 5v7H1z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><rect x="6" y="9" width="4" height="5" rx="0.5" stroke="currentColor" stroke-width="1.3"/></svg>`,
    "Bookings":  `<svg class="sidebar-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M5 3V1.5M11 3V1.5M2 7h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M5 10h2m2 0h2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
    "Finance":   `<svg class="sidebar-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="4" width="14" height="9" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M4 4V3a1 1 0 011-1h6a1 1 0 011 1v1" stroke="currentColor" stroke-width="1.3"/><circle cx="8" cy="8.5" r="1.5" stroke="currentColor" stroke-width="1.3"/></svg>`,
    "CMS":       `<svg class="sidebar-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="12" height="12" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M5 6h6M5 9h4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
    "Marketing": `<svg class="sidebar-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 10V6l5-3 5 3v4l-5 3-5-3z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M7 13v2M9 13v2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
    "Settings":  `<svg class="sidebar-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="2.5" stroke="currentColor" stroke-width="1.5"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.2 3.2l1.4 1.4M11.4 11.4l1.4 1.4M3.2 12.8l1.4-1.4M11.4 4.6l1.4-1.4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
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

function renderStatCard(title, value, trend, color) {
    return `
        <div style="background: white; padding: 20px; border-radius: 12px; border-top: 4px solid ${color}; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <div style="color: #666; font-size: 13px; margin-bottom: 8px;">${title}</div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 22px; font-weight: bold;">${value}</span>
                <span style="color: #22c55e; font-size: 12px;">${trend}</span>
            </div>
        </div>
    `;
}

function renderTableRow(id, name, status, bg, color) {
    return `
        <tr style="border-bottom: 1px solid #f9f9f9;">
            <td style="padding: 15px 0; font-size: 14px;">#${id}</td>
            <td style="padding: 15px 0; font-size: 14px;">${name}</td>
            <td style="padding: 15px 0;">
                <span style="background: ${bg}; color: ${color}; padding: 4px 10px; border-radius: 6px; font-size: 12px;">${status}</span>
            </td>
        </tr>
    `;
}

function renderNotiItem(title, time) {
    return `
        <div style="display: flex; gap: 10px; align-items: flex-start;">
            <div style="width: 8px; height: 8px; background: #0081a7; border-radius: 50%; margin-top: 5px;"></div>
            <div>
                <div style="font-size: 13px; font-weight: 600;">${title}</div>
                <div style="font-size: 11px; color: #999;">${time}</div>
            </div>
        </div>
    `;
}