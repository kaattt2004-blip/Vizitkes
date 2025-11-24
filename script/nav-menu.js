document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.querySelector(".toggle-button");
  const closeButton = document.querySelector(".close-button");
  const mobileNav = document.querySelector("nav ul");
  const navItems = document.querySelectorAll("nav ul li a");
  const breakpoint = 876;

  if (!toggleButton || !closeButton || !mobileNav) {
    return;
  }

  const openMenu = () => {
    mobileNav.style.display = "block";
    closeButton.style.display = "block";
  };

  const closeMenu = () => {
    mobileNav.style.display = "none";
    closeButton.style.display = "none";
  };

  const syncByViewport = () => {
    if (window.innerWidth >= breakpoint) {
      mobileNav.style.display = "flex";
      closeButton.style.display = "none";
    } else {
      mobileNav.style.display = "none";
      closeButton.style.display = "none";
    }
  };

  toggleButton.addEventListener("click", openMenu);
  closeButton.addEventListener("click", closeMenu);

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (window.innerWidth < breakpoint) {
        closeMenu();
      }
    });
  });

  window.addEventListener("resize", syncByViewport);
  syncByViewport();
});
