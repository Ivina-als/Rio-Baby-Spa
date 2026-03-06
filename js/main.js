import { initServicesCarousel } from './sections/services.js';
import { setupFloatButtonScroll } from './sections/float-button.js';
import { initServicesCarouselFamily } from './sections/family.js';
import { initFaq } from './sections/faq.js';

async function renderSection(containerId, fileName, callback = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const response = await fetch(`./sections/${fileName}`);
    if (!response.ok) throw new Error(`Erro ao baixar ${fileName}`);
    const html = await response.text();

    container.innerHTML = html;

    if (callback && typeof callback === 'function') {
      callback();
    }
  } catch (error) {
    console.error(`Erro na seção ${containerId}:`, error);
  }
}

async function initPage() {
  try {
    await Promise.all([
      renderSection('header-root', 'header.html'),
      renderSection('hero-root', 'hero.html'),
      renderSection('float-button-root', 'float-button.html'),
    ]);

    try {
      setupFloatButtonScroll();
    } catch (e) {
      console.error('Erro ao iniciar o botão flutuante:', e);
    }

    renderSection('who-we-are-root', 'who-we-are.html');
    renderSection('for-who-root', 'for-who.html');
    renderSection('services-root', 'services.html', initServicesCarousel);
    renderSection('instructions-root', 'instructions.html');
    renderSection('family-root', 'family.html', initServicesCarouselFamily);
    renderSection('faq-root', 'faq.html', initFaq);
    renderSection('partners-root', 'partners.html');
    renderSection('scheduling-root', 'scheduling.html');
    renderSection('footer-root', 'footer.html');
  } catch (error) {
    console.error('Erro crítico no initPage:', error);
  }
}

document.addEventListener('DOMContentLoaded', initPage);
