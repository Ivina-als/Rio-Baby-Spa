export function setupFloatButtonScroll() {
  const heroButton = document.querySelector('#baby-spa-schedule-button');
  const floatButton = document.querySelector('.float-button__container');

  if (!heroButton || !floatButton) return;

  const observerOptions = {
    root: null,
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        floatButton.classList.add('float-button__container--visible');
      } else {
        floatButton.classList.remove('float-button__container--visible');
      }
    });
  }, observerOptions);

  observer.observe(heroButton);
}
