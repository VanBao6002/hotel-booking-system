export function searchHoteltemplate() {
    return `
        <div class="search-hotel">
          <div class="grid">
            
            <div class="booking-search__body" style="position: relative;top: 0;">
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
                          <div class="booking-search__control-btn-minus ">
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
            

            <div class="grid__row">
              <div class="grid__column-two-columns">
                <div class="search-hotel-filter">
                  <div class="box-filter search-hotel-filter__head">
                    <span>Bộ lọc</span>
                  </div>
                  <div class="search-hotel-filter__body">
                    <div class="search-hotel-filter__list">
                      <div class="search-hotel-filter__rate">
                        <div class="box-filter search-hotel-filter__item-head">
                          <div class="search-hotel-filter__item-text">
                            <span>Đánh giá sao</span>
                          </div>
                          <div class="search-hotel-filter__item-icon">
                            <i class="fa-solid fa-angle-down"></i>
                          </div>
                        </div>
                        <div class="search-hotel-filter__box">
                          <div class="search-hotel-filter__box-choice">
                            <input type="checkbox" id="search-hotel-filter__choice-one-star" value="1">
                            <label for="search-hotel-filter__choice-one-star">
                              1<i class="fa-solid fa-star"></i>
                            </label>
                          </div>
                          <div class="search-hotel-filter__box-choice">
                            <input type="checkbox" id="search-hotel-filter__choice-two-star" value="2">
                            <label for="search-hotel-filter__choice-two-star">
                              2<i class="fa-solid fa-star"></i>
                            </label>
                          </div>
                          <div class="search-hotel-filter__box-choice">
                            <input type="checkbox" id="search-hotel-filter__choice-three-star" value="3">
                            <label for="search-hotel-filter__choice-three-star">
                              3<i class="fa-solid fa-star"></i>
                            </label>
                          </div>
                          <div class="search-hotel-filter__box-choice">
                            <input type="checkbox" id="search-hotel-filter__choice-four-star" value="4">
                            <label for="search-hotel-filter__choice-four-star">
                              4<i class="fa-solid fa-star"></i>
                            </label>
                          </div>
                          <div class="search-hotel-filter__box-choice">
                            <input type="checkbox" id="search-hotel-filter__choice-five-star" value="5">
                            <label for="search-hotel-filter__choice-five-star">
                              5<i class="fa-solid fa-star"></i>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div class="search-hotel-filter__price">
                        <div class="box-filter search-hotel-filter__item-head">
                          <div class="search-hotel-filter__item-text">
                            <span>Theo giá</span>
                          </div>
                          <div class="search-hotel-filter__item-icon">
                            <i class="fa-solid fa-angle-down"></i>
                          </div>
                        </div>
                        <div class="search-hotel-filter__box">
                          <div class="search-hotel-filter__box-choice">
                            <input type="checkbox" id="price-ascending">
                            <label for="price-ascending">Từ thấp đén cao</label>
                          </div>
                          <div class="search-hotel-filter__box-choice">
                            <input type="checkbox" id="price-descending">
                            <label for="price-descending">Từ cao đén thấp</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="grid__column-ten-columns">
                <div class="grid">
                  <div class="search-hotel-result">
                    <div class="box-filter search-hotel-result__head">
                      <span>Khách sạn phù hợp</span>
                    </div>
                    <div class="search-hotel-result__body"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
}