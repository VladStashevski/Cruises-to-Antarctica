const navigationMain = document.querySelector('.main-navigation');
const navigationToggle = document.querySelector('.main-navigation__toggle');
const showNavigation = document.querySelector('.main-navigation__wrapper');
const mobileNavigation = document.querySelector('.main-navigation__mobile-menu');
const menuItem = document.querySelectorAll('.main-navigation__wrapper a');

function handlerToggleMenu(item) {
  item.addEventListener('click', function () {
    if (navigationMain.classList.contains('main-navigation--closed')) {
      navigationMain.classList.remove('main-navigation--closed');
      showNavigation.classList.add('main-navigation__wrapper--show');
      navigationMain.classList.add('main-navigation--opened');
      mobileNavigation.classList.add('main-navigation__mobile-menu-on');
      disableScroll();
    } else {
      navigationMain.classList.add('main-navigation--closed');
      showNavigation.classList.remove('main-navigation__wrapper--show');
      navigationMain.classList.remove('main-navigation--opened');
      mobileNavigation.classList.remove('main-navigation__mobile-menu-on');
      document.body.classList.remove('disable-scroll');
      enableScroll();
    }
  });
}
handlerToggleMenu(navigationToggle);

function closedMenu() {
  let widthViewport = window.innerWidth;
  if (widthViewport > 767) {
    navigationMain.classList.add('main-navigation--closed');
    showNavigation.classList.remove('main-navigation__wrapper--show');
    navigationMain.classList.remove('main-navigation--opened');
    mobileNavigation.classList.remove('main-navigation__mobile-menu-on');
    enableScroll();
  }
}
window.addEventListener('resize', function () {
  closedMenu();
});

window.addEventListener('keydown', function (evt) {
  if (evt.keyCode === 27) {
    evt.preventDefault();
    if (showNavigation.classList.contains('main-navigation__wrapper--show')) {
      navigationMain.classList.add('main-navigation--closed');
      showNavigation.classList.remove('main-navigation__wrapper--show');
      navigationMain.classList.remove('main-navigation--opened');
      mobileNavigation.classList.remove('main-navigation__mobile-menu-on');
      enableScroll();
    }
  }
});

mobileNavigation.addEventListener('click', function () {
  if (showNavigation.classList.contains('main-navigation__wrapper--show')) {
    navigationMain.classList.add('main-navigation--closed');
    showNavigation.classList.remove('main-navigation__wrapper--show');
    navigationMain.classList.remove('main-navigation--opened');
    mobileNavigation.classList.remove('main-navigation__mobile-menu-on');
    enableScroll();
  }
});

menuItem.forEach((item) => {
  item.addEventListener('click', function () {
    navigationMain.classList.add('main-navigation--closed');
    navigationMain.classList.remove('main-navigation--opened');
    mobileNavigation.classList.remove('main-navigation__mobile-menu-on');
    enableScroll();
  });
});

navigationMain.classList.remove('main-navigation--nojs');

const disableScroll = function () {
  document.body.classList.add('disable-scroll');
};

const enableScroll = function () {
  document.body.classList.remove('disable-scroll');
};

// Маска ввода номера телефона
/* eslint-disable indent */
/* eslint-disable eqeqeq */
/* eslint-disable one-var */
/* eslint-disable camelcase */
/* eslint-disable curly */
/* eslint-disable no-invalid-this */
/* eslint-disable no-unused-expressions */

export const iosChecker = () => {
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

export {iosVhFix};


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
