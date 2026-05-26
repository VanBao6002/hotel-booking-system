export function popularDestinationsTemplate() {
    const hotels = [
        { name: "Khách sạn view biển Mỹ Khê", location: "Sơn Trà, Đà Nẵng" },
        { name: "Resort Ngũ Hành Sơn", location: "Ngũ Hành Sơn, Đà Nẵng" },
        { name: "Boutique Hotel Hải Châu", location: "Hải Châu, Đà Nẵng" },
        { name: "Riverside Hotel Cẩm Lệ", location: "Cẩm Lệ, Đà Nẵng" },
        { name: "Sky View Hotel Liên Chiểu", location: "Liên Chiểu, Đà Nẵng" },
        { name: "Grand Hotel Thanh Khê", location: "Thanh Khê, Đà Nẵng" },
    ];

    const cards = hotels.map(h => `
        <div class="grid__column-three-columns">
          <div class="popular-destinations__box">
            <img src="assets/images/example-banner.jpeg" alt="${h.name}">
            <div class="popular-destinations__box-title">
              <h3>${h.name}</h3>
              <div class="card-location">
                <i class="fa-solid fa-location-dot"></i>
                ${h.location}
              </div>
            </div>
            <div class="modal__overlay popular-destinations__box-overlay">
              <div class="popular-destinations__box-look-more-btn">
                Xem khách sạn
              </div>
            </div>
          </div>
        </div>
    `).join('');

    return `
        <section class="popular-destinations reveal">
          <div class="grid">
            <h2 class="head__title popular-destinations__title">Khách sạn nổi bật</h2>
            <p class="popular-destinations__subtitle">Những lựa chọn được yêu thích nhất tại Đà Nẵng</p>
            <div class="popular-destinations-wrap grid__row">
              ${cards}
            </div>
          </div>
        </section>
    `;
}