import Carousel from '../utils/carousel.js';
import plansData from '../utils/plans.js';

export function initServicesCarousel() {
  const carouselId = '#section-carousel-services';
  const carouselElement = document.querySelector(carouselId);

  //   carrousel
  if (carouselElement) {
    const serviceCadrsCarousel = new Carousel(carouselId, {
      showPagination: true,
      itemGap: 18,
    });

    setupServiceModals();

    return serviceCadrsCarousel;
  } else {
    console.error('O Id #section-carousel-services não existe no DOM.');
  }
}

// modal

function setupServiceModals() {
  const serviceButtons = document.querySelectorAll(
    '.services__container__box__carousel__service__img-wrapper',
  );

  const iconClose = document.querySelectorAll(
    '.services__container__modal__content__box__close',
  );

  if (serviceButtons) {
    // click no plano
    serviceButtons.forEach((button) => {
      button.addEventListener('click', function () {
        openModal(button);
      });
    });
  }

  if (iconClose) {
    return;
  }
}

function openModal(button) {
  const modal = document.querySelector('.services__container__modal');
  const picture = document.querySelector(
    '.services__container__modal__content__box__picture',
  );

  const source = picture.querySelector('source');
  const img = picture.querySelector('img');
  const dataButton = button.getAttribute('data-plan');
  const anchorPlan = document.querySelector(
    '.services__container__modal__content__box__package__benefits__box-right__anchor',
  );

  if (modal) {
    const parent = button.closest(
      '.services__container__box__carousel__service',
    );
    img.style.filter = 'none';
    anchorPlan.classList.remove('disabled__plan');

    if (parent && parent.classList.contains('service__disabled')) {
      img.style.filter = 'grayscale(80%)';
      anchorPlan.classList.add('disabled__plan');
    }
    modal.style.display = 'block';
    img.src = 'assets/images/bubblecard_oppen_mobile-' + dataButton + '.webp';
    source.srcset =
      'assets/images/bubblecard_oppen_desktop-' + dataButton + '.webp';
    renderPlan(button, plansData);
  }
}

function renderPlan(button, plansData) {
  const planKey = button.dataset.plan;

  const plan = plansData.find((p) => p.plan === planKey);
  if (!plan) return;

  const containerModal = document.querySelector('.services__container__modal');

  const modal = document.querySelector(
    '.services__container__modal__content__box__package',
  );

  const title = modal.querySelector(
    '.services__container__modal__content__box__package__title',
  );

  const subtitle = modal.querySelector(
    '.services__container__modal__content__box__package__subtitle',
  );

  const left = modal.querySelector(
    '.services__container__modal__content__box__package__benefits__left',
  );

  const right = modal.querySelector(
    '.services__container__modal__content__box__package__benefits__box-right__right',
  );

  const anchor = modal.querySelector(
    '.services__container__modal__content__box__package__benefits__box-right__anchor',
  );

  const alert = modal.querySelector(
    '.services__container__modal__content__box__package__benefits__box-right__alert',
  );

  const closeButton = document.querySelector(
    '.services__container__modal__content__box__close',
  );

  const overlay = document.querySelector(
    '.services__container__modal__overlay ',
  );

  left.innerHTML = '';
  right.innerHTML = '';
  anchor.href = '';
  alert.innerHTML = '';

  title.innerHTML = plan.title || '';

  if (subtitle) {
    subtitle.innerHTML = plan.subtitle || '';
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      closeModal(containerModal);
    });
  }
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      closeModal(containerModal);
    });
  }

  function renderGroup(container, groups) {
    if (!groups) return;

    groups.forEach((itemObj) => {
      Object.entries(itemObj).forEach(([key, html]) => {
        const item = document.createElement('div');
        item.className =
          'services__container__modal__content__box__package__benefit-item';

        item.innerHTML = `
        <img
          src="assets/icons/icon-${key}.svg"
          alt="${key}"
          width="18"
          height="18"
          class="services__container__modal__content__box__package__benefit-item__icon"
        >
        <div class="services__container__modal__content__box__package__benefit-item__text">
          ${html}
        </div>
      `;

        container.appendChild(item);
      });
    });
  }

  renderGroup(left, plan.details['left-block']);
  renderGroup(right, plan.details['right-block']);
  stopScroll();

  if (anchor && plan.anchor) {
    anchor.href = plan.anchor;
  }

  if (alert && plan.alert) {
    alert.innerHTML = plan.alert;
  }
}

function closeModal(modal) {
  if (modal) {
    modal.style.display = 'none';
    releaseScroll();
  }
}

function stopScroll() {
  const htmlTag = document.querySelector('html');
  htmlTag.style.overflowY = 'hidden';
}

function releaseScroll() {
  const htmlTag = document.querySelector('html');
  htmlTag.style.overflowY = 'scroll';
}
