// DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  initNavScroll();
  initHashScroll();
  initCopyHandlers();
  initMembersHorizontalScroll();
});

// Плавный переход по кликам в шапке
function initNavScroll() {
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href").substring(1);
      if (!id) return;

      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    });
  });
}

// Скролл к секции при открытии страницы по хэшу
function initHashScroll() {
  const hash = window.location.hash.slice(1);
  if (!hash) return;

  const target = document.getElementById(hash);
  if (!target) return;

  if (hash === "Contact") {
    setTimeout(() => {
      highlightElement("Contact");
    }, 500);
  } else {
    target.scrollIntoView({ behavior: "smooth" });
  }
}

// Короткая подсветка секции
function highlightElement(id) {
  const element = document.getElementById(id);
  if (!element) return;

  element.classList.add("highlight");
  setTimeout(() => {
    element.classList.remove("highlight");
  }, 1000);
}

// Тост-уведомление
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

// Фолбек-копирование для старых браузеров
function fallbackCopy(text, successMessage) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);

  if (successMessage) {
    showToast(successMessage);
  }
}

// Копирование с учётом наличия navigator.clipboard
function copyToClipboard(text, successMessage) {
  if (!text) return;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(
      () => {
        if (successMessage) showToast(successMessage);
      },
      () => {
        fallbackCopy(text, successMessage);
      }
    );
  } else {
    fallbackCopy(text, successMessage);
  }
}

// Копирование email/телефонов
function initCopyHandlers() {
  const emailBlocks = document.querySelectorAll(".email-copy");

  emailBlocks.forEach((block) => {
    const email = block.dataset.email || (block.textContent || "").trim();

    block.addEventListener("click", () => {
      if (!email) return;
      copyToClipboard(email, "Email скопирован");
    });
  });

  // Глобальные хелперы для внешних вызовов
  window.copyPersonEmail = function (email) {
    if (!email) return;
    copyToClipboard(email, "Email скопирован");
  };

  window.copyPhoneNumber = function (phoneNumber) {
    const value = phoneNumber || "+7 (495) 123-45-67";
    copyToClipboard(value, "Номер телефона скопирован");
  };
}

// Горизонтальная прокрутка карточек
function initMembersHorizontalScroll() {
  const shells = document.querySelectorAll(".members-shell");

  shells.forEach((shell) => {
    const container = shell.querySelector(".members");
    if (!container) return;

    const prevBtn = shell.querySelector('[data-scroll-btn="prev"]');
    const nextBtn = shell.querySelector('[data-scroll-btn="next"]');

    const updateEdges = () => {
      if (!shell.classList.contains("is-scrollable")) return;

      const atStart = container.scrollLeft <= 5;
      const atEnd =
        container.scrollLeft + container.clientWidth >=
        container.scrollWidth - 5;

      shell.classList.toggle("at-start", atStart);
      shell.classList.toggle("at-end", atEnd);
    };

    const updateScrollState = () => {
      const scrollable = container.scrollWidth > container.clientWidth + 8;
      shell.classList.toggle("is-scrollable", scrollable);
      shell.classList.toggle("is-centered", !scrollable);

      if (!scrollable) {
        shell.classList.add("at-start", "at-end");
      } else {
        updateEdges();
      }
    };

    const scrollByAmount = (direction) => {
      const step = Math.max(container.clientWidth * 0.75, 320);
      container.scrollBy({ left: step * direction, behavior: "smooth" });
    };

    let bouncing = false;
    const triggerBounce = (direction) => {
      if (bouncing) return;
      bouncing = true;

      const className =
        direction === "left" ? "bounce-left" : "bounce-right";
      shell.classList.remove("bounce-left", "bounce-right");
      shell.classList.add(className);

      setTimeout(() => {
        shell.classList.remove(className);
        bouncing = false;
      }, 260);
    };

    container.addEventListener(
      "wheel",
      (event) => {
        if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
          return;
        }

        const maxScroll = container.scrollWidth - container.clientWidth;
        if (maxScroll <= 0) return;

        event.preventDefault();

        const nextLeft = container.scrollLeft + event.deltaY;
        if (nextLeft < 0) {
          container.scrollTo({ left: 0, behavior: "smooth" });
          triggerBounce("left");
          return;
        }

        if (nextLeft > maxScroll) {
          container.scrollTo({ left: maxScroll, behavior: "smooth" });
          triggerBounce("right");
          return;
        }

        container.scrollBy({ left: event.deltaY, behavior: "smooth" });
      },
      { passive: false }
    );

    container.addEventListener(
      "scroll",
      () => {
        updateEdges();
      },
      { passive: true }
    );

    const handleNav = (direction) => {
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (maxScroll <= 0) return;

      scrollByAmount(direction);
    };

    prevBtn?.addEventListener("click", () => handleNav(-1));
    nextBtn?.addEventListener("click", () => handleNav(1));

    window.addEventListener("resize", updateScrollState);

    updateScrollState();
    setTimeout(updateScrollState, 200);
  });
}
