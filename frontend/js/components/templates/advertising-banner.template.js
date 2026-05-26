export function advertisingBannerTemplate() {
    return `
        <section class="advertising-banner reveal">
          <div class="grid">
            <h2 class="head__title advertising-banner__title">
              Ưu đãi &amp; Khuyến mãi đặc biệt
            </h2>
            <p class="advertising-banner__subtitle">Khám phá các gói nghỉ dưỡng hấp dẫn với giá ưu đãi</p>
            <div class="advertising-banner__box">
              <div class="advertising-banner__wrap">
                <div class="advertising-banner__picture">
                  <img src="assets/images/example-banner.jpeg" alt="Ưu đãi khách sạn">
                </div>
                <div class="advertising-banner__picture">
                  <img src="assets/images/example-banner.jpeg" alt="Ưu đãi khách sạn">
                </div>
                <div class="advertising-banner__picture">
                  <img src="assets/images/example-banner.jpeg" alt="Ưu đãi khách sạn">
                </div>
                <div class="advertising-banner__picture">
                  <img src="assets/images/example-banner.jpeg" alt="Ưu đãi khách sạn">
                </div>
                <div class="advertising-banner__picture">
                  <img src="assets/images/example-banner.jpeg" alt="Ưu đãi khách sạn">
                </div>
                <div class="advertising-banner__picture">
                  <img src="assets/images/example-banner.jpeg" alt="Ưu đãi khách sạn">
                </div>
              </div>

              <div class="advertising-banner__btn advertising-banner__btn-next">
                <i class="fa-solid fa-chevron-right"></i>
              </div>
              <div class="advertising-banner__btn advertising-banner__btn-previous">
                <i class="fa-solid fa-chevron-left"></i>
              </div>
            </div>

            <!-- Dot indicators -->
            <div class="advertising-banner__dots">
              <div class="advertising-banner__dot active"></div>
              <div class="advertising-banner__dot"></div>
              <div class="advertising-banner__dot"></div>
            </div>
          </div>
        </section>
    `;
}