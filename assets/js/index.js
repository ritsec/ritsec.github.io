// Header
$(window).scroll(function () {
  var scroll = $(window).scrollTop();

  if (scroll >= 80) {
    $(".header").addClass("border-bottom");
  } else {
    $(".header").removeClass("border-bottom");
  }
});

(() => {
  $(".navbar-burger").click(() => {
    $(".navbar-links").toggleClass("navbar-active");
    $(".navbar-burger").toggleClass("navbar-burger-active");

    $(".navbar-links li").each((i, el) => {
      if (el.style.animation) {
        el.style.animation = "";
      } else {
        el.style.animation = `navbar-link-fade 0.5s ease forwards 0.2s`;
      }
    });
  });
})();

// Slideshow
$("#slideshow > img:gt(0)").hide();

setInterval(function () {
  $("#slideshow > img:first")
    .fadeOut(1000)
    .next()
    .fadeIn(1000)
    .end()
    .appendTo("#slideshow");
}, 5000);

//Dark Light Toggle
toggleButton = document.querySelector("#toggle-mode")
function isLight() {
  return localStorage.getItem("light-mode");
}
function toggleRootClass() {
  document.documentElement.classList.toggle('light');
}
function toggleLocalStorageItem() {
  if (isLight()) {
    localStorage.removeItem("light-mode");
  } else {
    localStorage.setItem("light-mode", "set");
  }
}
if (isLight()) {
  toggleRootClass();
  toggleButton.checked = true;
}
toggleButton.addEventListener("click", () => {
  toggleLocalStorageItem();
  toggleRootClass();
});


// window.addEventListener('scroll', function() {
//   document.body.style.backgroundPositionY = -window.pageYOffset/8 + "px";
// });
