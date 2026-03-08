import Carousel from '../utils/carousel.js';
import plansData from '../utils/plans.js';

export function initServicesCarousel() {
  const carouselId = '#section-carousel-services';
  const carouselElement = document.querySelector(carouselId);

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

function setupServiceModals() {
  const modal = document.querySelector('.services__container__modal');
  const serviceButtons = document.querySelectorAll(
    '.services__container__box__carousel__service__img-wrapper',
  );
  const closeButton = document.querySelector(
    '.services__container__modal__content__box__close',
  );
  const overlay = document.querySelector(
    '.services__container__modal__overlay',
  );

  if (serviceButtons.length > 0) {
    serviceButtons.forEach((button) => {
      button.addEventListener('click', () => openModal(button));
    });
  }

  if (closeButton && modal) {
    closeButton.addEventListener('click', () => closeModal(modal));
  }
  if (overlay && modal) {
    overlay.addEventListener('click', () => closeModal(modal));
  }
}

function openModal(button) {
  const modal = document.querySelector('.services__container__modal');
  const picture = document.querySelector(
    '.services__container__modal__content__box__picture',
  );
  const img = picture?.querySelector('img');
  const source = picture?.querySelector('source');
  const dataButton = button.getAttribute('data-plan');
  const parent = button.closest('.services__container__box__carousel__service');

  if (modal && img) {
    modal.classList.remove('modal-ready');
    modal.style.display = 'block';

    renderPlan(button, plansData);

    const mobileSrc = `assets/images/bubblecard_oppen_mobile-${dataButton}.webp`;
    const desktopSrc = `assets/images/bubblecard_oppen_desktop-${dataButton}.webp`;

    if (source) source.srcset = desktopSrc;
    if (img) img.src = mobileSrc;
    if (parent && parent.classList.contains('service__disabled')) {
      modal.style.filter = 'grayscale(90%)';
    } else {
      modal.style.filter = 'none';
    }
    img
      .decode()
      .then(() => {
        modal.classList.add('modal-ready');
      })
      .catch(() => {
        modal.classList.add('modal-ready');
      });
  }
}

function renderPlan(button, plansData) {
  const planKey = button.dataset.plan;
  const plan = plansData.find((p) => p.plan === planKey);
  if (!plan) return;

  const parent = button.closest('.services__container__box__carousel__service');

  const modalContent = document.querySelector(
    '.services__container__modal__content__box__package',
  );
  const title = modalContent.querySelector(
    '.services__container__modal__content__box__package__title',
  );
  const subtitle = modalContent.querySelector(
    '.services__container__modal__content__box__package__subtitle',
  );
  const left = modalContent.querySelector(
    '.services__container__modal__content__box__package__benefits__left',
  );
  const right = modalContent.querySelector(
    '.services__container__modal__content__box__package__benefits__box-right__right',
  );
  const anchor = modalContent.querySelector(
    '.services__container__modal__content__box__package__benefits__box-right__anchor',
  );
  const alert = modalContent.querySelector(
    '.services__container__modal__content__box__package__benefits__box-right__alert',
  );

  left.innerHTML = '';
  right.innerHTML = '';

  if (anchor) anchor.href = '';

  if (alert) alert.innerHTML = '';

  title.innerHTML = plan.title || '';
  if (subtitle) subtitle.innerHTML = plan.subtitle || '';

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

  if (anchor && parent) {
    anchor.href = plan.anchor;

    parent.classList.contains('service__disabled')
      ? anchor.classList.add('disabled__plan')
      : anchor.classList.remove('disabled__plan');
  }

  if (alert && plan.alert) alert.innerHTML = plan.alert;

  stopScroll();
}

function closeModal(modal) {
  if (modal) {
    modal.classList.remove('modal-ready');
    modal.style.display = 'none';
    releaseScroll();
  }
}

function stopScroll() {
  document.documentElement.style.overflowY = 'hidden';
}

function releaseScroll() {
  document.documentElement.style.overflowY = 'auto';
}
