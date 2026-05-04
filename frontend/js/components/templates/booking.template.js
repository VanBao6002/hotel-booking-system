export function bookingTemplate() {
    return `
      <div class="booking">
        <div class="grid">
          <div class="booking__picture-wrap">
            <div class="booking__picture">
              <div class="booking__picture-main">
                <div class="booking__picture-main-img">
                  <img src="assets/images/example-room.jpg" alt="hinh">
                </div>
              </div>
              <div class="booking__picture-add">
                <div class="booking__picture-add-img">
                  <img src="assets/images/example-room.jpg" alt="hinh">
                </div>
                <div class="booking__picture-add-img">
                  <img src="assets/images/example-room.jpg" alt="hinh">
                </div>
                <div class="booking__picture-add-img">
                  <img src="assets/images/example-room.jpg" alt="hinh">
                </div>
                <div class="booking__picture-add-img">
                  <img src="assets/images/example-room.jpg" alt="hinh">
                </div>
                <div class="booking__picture-add-img">
                  <img src="assets/images/example-room.jpg" alt="hinh">
                </div>
                <div class="booking__picture-add-img">
                  <img src="assets/images/example-room.jpg" alt="hinh">
                </div>
              </div>  
            </div>
          </div>
          <div class="booing__info">
            <section class="booking__info-genaral">
              <div class="booking__info-genaral-head">
                <div class="booking__info-genaral-name">
                  <span>Ten Khach San</span>
                </div>
                <div class="booking__info-genaral-wrap">
                  <div class="booking__info-genaral-price">
                    <div class="booking__info-genaral-price-text">
                      Giá/phòng/đêm từ:
                    </div>
                    <div class="booking__info-genaral-price-current">
                      3.000.000 VND
                    </div>
                  </div>
                  <div class="booking__info-genaral-button">
                    <span>Chọn phòng</span>
                  </div>
                </div>
              </div>
              <div class="booking__info-genaral-body">
                <div class="booking__info-genaral-contact">
                  <div class="booking__info-genaral-contact-head">
                    <span>Thông tin liên hệ</span>
                  </div>
                  <div class="booking__info-genaral-contact-body">
                    <span>Dia chi khach san</span>
                    <span>Dia chi khach san</span>
                  </div>
                </div>
                <div class="booking__info-genaral-service">
                  <div class="booking__info-genaral-service-head">
                    <span>Tiện ích chính</span>
                  </div>
                  <div class="booking__info-genaral-service-body">
                    <div class="booking__info-genaral-service-list">
                      <div class="booking__info-genaral-service-item">
                        <i class="fa-solid fa-wifi"></i>
                        <span>Wifi</span>
                      </div>
                      <div class="booking__info-genaral-service-item">
                        <i class="fa-solid fa-utensils"></i>
                        <span>Nhà hàng</span>
                      </div>
                      <div class="booking__info-genaral-service-item">
                        <i class="fa-solid fa-wind"></i>
                        <span>Máy lạnh</span>
                      </div>
                      <div class="booking__info-genaral-service-item">
                        <i class="fa-solid fa-elevator"></i>
                        <span>Thang máy</span>
                      </div>
                      <div class="booking__info-genaral-service-item">
                        <i class="fa-solid fa-phone-volume"></i>
                        <span>Lễ tân 24/24</span>
                      </div>
                      <div class="booking__info-genaral-service-item">
                        <i class="fa-solid fa-square-parking"></i>
                        <span>Chỗ đậu xe</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section class="booking__info-room">
              <div class="booking__info-room-head">
                <span>Những phòng còn trống tại Ten Khach San</span>
              </div>
              <div class="booking__info-room-body">

              </div>
            </section>
            <section class="booking__info-confirm">
              <div class="booking__info-confirm-head">
                <span>Xác nhận đặt phòng</span>
              </div>
              <div class="booking__info-confirm-body">
                <table class="booking__info-room-table">
                <tr>
                    <th>Phòng đơn</th>
                    <th>Phòng đôi</th>
                    <th>Tổng tiền</th>
                    <th>Xác nhận</th>
                </tr>
                <tr>
                    <td>0</td>
                    <td>0</td>
                    <td><div class="room-total-price">0 VND</div></td>
                    <td class="choice-button"><button class="room-choice__button">Xác nhận</button></td>
                </tr>
                </table>
              </div>
            </section>
            <section class="booking__info-service">
              <div class="booking__info-service-head">
                <span>Tất cả tiện ích</span>
              </div>
              <div class="booking__info-service-body">
              </div>
            </section>

            <section class="booking__info-rate">
              <div class="booking__info-rate-head">
                <span>Đánh giá của khách hàng</span>
              </div>
              <div class="booking__info-rate-body">
                <div class="booking__info-rate-overall">
                  <div class="booking__info-rate-overall-wrap">
                    <div class="booing__info-rate-avg">
                      <div class="rate-avg__box-border">
                        <div class="rate-avg__box">
                          <span>4.5</span>
                        </div>
                      </div>
                      <div class="rate-avg__text">
                        <h2>Từ <span></span> đánh giá của khách hàng</h2>
                      </div>
                    </div>
                    <div class="booking__info-rate-detail">
                      <div class="rate-detail__box">
                        <div class="rate__row"><div class="rate__row-fill-one-star"></div></div>
                        <div class="rate__star">
                          <i class="fa-solid fa-star"></i>
                        </div>
                      </div>
                      <div class="rate-detail__box">
                        <div class="rate__row"><div class="rate__row-fill-two-star"></div></div>
                        <div class="rate__star">
                          <i class="fa-solid fa-star"></i>
                          <i class="fa-solid fa-star"></i>
                        </div>
                      </div>
                      <div class="rate-detail__box">
                        <div class="rate__row"><div class="rate__row-fill-three-star"></div></div>
                        <div class="rate__star">
                          <i class="fa-solid fa-star"></i>
                          <i class="fa-solid fa-star"></i>
                          <i class="fa-solid fa-star"></i>
                        </div>
                      </div>
                      <div class="rate-detail__box">
                        <div class="rate__row"><div class="rate__row-fill-four-star"></div></div>
                        <div class="rate__star">
                          <i class="fa-solid fa-star"></i>
                          <i class="fa-solid fa-star"></i>
                          <i class="fa-solid fa-star"></i>
                          <i class="fa-solid fa-star"></i>
                        </div>
                      </div>
                      <div class="rate-detail__box">
                        <div class="rate__row"><div class="rate__row-fill-five-star"></div></div>
                        <div class="rate__star">
                          <i class="fa-solid fa-star"></i>
                          <i class="fa-solid fa-star"></i>
                          <i class="fa-solid fa-star"></i>
                          <i class="fa-solid fa-star"></i>
                          <i class="fa-solid fa-star"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="booking__info-rate-covervation">
                  <div class="booking__info-rate-covervation-head">
                    <span>Bài đánh giá</span>
                  </div>
                  <div class="booking__info-rate-covervation-body">
                    <div class="booking__info-rate-covervation-wrap">
                    </div>
                    
                  </div>
                </div>
              </div>
            </section>
          </div>

        </div>
      </div>
    `;
}