class Carousel {
  constructor(containerSelector, options = {}) {
    const {
      showPagination = true,
      itemGap = 16, // Pode ser um número, array com 3 valores ou um objeto ex.: { mobile: 16, tablet: 24, desktop: 32 }
      dragSpeed = 1.2,
    } = options;

    this.container = document.querySelector(containerSelector);
    if (!this.container) {
      console.error(
        `Carousel: Container not found for selector "${containerSelector}".`,
      );
      return;
    }

    this.wrapper = this.container.querySelector('.carousel-wrapper');
    this.scrollContainer = this.wrapper?.querySelector('.carousel-scroll');
    this.carousel = Array.from(
      this.scrollContainer?.querySelectorAll('.carousel-item') || [],
    );
    this.dotsContainer = this.container.querySelector('.carousel-dots');
    this.prevBtn = this.container.querySelector('.prev');
    this.nextBtn = this.container.querySelector('.next');

    this.currentPage = 0;
    this.dragSpeed = Math.max(dragSpeed, 0.1);
    this.showPagination = showPagination;

    this.itemGapConfig = itemGap;
    this.itemGap = this.calculateDynamicGap(itemGap);

    if (!this.wrapper || !this.scrollContainer || !this.carousel.length) {
      console.error(
        'Carousel: Missing required elements (wrapper, scroll container or items) in the DOM.',
      );
      return;
    }

    this.handlePrevClick = this.handlePrevClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleScroll = this.handleScroll.bind(this);

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);

    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);

    this.setup();
  }

  calculateDynamicGap(itemGap) {
    const screenWidth = window.innerWidth;

    if (typeof itemGap === 'number') {
      return itemGap;
    }

    if (Array.isArray(itemGap)) {
      if (screenWidth < 620) {
        return itemGap[0] || 16;
      } else if (screenWidth >= 620 && screenWidth <= 1123) {
        return itemGap[1] || 24;
      } else {
        return itemGap[2] || 32;
      }
    }

    if (typeof itemGap === 'object') {
      const { mobile = 16, tablet = 24, desktop = 32 } = itemGap;
      if (screenWidth < 620) {
        return mobile;
      } else if (screenWidth >= 620 && screenWidth <= 1123) {
        return tablet;
      } else {
        return desktop;
      }
    }

    return 16;
  }

  calculateItemWidth() {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 619) {
      return 32;
    } else if (screenWidth <= 1123) {
      return 72;
    } else if (screenWidth <= 1320) {
      return 72;
    } else {
      return 48 + (screenWidth - 1320) / 2;
    }
  }

  setup() {
    this.initializeCarousel();
    this.updateCarousel();
  }

  initializeCarousel() {
    this.totalItemWidths = this.carousel.map((item, index) => {
      const width = item.getBoundingClientRect().width;
      item.style.marginRight =
        index !== this.carousel.length - 1 ? `${this.itemGap}px` : '0';
      return width;
    });

    this.createDots();
    this.addEvents();

    const isTouchDevice =
      'ontouchstart' in window ||
      window.matchMedia('(pointer: coarse)').matches;

    if (isTouchDevice) {
      this.addTouchEvents();
    } else {
      this.addMouseDrag();
    }
  }

  updateCarousel() {
    this.itemGap = this.calculateDynamicGap(this.itemGapConfig);

    this.viewportWidth = this.container.offsetWidth;
    if (!this.viewportWidth || this.viewportWidth < 50) {
      setTimeout(() => this.updateCarousel(), 100);
      return;
    }

    const itemWidth = this.calculateItemWidth();

    this.itemsPerPage = this.calculateItemsPerPage();
    this.totalPages = Math.ceil(this.carousel.length / this.itemsPerPage);

    const shouldCenterItems = this.carousel.length <= this.itemsPerPage;

    Object.assign(this.scrollContainer.style, {
      paddingRight: shouldCenterItems ? '0px' : `${itemWidth}px`,

      width: `${this.viewportWidth + (shouldCenterItems ? 0 : itemWidth)}px`,
      justifyContent: shouldCenterItems ? 'center' : '',
    });

    this.scrollContainer.classList.toggle('centered-items', shouldCenterItems);

    this.togglePagination();

    setTimeout(() => {
      if (shouldCenterItems) {
        this.currentPage = 0;
        this.scrollToPage(0);
      } else {
        const pageWidth = this.totalItemWidths
          .slice(0, this.itemsPerPage)
          .reduce((acc, width) => acc + width + this.itemGap, 0);

        const offset = this.scrollContainer.scrollLeft;
        let newCurrentPage = Math.round(offset / pageWidth);
        if (newCurrentPage >= this.totalPages)
          newCurrentPage = this.totalPages - 1;
        if (newCurrentPage < 0) newCurrentPage = 0;
        this.currentPage = newCurrentPage;

        const highlightedIndex = this.carousel.findIndex(
          (item) => item.dataset.highlight === 'true',
        );
        this.currentPage =
          highlightedIndex !== -1
            ? Math.floor(highlightedIndex / this.itemsPerPage)
            : 0;

        this.scrollToPage(this.currentPage);
      }

      this.createDots();
      this.updateDots();
    }, 0);
  }

  calculateItemsPerPage() {
    let totalWidth = 0;
    const count = this.totalItemWidths.findIndex((currentWidth) => {
      if (totalWidth + currentWidth > this.viewportWidth) return true;
      totalWidth += currentWidth + this.itemGap;
      return false;
    });

    return count === -1 ? this.totalItemWidths.length : Math.max(1, count);
  }

  togglePagination() {
    const toggleDisplay = (element, condition) => {
      if (element) element.style.display = condition ? '' : 'none';
    };

    const shouldShowPagination =
      this.carousel.length > this.itemsPerPage && this.showPagination;
    const paginationContainer = this.container.querySelector(
      '.carousel-pagination',
    );

    if (shouldShowPagination) {
      toggleDisplay(paginationContainer, true);
    } else {
      toggleDisplay(paginationContainer, false);
    }

    this.prevBtn?.setAttribute('aria-label', 'Previous slide');
    this.nextBtn?.setAttribute('aria-label', 'Next slide');
  }

  createDots() {
    if (!this.showPagination || !this.dotsContainer) return;
    this.dotsContainer.innerHTML = Array.from(
      { length: this.totalPages },
      (_, i) => `
      <span role="button" aria-label="Go to page ${
        i + 1
      }" data-index="${i}"></span>
    `,
    ).join('');

    this.dotsContainer.querySelectorAll('span').forEach((dot) => {
      dot.addEventListener('click', () =>
        this.scrollToPage(Number(dot.dataset.index)),
      );
    });
  }

  updateDots() {
    if (!this.showPagination || !this.dotsContainer) return;
    this.dotsContainer.querySelectorAll('span').forEach((dot, i) => {
      dot.classList.toggle('active', i === this.currentPage);
    });
  }

  scrollToPage(index) {
    if (index < 0 || index >= this.totalPages) return;

    const itemsBeforePage = index * this.itemsPerPage;

    const offset = this.totalItemWidths
      .slice(0, itemsBeforePage)
      .reduce((acc, width) => acc + width + this.itemGap, 0);

    const pageWidth = this.totalItemWidths
      .slice(0, this.itemsPerPage)
      .reduce((acc, width) => acc + width + this.itemGap, 0);

    const centerOffset = (this.viewportWidth - pageWidth) / 2;

    this.scrollContainer.scrollTo({
      left: offset - centerOffset,
      behavior: 'smooth',
    });

    this.currentPage = index;
    this.updateDots();
  }

  handlePrevClick(event) {
    event.stopPropagation();
    if (this.currentPage > 0) {
      this.scrollToPage(this.currentPage - 1);
    }
  }

  handleNextClick(event) {
    event.stopPropagation();
    if (this.currentPage < this.totalPages - 1) {
      this.scrollToPage(this.currentPage + 1);
    }
  }

  addEvents() {
    this.prevBtn?.removeEventListener('click', this.handlePrevClick);
    this.nextBtn?.removeEventListener('click', this.handleNextClick);
    this.scrollContainer.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);

    this.prevBtn?.addEventListener('click', this.handlePrevClick);
    this.nextBtn?.addEventListener('click', this.handleNextClick);
    this.scrollContainer.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleResize);
  }

  addMouseDrag() {
    this.scrollContainer.removeEventListener('mousedown', this.onMouseDown);
    this.scrollContainer.removeEventListener('mousemove', this.onMouseMove);
    this.scrollContainer.removeEventListener('mouseup', this.onMouseUp);
    this.scrollContainer.removeEventListener('mouseleave', this.onMouseLeave);

    this.scrollContainer.addEventListener('mousedown', this.onMouseDown);
    this.scrollContainer.addEventListener('mousemove', this.onMouseMove);
    this.scrollContainer.addEventListener('mouseup', this.onMouseUp);
    this.scrollContainer.addEventListener('mouseleave', this.onMouseLeave);
  }

  addTouchEvents() {
    this.scrollContainer.removeEventListener('touchstart', this.onTouchStart);
    this.scrollContainer.removeEventListener('touchmove', this.onTouchMove);
    this.scrollContainer.removeEventListener('touchend', this.onTouchEnd);

    this.scrollContainer.addEventListener('touchstart', this.onTouchStart, {
      passive: true,
    });
    this.scrollContainer.addEventListener('touchmove', this.onTouchMove, {
      passive: false,
    });
    this.scrollContainer.addEventListener('touchend', this.onTouchEnd, {
      passive: true,
    });
  }

  destroy() {
    this.prevBtn?.removeEventListener('click', this.handlePrevClick);
    this.nextBtn?.removeEventListener('click', this.handleNextClick);
    this.scrollContainer.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);

    this.scrollContainer.removeEventListener('mousedown', this.onMouseDown);
    this.scrollContainer.removeEventListener('mousemove', this.onMouseMove);
    this.scrollContainer.removeEventListener('mouseup', this.onMouseUp);
    this.scrollContainer.removeEventListener('mouseleave', this.onMouseLeave);

    this.scrollContainer.removeEventListener('touchstart', this.onTouchStart);
    this.scrollContainer.removeEventListener('touchmove', this.onTouchMove);
    this.scrollContainer.removeEventListener('touchend', this.onTouchEnd);

    this.container = null;
    this.wrapper = null;
    this.carousel = null;
    this.dotsContainer = null;
    this.scrollTrack = null;
    this.fakeScrollThumb = null;
    this.scrollContainer = null;
  }

  onMouseDown(e) {
    e.preventDefault();
    this._isDragging = true;
    this.wrapper.classList.add('dragging');
    this._startX = e.pageX;
    this._startY = e.pageY;
    this._scrollLeft = this.scrollContainer.scrollLeft;
    this._dragDistanceX = 0;
    this._dragDistanceY = 0;
  }

  onMouseMove(e) {
    if (!this._isDragging) return;
    e.preventDefault();
    const deltaX = e.pageX - this._startX;
    const deltaY = e.pageY - this._startY;
    this._dragDistanceX = deltaX;
    this._dragDistanceY = deltaY;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      const walk = deltaX * this.dragSpeed;
      this.scrollContainer.scrollLeft = this._scrollLeft - walk;
    }
  }

  onMouseUp() {
    if (this._isDragging) {
      const pageWidth = this.totalItemWidths
        .slice(0, this.itemsPerPage)
        .reduce((acc, width) => acc + width + this.itemGap, 0);
      const offset = this.scrollContainer.scrollLeft;
      const currentPage = Math.round(offset / pageWidth);

      if (Math.abs(this._dragDistanceX) > pageWidth / 4) {
        if (this._dragDistanceX > 0 && this.currentPage > 0) {
          this.scrollToPage(this.currentPage - 1);
        } else if (
          this._dragDistanceX < 0 &&
          this.currentPage < this.totalPages - 1
        ) {
          this.scrollToPage(this.currentPage + 1);
        } else {
          this.scrollToPage(this.currentPage);
        }
      } else {
        this.scrollToPage(this.currentPage);
      }
    }
    this._isDragging = false;
    this.wrapper.classList.remove('dragging');
  }

  onMouseLeave() {
    this.onMouseUp();
  }

  onTouchStart(e) {
    this._startX = e.touches[0].clientX;
    this._startY = e.touches[0].clientY;
    this._scrollLeft = this.scrollContainer.scrollLeft;
    this._dragDistanceX = 0;
    this._dragDistanceY = 0;
    this._isDragging = true;
    this._isHorizontalDrag = false;
    this._dragDirectionLocked = false;
  }

  onTouchMove(e) {
    if (!this._isDragging) return;
    const deltaX = e.touches[0].clientX - this._startX;
    const deltaY = e.touches[0].clientY - this._startY;
    this._dragDistanceX = deltaX;
    this._dragDistanceY = deltaY;
    if (
      !this._dragDirectionLocked &&
      (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6)
    ) {
      this._dragDirectionLocked = true;
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        this._isHorizontalDrag = true;
      } else {
        this._isDragging = false;
        return;
      }
    }
    if (this._isHorizontalDrag) {
      e.preventDefault();
      const walk = deltaX * this.dragSpeed;
      this.scrollContainer.scrollLeft = this._scrollLeft - walk;
    }
  }

  onTouchEnd() {
    if (this._isHorizontalDrag) {
      const pageWidth = this.totalItemWidths
        .slice(0, this.itemsPerPage)
        .reduce((acc, width) => acc + width + this.itemGap, 0);

      const threshold = 20;

      if (Math.abs(this._dragDistanceX) > threshold) {
        if (this._dragDistanceX > 0 && this.currentPage > 0) {
          this.scrollToPage(this.currentPage - 1);
        } else if (
          this._dragDistanceX < 0 &&
          this.currentPage < this.totalPages - 1
        ) {
          this.scrollToPage(this.currentPage + 1);
        } else {
          this.scrollToPage(this.currentPage);
        }
      } else {
        this.scrollToPage(this.currentPage);
      }
    }
    this._isDragging = false;
    this._isHorizontalDrag = false;
    this._dragDirectionLocked = false;
  }

  handleScroll() {
    const offset = this.scrollContainer.scrollLeft;
    const maxScroll =
      this.scrollContainer.scrollWidth - this.scrollContainer.offsetWidth;
    if (Math.abs(offset - maxScroll) < 10) {
      if (this.currentPage !== this.totalPages - 1) {
        this.currentPage = this.totalPages - 1;
        this.updateDots();
      }
      return;
    }
    const pageWidth = this.totalItemWidths
      .slice(0, this.itemsPerPage)
      .reduce((acc, width) => acc + width + this.itemGap, 0);
    const index = Math.round(offset / pageWidth);
    if (index !== this.currentPage && index < this.totalPages) {
      this.currentPage = index;
      this.updateDots();
    }
  }

  handleResize() {
    clearTimeout(this.resizeCarouselTimeout);
    this.resizeCarouselTimeout = setTimeout(() => {
      this.setup();
    }, 200);
  }
}

export default Carousel;
