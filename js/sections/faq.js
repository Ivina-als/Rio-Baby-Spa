export function initFaq() {
  const faqItems = document.querySelectorAll('.faq__container__item');

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq__container__item__question');

    question.addEventListener('click', () => {
      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove('faq__container__item--active');
        }
      });

      item.classList.toggle('faq__container__item--active');
    });
  });
}
