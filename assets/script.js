//Expertise tab

const tabs = document.querySelector(".expertise-nav");
const tabButton = document.querySelectorAll(".expertise-link");
const contents = document.querySelectorAll(".expertise-tab");

tabs.onclick = (e) => {
  e.preventDefault();
  const id = e.target.dataset.id;
  if (id) {
    tabButton.forEach((btn) => {
      btn.classList.remove("active");
    });
    e.target.classList.add("active");
    contents.forEach((content) => {
      content.classList.remove("active");
    });
    const element = document.getElementById(id);
    element.classList.add("active");
  }
};

//portfolio-filter

const filterContainer = document.querySelector(".portfolio-filter"),
  galleryItems = document.querySelectorAll(".portfolio-item");

filterContainer.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.classList.contains("portfolio-nav-link")) {
    filterContainer.querySelector(".active").classList.remove(".active");
    e.target.classList.add("active");
    const filterValue = e.target.getAttribute("data-id");
    galleryItems.forEach((item) => {
      if (item.classList.contains(filterValue) || filterValue === "all") {
        item.classList.remove("hide");
        item.classList.add("show");
      } else {
        item.classList.remove("show");
        item.classList.add("hide");
      }
    });
  }
});

//portfolio-filter

function stickyElement(e) {
  var header = document.querySelector("#slide-carousel");
  var headerHeight = getComputedStyle(header).height.split("px")[0];
  headerHeight = headerHeight / 2;
  var navbar = document.querySelector(".header-fixed");
  var scrollValue = window.scrollY;
  if (scrollValue > headerHeight) {
    navbar.classList.add("header-sticky");
  } else {
    navbar.classList.remove("header-sticky");
  }
}

window.addEventListener("scroll", stickyElement);

// Testimonials slider
$("#slider").owlCarousel({
  loop: true,
  margin: 15,
  nav: false,
  autoplay: true,
  responsive: {
    0: {
      items: 1,
    },
    600: {
      items: 2,
    },
    1000: {
      items: 3,
    },
  },
});
//js for fixed header

function stickyElement(e) {
  var header = document.querySelector("#hero-section");
  var headerHeight = getComputedStyle(header).height.split("px")[0];
  headerHeight = headerHeight / 2;
  var navbar = document.querySelector("header-fixed");
  var scrollValue = window.scrollY;
  if (scrollValue > headerHeight) {
    navbar.classList.add("header-sticky");
  } else {
    navbar.classList.remove("header-sticky");
  }
}

window.addEventListener("scroll", stickyElement);

//Responsive navbar toogle
const hamburger = document.querySelector(".hamburger");
hamburger.addEventListener("click", function () {
  document.querySelector(".header-navbar").classList.toggle("show");
});
