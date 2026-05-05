export function hotelsManagementTemplate() {
  return `
    <div class="hotels-management__container">
      <!-- Header -->
      <div class="hotels-management__header">
        <div>
          <h2 class="hotels-management__title">Hotel Inventory</h2>
          <p class="hotels-management__subtitle">Manage your properties</p>
        </div>
        <button class="hotels-management__add-btn">
          <i class="fa fa-plus"></i> Add Property
        </button>
      </div>

      <!-- Status Message -->
      <div class="hotels-management__status" style="display:none; padding: 12px 14px; border-radius: 8px; background:#fff; border: 1px solid #eee; margin-bottom: 12px;"></div>

      <!-- Loading State -->
      <div class="hotels-management__loading" style="display: none; text-align: center; padding: 40px;">
        <p>Loading hotels...</p>
      </div>

      <!-- Cards Grid -->
      <div class="hotels-management__grid">
        <!-- Cards will be rendered here -->
      </div>

      <!-- Empty State -->
      <div class="hotels-management__empty" style="display: none; text-align: center; padding: 60px 20px;">
        <p style="color: #999; font-size: 16px;">No hotels found</p>
      </div>
    </div>
  `;
}