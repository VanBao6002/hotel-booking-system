export function changePasswordTemplate() {
    return `
        <div class="setting">
        <div class="grid">
          <div class="change-password">
            <div class="change-password__title">
              <i class="fa-solid fa-lock"></i>
              Đổi Mật Khẩu
            </div>
            <div class="change-password__wrap">

              <!-- Message banner (animated) -->
              <div class="change-password__message" id="cpMessage"></div>

              <!-- Mật khẩu hiện tại -->
              <div class="group-info">
                <label for="currentPassword">
                  <i class="fa-solid fa-key" style="margin-right:6px;color:var(--gold-color);font-size:1.3rem;"></i>
                  Mật khẩu hiện tại
                </label>
                <div class="cp-input-wrap">
                  <input type="password" name="currentPassword" id="currentPassword" placeholder="Nhập mật khẩu hiện tại">
                  <button type="button" class="cp-eye-toggle" data-target="currentPassword" tabindex="-1" aria-label="Hiện/ẩn mật khẩu">
                    <i class="fa-regular fa-eye"></i>
                  </button>
                </div>
              </div>

              <!-- Mật khẩu mới -->
              <div class="group-info">
                <label for="newPassword">
                  <i class="fa-solid fa-lock-open" style="margin-right:6px;color:var(--gold-color);font-size:1.3rem;"></i>
                  Mật khẩu mới
                </label>
                <div class="cp-input-wrap">
                  <input type="password" name="newPassword" id="newPassword" placeholder="Tối thiểu 8 ký tự, chữ hoa, số, ký tự đặc biệt">
                  <button type="button" class="cp-eye-toggle" data-target="newPassword" tabindex="-1" aria-label="Hiện/ẩn mật khẩu">
                    <i class="fa-regular fa-eye"></i>
                  </button>
                </div>
                <!-- Password strength bar -->
                <div class="cp-strength" id="cpStrength" style="display:none;">
                  <div class="cp-strength__bar">
                    <div class="cp-strength__fill" id="cpStrengthFill"></div>
                  </div>
                  <div class="cp-strength__label" id="cpStrengthLabel"></div>
                </div>
                <div class="error-message" id="newPasswordError"></div>
              </div>

              <!-- Xác nhận mật khẩu mới -->
              <div class="group-info">
                <label for="confirmPassword">
                  <i class="fa-solid fa-shield-halved" style="margin-right:6px;color:var(--gold-color);font-size:1.3rem;"></i>
                  Xác nhận mật khẩu mới
                </label>
                <div class="cp-input-wrap">
                  <input type="password" name="confirmPassword" id="confirmPassword" placeholder="Nhập lại mật khẩu mới">
                  <button type="button" class="cp-eye-toggle" data-target="confirmPassword" tabindex="-1" aria-label="Hiện/ẩn mật khẩu">
                    <i class="fa-regular fa-eye"></i>
                  </button>
                </div>
                <div class="error-message" id="confirmPasswordError"></div>
              </div>

              <div class="change-password__divider"></div>

              <!-- Save button -->
              <div class="save-info__btn" id="cpSaveBtn">
                <div class="cp-btn-spinner"></div>
                <span class="cp-btn-text">Xác nhận đổi mật khẩu</span>
              </div>

            </div>
          </div>
        </div>
      </div>
    `;
}
