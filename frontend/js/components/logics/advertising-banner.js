export function initAdvertisingBanner() {

    const container = document.querySelector(".advertising-banner__wrap");
    const nextButton = document.querySelector(".advertising-banner__btn-next");
    const previousButton = document.querySelector(".advertising-banner__btn-previous");
    if (!container || !nextButton || !previousButton) return;

    const updateButtons = () => {
        const maxScrollLeft = container.scrollWidth - container.clientWidth;
        const isAtStart = container.scrollLeft <= 1;
        const isAtEnd = container.scrollLeft >= maxScrollLeft - 1;
        const canScroll = maxScrollLeft > 1;

        previousButton.style.display = canScroll && !isAtStart ? "flex" : "none";
        nextButton.style.display = canScroll && !isAtEnd ? "flex" : "none";
    };

    const getScrollStep = () => {
        const firstItem = container.querySelector(".advertising-banner__picture");
        if (!firstItem) return container.clientWidth;

        const gap = parseFloat(getComputedStyle(container).columnGap || "0");
        return firstItem.getBoundingClientRect().width + gap;
    };

    nextButton.onclick = () => {
        container.scrollBy({ left: getScrollStep(), behavior: "smooth" });
    };

    previousButton.onclick = () => {
        container.scrollBy({ left: -getScrollStep(), behavior: "smooth" });
    };

    container.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);

    updateButtons();
}
