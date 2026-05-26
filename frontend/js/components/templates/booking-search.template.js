export function bookingSearchTemplate() {
    return `
        <section class="booking-search">
          <!-- Hero Image -->
          <div class="booking-search__picture">
            <img src="assets/images/thumnnail-img.jpeg" alt="Khách sạn sang trọng Đà Nẵng" class="booking-search__picture-img">
          </div>

          <!-- Overlaid text (inside picture via CSS absolute) -->
          <div class="booking-search__container">
            <div class="booking-search__header">
              <h1>Nghỉ dưỡng đẳng cấp tại Đà Nẵng</h1>
              <h2>Tìm kiếm &amp; đặt phòng khách sạn tốt nhất với PTBL Booking Hotel</h2>
            </div>

            <!-- Search Card -->
            <div class="booking-search__body">
              <div class="booking-search__body-wrap">
                <div class="booking-search__search">

                  <!-- Location -->
                  <div class="booking-search__box">
                    <div class="booking-search__label">
                      <i class="fa-solid fa-location-dot"></i>
                      Địa điểm
                    </div>
                    <div class="booking-search__input">
                      <input type="text" name="hotel-location" id="hotel-location" placeholder="Chọn khu vực" readonly>
                      <div class="booking-search__icon">
                        <i class="fa-solid fa-chevron-down"></i>
                      </div>
                    </div>
                    <div class="booking-search__dropdown booking-search__dropdown--location">
                      <div class="location-heading">
                        <h1>Điểm đến phổ biến</h1>
                      </div>
                      <div class="location-option">
                        <ul class="location-list">
                          <li class="location-item">Hải Châu</li>
                          <li class="location-item">Thanh Khê</li>
                          <li class="location-item">Liên Chiểu</li>
                          <li class="location-item">Sơn Trà</li>
                          <li class="location-item">Ngũ Hành Sơn</li>
                          <li class="location-item">Cẩm Lệ</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <!-- Dates -->
                  <div class="booking-search__box">
                    <div class="booking-search__label">
                      <i class="fa-regular fa-calendar"></i>
                      Ngày nhận &amp; trả phòng
                    </div>
                    <div class="booking-search__input">
                      <input type="date" name="start-date" id="start-date" class="booking-search__input-start">
                      <span style="color:var(--text-muted);font-size:1.2rem;">→</span>
                      <input type="date" name="end-date" id="end-date" class="booking-search__input-end">
                    </div>
                    <div class="booking-search__dropdown booking-search__dropdown--duration"></div>
                  </div>

                  <!-- Rooms -->
                  <div class="booking-search__box">
                    <div class="booking-search__label">
                      <i class="fa-solid fa-door-closed"></i>
                      Loại phòng
                    </div>
                    <div class="booking-search__input">
                      <input type="text" name="rooms" id="rooms" readonly placeholder="Chọn loại phòng">
                      <div class="booking-search__icon">
                        <i class="fa-solid fa-chevron-down"></i>
                      </div>
                    </div>
                    <div class="booking-search__dropdown booking-search__dropdown--rooms">
                      <div class="booking-search__rooms-box">
                        <div class="booking-search__info">
                          <i class="fa-solid fa-user"></i>
                          <span>Phòng đơn</span>
                        </div>
                        <div class="booking-search__control">
                          <div class="booking-search__control-btn-minus">
                            <i class="fa-solid fa-minus minus-btn"></i>
                          </div>
                          <span></span>
                          <div class="booking-search__control-btn--plus">
                            <i class="fa-solid fa-plus plus-btn"></i>
                          </div>
                        </div>
                      </div>
                      <div class="booking-search__rooms-box">
                        <div class="booking-search__info">
                          <i class="fa-solid fa-user-group"></i>
                          <span>Phòng đôi</span>
                        </div>
                        <div class="booking-search__control">
                          <div class="booking-search__control-btn-minus booking-search__control-btn--limit">
                            <i class="fa-solid fa-minus minus-btn"></i>
                          </div>
                          <span></span>
                          <div class="booking-search__control-btn--plus">
                            <i class="fa-solid fa-plus plus-btn"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Submit -->
                  <div class="btn booking-search__submit">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    Tìm kiếm
                  </div>

                </div>
              </div>
            </div>
          </div>

          <!-- Spacer so content below isn't covered by the absolute search card -->
          <div class="booking-search-spacer"></div>
        </section>
    `;
}