export function advertisingBannerTemplate() {
    return `
        <section class="advertising-banner">
          <div class="grid">
            <h2 class="head__title advertising-banner__title">
              Tìm và đặt phòng giá rẻ với các ưu đãi sau đây
            </h2>
            <div class="advertising-banner__box">
              
              <div class="advertising-banner__wrap">
                <div class="advertising-banner__picture">
                  <img src="assets/images/example-banner.jpeg" alt="example">
                </div>
                <div class="advertising-banner__picture">
                  <img src="assets/images/example-banner.jpeg" alt="example">
                </div>
                <div class="advertising-banner__picture">
                  <img src="assets/images/example-banner.jpeg" alt="example">
                </div>
                <div class="advertising-banner__picture">
                  <img src="assets/images/example-banner.jpeg" alt="example">
                </div>
                <div class="advertising-banner__picture">
                  <img src="assets/images/example-banner.jpeg" alt="example">
                </div>
                <div class="advertising-banner__picture">
                  <img src="assets/images/example-banner.jpeg" alt="example">
                </div>
              </div>

              <div class="advertising-banner__btn advertising-banner__btn-next">
                <i class="fa-solid fa-chevron-right"></i>
              </div>
              <div class="advertising-banner__btn advertising-banner__btn-previous">
                <i class="fa-solid fa-chevron-left"></i>
              </div>
            </div>
          </div>
        </section>
    `;
}