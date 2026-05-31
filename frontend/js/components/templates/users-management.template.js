// export function usersManagementTemplate() {
//   return `
//     <div class="users-management__container" style="padding: 24px 0;">
//       <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom: 16px;">
//         <div>
//           <h2 style="margin:0;">Quản lý người dùng</h2>
//           <div style="color:#666; margin-top:4px;">Chỉ dành cho Manager</div>
//         </div>
//         <button class="btn users-management__back-btn" type="button">Quay lại</button>
//       </div>

//       <div class="users-management__status" style="display:none; padding: 12px 14px; border-radius: 8px; background:#fff; border: 1px solid #eee; margin-bottom: 12px;"></div>

//       <div style="background:#fff; border:1px solid #eee; border-radius: 12px; overflow:hidden;">
//         <table style="width:100%; border-collapse:collapse;">
//           <thead>
//             <tr style="background:#f6f7f9; text-align:left;">
//               <th style="padding: 12px 14px;">ID</th>
//               <th style="padding: 12px 14px;">Username</th>
//               <th style="padding: 12px 14px;">Email</th>
//               <th style="padding: 12px 14px;">Họ tên</th>
//               <th style="padding: 12px 14px;">Role</th>
//               <th style="padding: 12px 14px;">Locked until</th>
//               <th style="padding: 12px 14px;">Actions</th>
//             </tr>
//           </thead>
//           <tbody class="users-management__tbody">
//           </tbody>
//         </table>
//       </div>
//     </div>
//   `;
// }
export function usersManagementTemplate() {
  return `
    <div class="users-management__container" style="padding: 24px 0;">
      <div style="margin-bottom: 16px;">
        <h2 style="margin:0; font-size: 18px; font-weight: 500;">Quản lý người dùng</h2>
        <div style="color:#999; margin-top:4px; font-size: 13px;">Chỉ dành cho Manager</div>
      </div>

      <div class="users-management__status" style="display:none; padding: 12px 14px; border-radius: 8px; background:#fff; border: 1px solid #eee; margin-bottom: 12px;"></div>

      <div style="background:#fff; border: 0.5px solid #e5e7eb; border-radius: 12px; overflow:hidden;">
        <table style="width:100%; border-collapse:collapse;">
          <thead>
            <tr style="background:#f8fafc; text-align:left; border-bottom: 0.5px solid #e5e7eb;">
              <th style="padding: 10px 16px; font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500;">ID</th>
              <th style="padding: 10px 16px; font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500;">Username</th>
              <th style="padding: 10px 16px; font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500;">Email</th>
              <th style="padding: 10px 16px; font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500;">Họ tên</th>
              <th style="padding: 10px 16px; font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500;">Vai trò</th>
              <th style="padding: 10px 16px; font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500;">Trạng thái</th>
              <th style="padding: 10px 16px; font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500;">Thao tác</th>
            </tr>
          </thead>
          <tbody class="users-management__tbody">
          </tbody>
        </table>
        <div class="admin-pagination" style="display:flex; gap:6px; padding: 12px 16px; border-top: 0.5px solid #e5e7eb;"></div>
      </div>
    </div>
  `;
}
