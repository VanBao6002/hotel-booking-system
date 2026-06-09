/**
 * UI Effects - Smooth interactions & micro-animations
 * Enhances the hotel booking UI with delightful effects
 */

/* ─── Header Scroll Shadow ───────────────────────────── */
export function initHeaderScrollEffect() {
    const header = document.querySelector('.header');
    if (!header) return;

    const onScroll = () => {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
}

/* ─── Ripple Effect on Buttons ───────────────────────── */
export function initRippleEffect() {
    // Apply ripple to all .btn elements (and action buttons)
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn, .confirm-btn, .action-btn, .hotel-card__btn, .hotel-modal-btn, .save-info__btn.active');
        if (!btn) return;

        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        ripple.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
        `;

        // Ensure btn has position relative for proper ripple placement
        const currentPos = window.getComputedStyle(btn).position;
        if (currentPos === 'static') {
            btn.style.position = 'relative';
        }
        btn.style.overflow = 'hidden';

        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
    });
}

/* ─── Page Transition Animation ─────────────────────── */
export function animatePageEnter(container) {
    if (!container) return;
    container.classList.remove('page-enter');
    // force reflow
    void container.offsetWidth;
    container.classList.add('page-enter');
}

/* ─── Staggered List Item Animations ────────────────── */
export function animateListItems(selector, delay = 60) {
    const items = document.querySelectorAll(selector);
    items.forEach((item, i) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(16px)';
        item.style.transition = `opacity 0.35s ease ${i * delay}ms, transform 0.35s ease ${i * delay}ms`;

        // Trigger animation on next frame
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            });
        });
    });
}

/* ─── Smooth Number Counter ─────────────────────────── */
export function animateCounter(element, from, to, duration = 800) {
    if (!element) return;
    const startTime = performance.now();
    const range = to - from;

    const step = (timestamp) => {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.round(from + range * eased).toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    };

    requestAnimationFrame(step);
}

/* ─── Scroll Reveal (IntersectionObserver) ───────────── */
export function initScrollReveal() {
    const revealTargets = [
        '.search-hotel-result__wrap',
        '.popular-destinations__box',
        '.hotel-card',
        '.convervation__box',
        '.booking__picture-add-img',
        '.advertising-banner__picture',
    ];

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
            observer.observe(el);
        });
    });

    // Also observe dynamically added items
    return observer;
}

/* Re-run scroll reveal for dynamically-rendered content */
export function refreshScrollReveal(observer) {
    if (!observer) return;
    const revealTargets = [
        '.search-hotel-result__wrap',
        '.popular-destinations__box',
        '.hotel-card',
        '.convervation__box',
    ];

    revealTargets.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
            if (!el.classList.contains('reveal-visible')) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
                observer.observe(el);
            }
        });
    });
}

/* "reveal-visible" trigger */
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('animationend', (e) => {
        if (e.target.classList.contains('reveal-visible')) {
            e.target.style.opacity = '';
            e.target.style.transform = '';
        }
    });
});

/* Helper to manually trigger reveal on a single element */
export function revealElement(el, delayMs = 0) {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = `opacity 0.4s ease ${delayMs}ms, transform 0.4s ease ${delayMs}ms`;

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    });
}
