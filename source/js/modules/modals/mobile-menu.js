const navigationMain = document.querySelector(".main-navigation");
const navigationToggle = document.querySelector(".main-navigation__toggle");
const showNavigation = document.querySelector(".main-navigation__wrapper");
const mobileNavigation = document.querySelector(".main-navigation__mobile-menu");
const menuItem = document.querySelectorAll(".main-navigation__wrapper a");

function handlerToggleMenu(item) {
  item.addEventListener("click", function () {
    if (navigationMain.classList.contains("main-navigation--closed")) {
      navigationMain.classList.remove("main-navigation--closed");
      showNavigation.classList.add("main-navigation__wrapper--show");
      navigationMain.classList.add("main-navigation--opened");
      mobileNavigation.classList.add("main-navigation__mobile-menu-on");
      disableScroll();
    } else {
      navigationMain.classList.add("main-navigation--closed");
      showNavigation.classList.remove("main-navigation__wrapper--show");
      navigationMain.classList.remove("main-navigation--opened");
      mobileNavigation.classList.remove("main-navigation__mobile-menu-on");
      document.body.classList.remove("disable-scroll");
      enableScroll();
    }
  });
}
handlerToggleMenu(navigationToggle);

function closedMenu() {
  let widthViewport = window.innerWidth;
  if (widthViewport > 767) {
    navigationMain.classList.add("main-navigation--closed");
    showNavigation.classList.remove("main-navigation__wrapper--show");
    navigationMain.classList.remove("main-navigation--opened");
    mobileNavigation.classList.remove("main-navigation__mobile-menu-on");
    enableScroll();
  }
}
window.addEventListener("resize", function () {
  closedMenu();
});

window.addEventListener("keydown", function (evt) {
  if (evt.keyCode === 27) {
    evt.preventDefault();
    if (showNavigation.classList.contains("main-navigation__wrapper--show")) {
      navigationMain.classList.add("main-navigation--closed");
      showNavigation.classList.remove("main-navigation__wrapper--show");
      navigationMain.classList.remove("main-navigation--opened");
      mobileNavigation.classList.remove("main-navigation__mobile-menu-on");
      enableScroll();
    }
  }
});

mobileNavigation.addEventListener("click", function () {
  if (showNavigation.classList.contains("main-navigation__wrapper--show")) {
    navigationMain.classList.add("main-navigation--closed");
    showNavigation.classList.remove("main-navigation__wrapper--show");
    navigationMain.classList.remove("main-navigation--opened");
    mobileNavigation.classList.remove("main-navigation__mobile-menu-on");
    enableScroll();
  }
});

menuItem.forEach((item) => {
  item.addEventListener("click", function () {
    navigationMain.classList.add("main-navigation--closed");
    navigationMain.classList.remove("main-navigation--opened");
    mobileNavigation.classList.remove("main-navigation__mobile-menu-on");
    enableScroll();
  });
});

navigationMain.classList.remove("main-navigation--nojs");

const disableScroll = function () {
	document.body.classList.add('disable-scroll');
}

const enableScroll = function () {
	document.body.classList.remove('disable-scroll');
}
