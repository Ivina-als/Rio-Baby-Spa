import Carousel from '../utils/carousel.js';

export function initServicesCarouselFamily() {
  const carouselId = '#section-carousel-family';
  const carouselElement = document.querySelector(carouselId);

  if (carouselElement) {
    const familyCarousel = new Carousel(carouselId, {
      showPagination: true,
      itemGap: 20,
    });

    window.addEventListener('load', () => {
      familyCarousel.setup();
    });

    return familyCarousel;
  }
}
