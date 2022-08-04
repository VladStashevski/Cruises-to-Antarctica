const iosChecker = () => {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
  // iPad on iOS 13 detection
  || (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
};

const iosVhFix = () => {
  if (!(!!window.MSInputMethodContext && !!document.documentMode)) {
    if (iosChecker()) {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);

      window.addEventListener('resize', function () {
        vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      });
    }
  }
};

class ScrollLock {
  constructor() {
    this._iosChecker = iosChecker;
    this._lockClass = this._iosChecker() ? 'scroll-lock-ios' : 'scroll-lock';
    this._scrollTop = null;
    this._fixedBlockElements = document.querySelectorAll('[data-fix-block]');
  }

  _getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  _getBodyScrollTop() {
    return (
      self.pageYOffset ||
      (document.documentElement && document.documentElement.ScrollTop) ||
      (document.body && document.body.scrollTop)
    );
  }

  disableScrolling() {
    this._scrollTop = document.body.dataset.scroll = document.body.dataset.scroll ? document.body.dataset.scroll : this._getBodyScrollTop();
    if (this._getScrollbarWidth()) {
      document.body.style.paddingRight = `${this._getScrollbarWidth()}px`;
      this._fixedBlockElements.forEach((block) => {
        block.style.paddingRight = `${this._getScrollbarWidth()}px`;
      });
    }
    document.body.style.top = `-${this._scrollTop}px`;
    document.body.classList.add(this._lockClass);
  }

  enableScrolling() {
    document.body.classList.remove(this._lockClass);
    window.scrollTo(0, +document.body.dataset.scroll);
    document.body.style.paddingRight = null;
    document.body.style.top = null;
    this._fixedBlockElements.forEach((block) => {
      block.style.paddingRight = null;
    });
    document.body.removeAttribute('data-scroll');
    this._scrollTop = null;
  }
}

window.scrollLock = new ScrollLock();


const SELECTORS = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
  'select:not([disabled]):not([aria-hidden])',
  'textarea:not([disabled]):not([aria-hidden])',
  'button:not([disabled]):not([aria-hidden])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]',
  '[tabindex]:not([tabindex^="-"])'
];

export class FocusLock {
  constructor() {
    this._lockedSelector = null;
    this._focusableElements = null;
    this._endElement = null;
    this._selectors = SELECTORS;

    this._documentKeydownHandler = this._documentKeydownHandler.bind(this);
  }

  _documentKeydownHandler(evt) {
    const activeElement = document.activeElement;
    if (evt.key === 'Tab') {
      if (!this._focusableElements.length) {
        evt.preventDefault();
        activeElement.blur();
        return;
      }
      if (this._focusableElements.length === 1) {
        evt.preventDefault();
        this._focusableElements[0].focus();
        return;
      }
      if (this._focusableElements.length > 1 && !activeElement.closest(this._lockedSelector)) {
        evt.preventDefault();
        this._focusableElements[0].focus();
        return;
      }
    }
    if (evt.key === 'Tab' && !evt.shiftKey && activeElement === this._focusableElements[this._focusableElements.length - 1]) {
      evt.preventDefault();
      this._focusableElements[0].focus();
    }
    if (evt.key === 'Tab' && evt.shiftKey && activeElement === this._focusableElements[0]) {
      evt.preventDefault();
      this._focusableElements[this._focusableElements.length - 1].focus();
    }
  }

  lock(lockedSelector, startFocus = true) {
    this.unlock();
    this._lockedSelector = lockedSelector;
    const lockedElement = document.querySelector(this._lockedSelector);
    if (!lockedElement) {
      return;
    }
    this._focusableElements = lockedElement.querySelectorAll(this._selectors);
    this._endElement = document.activeElement;
    const startElement = lockedElement.querySelector('[data-focus]') || this._focusableElements[0];
    if (this._endElement) {
      this._endElement.blur();
    }
    if (startElement && startFocus) {
      startElement.focus();
    }
    document.addEventListener('keydown', this._documentKeydownHandler);
  }

  unlock(returnFocus = true) {
    if (this._endElement && returnFocus) {
      this._endElement.focus();
    }
    this._lockedSelector = null;
    this._focusableElements = null;
    this._endElement = null;
    document.removeEventListener('keydown', this._documentKeydownHandler);
  }
}

window.focusLock = new FocusLock();

class Modals {
  constructor(settings = {}) {
    this._scrollLock = new ScrollLock();
    this._focusLock = new FocusLock();

    this._modalOpenElements = document.querySelectorAll('[data-open-modal]');
    this._openedModalElement = null;
    this._modalName = null;
    this._enableScrolling = true;
    this._settingKey = 'default';

    this._settings = settings;
    this._preventDefault = this._settings[this._settingKey].preventDefault;
    this._stopPlay = this._settings[this._settingKey].stopPlay;
    this._lockFocus = this._settings[this._settingKey].lockFocus;
    this._startFocus = this._settings[this._settingKey].startFocus;
    this._focusBack = this._settings[this._settingKey].focusBack;
    this._eventTimeout = this._settings[this._settingKey].eventTimeout;
    this._openCallback = this._settings[this._settingKey].openCallback;
    this._closeCallback = this._settings[this._settingKey].closeCallback;

    this._documentKeydownHandler = this._documentKeydownHandler.bind(this);
    this._documentClickHandler = this._documentClickHandler.bind(this);
    this._modalClickHandler = this._modalClickHandler.bind(this);

    this._init();
  }

  _init() {
    if (this._modalOpenElements.length) {
      document.addEventListener('click', this._documentClickHandler);
    }
  }

  _setSettings(settingKey = this._settingKey) {
    if (!this._settings[settingKey]) {
      return;
    }

    this._preventDefault =
      typeof this._settings[settingKey].preventDefault === 'boolean'
        ? this._settings[settingKey].preventDefault
        : this._settings[this._settingKey].preventDefault;
    this._stopPlay =
      typeof this._settings[settingKey].stopPlay === 'boolean'
        ? this._settings[settingKey].stopPlay
        : this._settings[this._settingKey].stopPlay;
    this._lockFocus =
      typeof this._settings[settingKey].lockFocus === 'boolean'
        ? this._settings[settingKey].lockFocus
        : this._settings[this._settingKey].lockFocus;
    this._startFocus =
      typeof this._settings[settingKey].startFocus === 'boolean'
        ? this._settings[settingKey].startFocus
        : this._settings[this._settingKey].startFocus;
    this._focusBack =
      typeof this._settings[settingKey].lockFocus === 'boolean'
        ? this._settings[settingKey].focusBack
        : this._settings[this._settingKey].focusBack;
    this._eventTimeout =
      typeof this._settings[settingKey].eventTimeout === 'number'
        ? this._settings[settingKey].eventTimeout
        : this._settings[this._settingKey].eventTimeout;
    this._openCallback = this._settings[settingKey].openCallback || this._settings[this._settingKey].openCallback;
    this._closeCallback = this._settings[settingKey].closeCallback || this._settings[this._settingKey].closeCallback;
  }

  _documentClickHandler(evt) {
    const target = evt.target;

    if (!target.closest('[data-open-modal]')) {
      return;
    }

    evt.preventDefault();

    this._modalName = target.closest('[data-open-modal]').dataset.openModal;

    if (!this._modalName) {
      return;
    }

    this.open();
  }

  _documentKeydownHandler(evt) {
    const isEscKey = evt.key === 'Escape' || evt.key === 'Esc';

    if (isEscKey) {
      evt.preventDefault();
      this.close(document.querySelector('.modal.is-active').dataset.modal);
    }
  }

  _modalClickHandler(evt) {
    const target = evt.target;

    if (!target.closest('[data-close-modal]')) {
      return;
    }

    this.close(target.closest('[data-modal]').dataset.modal);
  }

  _addListeners(modal) {
    modal.addEventListener('click', this._modalClickHandler);
    document.addEventListener('keydown', this._documentKeydownHandler);
  }

  _removeListeners(modal) {
    modal.removeEventListener('click', this._modalClickHandler);
    document.removeEventListener('keydown', this._documentKeydownHandler);
  }

  _stopInteractive(modal) {
    if (this._stopPlay) {
      modal.querySelectorAll('video, audio').forEach((el) => el.pause());
      modal.querySelectorAll('[data-iframe]').forEach((el) => {
        el.querySelector('iframe').contentWindow.postMessage('{"event": "command", "func": "pauseVideo", "args": ""}', '*');
      });
    }
  }

  _autoPlay(modal) {
    modal.querySelectorAll('[data-iframe]').forEach((el) => {
      const autoPlay = el.closest('[data-auto-play]');
      if (autoPlay) {
        el.querySelector('iframe').contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      }
    });
  }

  open(modalName = this._modalName) {
    const modal = document.querySelector(`[data-modal="${modalName}"]`);

    if (!modal || modal.classList.contains('is-active')) {
      return;
    }

    document.removeEventListener('click', this._documentClickHandler);

    this._openedModalElement = document.querySelector('.modal.is-active');

    if (this._openedModalElement) {
      this._enableScrolling = false;
      this.close(this._openedModalElement.dataset.modal);
    }

    this._setSettings(modalName);
    modal.classList.add('is-active');

    if (!this._openedModalElement) {
      this._scrollLock.disableScrolling();
    }

    if (this._openCallback) {
      this._openCallback();
    }

    if (this._lockFocus) {
      this._focusLock.lock('.modal.is-active', this._startFocus);
    }

    setTimeout(() => {
      this._addListeners(modal);
      this._autoPlay(modal);
      document.addEventListener('click', this._documentClickHandler);
    }, this._eventTimeout);
  }

  close(modalName = this._modalName) {
    const modal = document.querySelector(`[data-modal="${modalName}"]`);
    document.removeEventListener('click', this._documentClickHandler);

    if (!modal || !modal.classList.contains('is-active')) {
      return;
    }

    if (this._lockFocus) {
      this._focusLock.unlock(this._focusBack);
    }

    modal.classList.remove('is-active');
    this._removeListeners(modal);
    this._stopInteractive(modal);

    if (this._closeCallback) {
      this._closeCallback();
    }

    if (this._enableScrolling) {
      setTimeout(() => {
        this._scrollLock.enableScrolling();
      }, this._eventTimeout);
    }

    setTimeout(() => {
      document.addEventListener('click', this._documentClickHandler);
    }, this._eventTimeout);

    this._setSettings('default');
    this._enableScrolling = true;
  }
}


let modals;

// Здесь реализован пример открытия модалки через колбэк закрытия
// const openModalInCloseCallback = (name, context = this) => {
//   context._enableScrolling = false;
//   context._setSettings('default');
//   modals.open(name);
// };

// closeCallback() {
//   openModalInCloseCallback('modal-5');
// },

const settings = {
  'default': {
    preventDefault: true,
    stopPlay: true,
    lockFocus: true,
    startFocus: true,
    focusBack: true,
    eventTimeout: 300,
    openCallback: false,
    closeCallback: false,
  },
};

const initModals = () => {
  const modalElements = document.querySelectorAll('.modal');
  modalElements.forEach((el) => {
    setTimeout(() => {
      el.classList.remove('modal--preload');
    }, 100);
  });
  modals = new Modals(settings);
  // Используйте в разработке экспортируемую переменную modals, window сделан для бэкэнда
  window.modals = modals;
};


const pageHeader = document.querySelector('.page-header');
const menuElement = pageHeader.querySelector('.main-nav');
const menuToggleButton = pageHeader.querySelector('.main-nav__toggle');

const setLinkSmoothScroll = (link) => {
  link.addEventListener('click', function (evt) {
    evt.preventDefault();
    const sectionID = link.getAttribute('href').substr(1);

    setTimeout(() => {
      document.getElementById(sectionID).scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 400);
  });
};

const initMobileMenu = () => {
  if (menuElement) {
    menuElement.classList.remove('main-nav--nojs');
    menuToggleButton.classList.remove('main-nav__toggle--nojs');

    const anchors = document.querySelectorAll('.main-nav__link');

    for (let anchor of anchors) {
      setLinkSmoothScroll(anchor);
    }
  }
};

const updateModalMenu = () => {
  const inlineNavList = pageHeader.querySelector('.main-nav__list');
  const modalNavList = document.querySelector('.modal[data-modal="mobile-menu"]').querySelector('.main-nav__list');

  modalNavList.innerHTML = inlineNavList.innerHTML;

  const links = modalNavList.querySelectorAll('.main-nav__link');

  for (let link of links) {
    link.dataset.closeModal = '';
    setLinkSmoothScroll(link);
  }

};

const updateInlineMenu = () => {
  const inlineNavList = pageHeader.querySelector('.main-nav__list');
  const modalNavList = document.querySelector('.modal[data-modal="mobile-menu"]').querySelector('.main-nav__list');

  inlineNavList.innerHTML = modalNavList.innerHTML;

  const links = inlineNavList.querySelectorAll('.main-nav__link');

  for (let link of links) {
    link.removeAttribute('data-close-modal');
  }
};

const breakpoint = window.matchMedia('(max-width:767px)');

const breakpointChecker = () => {
  if (breakpoint.matches) {
    updateModalMenu();
  } else {
    updateInlineMenu();
  }
};

window.addEventListener('DOMContentLoaded', () => {

  // Utils
  // ---------------------------------

  iosVhFix();
  initMobileMenu();
  breakpoint.addListener(breakpointChecker);
  breakpointChecker();


  // Modules
  // ---------------------------------

  // все скрипты должны быть в обработчике 'DOMContentLoaded', но не все в 'load'
  // в load следует добавить скрипты, не участвующие в работе первого экрана
  window.addEventListener('load', () => {
    initModals();
  });
});
