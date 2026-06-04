export function hotelsManagementTemplate() {
  return `
    <div class="hotels-management__container">
      <!-- Header -->
      <div class="hotels-management__header">
        <div>
          <h2 class="hotels-management__title">Danh Sách Khách Sạn</h2>
          <p class="hotels-management__subtitle">Quản lý các khách sạn trong hệ thống</p>
        </div>
        <button class="hotels-management__add-btn">
          <i class="fa fa-plus"></i> Thêm Khách Sạn
        </button>
      </div>

      <!-- Status Message -->
      <div class="hotels-management__status" style="display:none; padding: 12px 14px; border-radius: 8px; background:#fff; border: 1px solid #eee; margin-bottom: 12px;"></div>

      <!-- Loading State -->
      <div class="hotels-management__loading" style="display: none; text-align: center; padding: 40px;">
        <p>Đang tải khách sạn...</p>
      </div>

      <!-- Cards Grid -->
      <div class="hotels-management__grid">
        <!-- Cards will be rendered here -->
      </div>

      <!-- Empty State -->
      <div class="hotels-management__empty" style="display: none; text-align: center; padding: 60px 20px;">
        <p style="color: #999; font-size: 16px;">Chưa có khách sạn</p>
      </div>
    </div>
  `;
}
