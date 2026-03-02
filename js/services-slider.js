document.addEventListener('DOMContentLoaded', function () {
    const swiper = new Swiper('.solutions-swiper', {
        slidesPerView: 1.2,
        spaceBetween: 20,
        centeredSlides: false,
        grabCursor: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: true,
        },
        pagination: {
            el: '.swiper-pagination-vion',
            clickable: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + '"></span>';
            },
        },
        navigation: {
            nextEl: '.swiper-button-next-vion',
            prevEl: '.swiper-button-prev-vion',
        },
        breakpoints: {
            640: {
                slidesPerView: 1.5,
                spaceBetween: 25,
            },
            768: {
                slidesPerView: 2.2,
                spaceBetween: 30,
            },
            1024: {
                slidesPerView: 3.2,
                spaceBetween: 35,
            },
            1200: {
                slidesPerView: 3.5,
                spaceBetween: 40,
            }
        },
        speed: 1000,
        watchSlidesProgress: true,
    });
});
