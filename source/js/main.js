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

window.addEventListener('DOMContentLoaded', function () {
  [].forEach.call(
      document.querySelectorAll('#input-tel input'),
      function (input) {
        let keyCode;
        function mask(event) {
          event.keyCode && (keyCode = event.keyCode);
          let pos = this.selectionStart;
          if (pos < 3) event.preventDefault();
          let matrix = '8___ ___ ____',
            i = 0,
            def = matrix.replace(/\D/g, ''),
            val = this.value.replace(/\D/g, ''),
            new_value = matrix.replace(/[_\d]/g, function (a) {
              return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
            });
          i = new_value.indexOf('_');
          if (i != -1) {
            i < 5 && (i = 3);
            new_value = new_value.slice(0, i);
          }
          let reg = matrix
              .substr(0, this.value.length)
              .replace(/_+/g, function (a) {
                return '\\d{1,' + a.length + '}';
              })
              .replace(/[+()]/g, '\\$&');
          reg = new RegExp('^' + reg + '$');
          if (
          !reg.test(this.value) ||
          this.value.length < 5 ||
          (keyCode > 47 && keyCode < 58)
          )
            this.value = new_value;
          if (event.type == 'blur' && this.value.length < 5) this.value = '';
        }

        input.addEventListener('input', mask, false);
        input.addEventListener('focus', mask, false);
        input.addEventListener('blur', mask, false);
        input.addEventListener('keydown', mask, false);
      }
  );
});
