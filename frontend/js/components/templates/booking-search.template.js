export function bookingSearchTemplate() {
    return `
        <section class="booking-search">
          <div class="grid">
            <div class="booking-search__picture">
              <img src="assets/images/thumnnail-img.jpeg" alt="booking-search-img" class="booking-search__picture-img">
            </div>
            <div class="booking-search__container">
              <div class="booking-search__header">
                <h1>Đặt khách sạn giá tốt với PTBL Booking Hotel</h1>
                <h2>Khám phá nhiều lựa chọn đối với khách sạn</h2>
              </div>
              <div class="booking-search__body">
                <div class="booking-search__body-wrap">
                  <div class="booking-search__search">
                    <div class="booking-search__box">
                      <div class="booking-search__label">
                        Địa điểm khách sạn:
                      </div>
                      <div class="booking-search__input">
                        <input type="text" name="hotel-location" id="hotel-location" placeholder="Khu vực" readonly>
                        <div class="booking-search__icon">
                          <i class="fa-solid fa-location-dot"></i>
                        </div>
                      </div>

                      <div class="booking-search__dropdown booking-search__dropdown--location">
                        <div class="location-heading">
                          <h1>Điểm đến</h1>
                        </div>
                        <div class="location-option">
                          <ul class="location-list">
                            <li class="location-item">Hải Châu</li>
                            <li class="location-item">Thanh Khê</li>
                            <li class="location-item">Liên Chiểu</li>
                            <li class="location-item">Sơn Trà</li>
                            <li class="location-item">Ngũ Hành Sơn</li>
                            <li class="location-item">Cẩm lệ</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div class="booking-search__box">
                      <div class="booking-search__label">
                        Ngày nhận phòng và trả phòng:
                      </div>
                      <div class="booking-search__input">
                        <input type="date" name="start-date" id="start-date" class="booking-search__input-start" >
                        <input type="date" name="end-date" id="end-date" class="booking-search__input-end" >  
                      </div>
                      <div class="booking-search__dropdown booking-search__dropdown--duration"></div>
                    </div>
                    <div class="booking-search__box">
                      <div class="booking-search__label">
                        Phòng:
                      </div>
                      <div class="booking-search__input">
                        <input type="text" name="rooms" id="rooms" readonly>
                        <div class="booking-search__icon">
                          <i class="fa-solid fa-door-closed"></i>
                        </div>
                      </div>
                      <div class="booking-search__dropdown booking-search__dropdown--rooms">
                        <div class="booking-search__rooms-box">
                          <div class="booking-search__info">
                            <i class="fa-solid fa-user"></i>
                            <span>Phòng đơn</span>
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
                    <div class="btn booking-search__submit">
                      Tìm kiếm
                    <i class="fa-solid fa-magnifying-glass"></i>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </section>
    `;
}