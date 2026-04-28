export function searchHoteltemplate() {
    return `
        <div class="search-hotel">
          <div class="grid">
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
                            <input type="checkbox" id="search-hotel-filter__choice-one-star">
                            <label for="search-hotel-filter__choice-one-star">
                              1 
                              <i class="fa-solid fa-star"></i>
                            </label>
                          </div>
                          <div class="search-hotel-filter__box-choice">
                            <input type="checkbox" id="search-hotel-filter__choice-two-star">
                            <label for="search-hotel-filter__choice-two-star">
                              2 
                              <i class="fa-solid fa-star"></i>
                            </label>
                          </div>
                          <div class="search-hotel-filter__box-choice">
                            <input type="checkbox" id="search-hotel-filter__choice-three-star">
                            <label for="search-hotel-filter__choice-three-star">
                              3 
                              <i class="fa-solid fa-star"></i>
                            </label>
                          </div>
                          <div class="search-hotel-filter__box-choice">
                            <input type="checkbox" id="search-hotel-filter__choice-four-star">
                            <label for="search-hotel-filter__choice-four-star">
                              4 
                              <i class="fa-solid fa-star"></i>
                            </label>
                          </div>
                          <div class="search-hotel-filter__box-choice">
                            <input type="checkbox" id="search-hotel-filter__choice-five-star">
                            <label for="search-hotel-filter__choice-five-star">
                              5 
                              <i class="fa-solid fa-star"></i>
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