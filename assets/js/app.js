function setupFaqAccordion() {
  const items = document.querySelectorAll(".faq-item");
  if (!items.length) return;

  items.forEach((item) => {
    const btn = item.querySelector(".faq-q");
    const panel = item.querySelector(".faq-a");
    if (!btn || !panel) return;

    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";

      items.forEach((other) => {
        const otherBtn = other.querySelector(".faq-q");
        const otherPanel = other.querySelector(".faq-a");
        if (!otherBtn || !otherPanel) return;
        otherBtn.setAttribute("aria-expanded", "false");
        otherPanel.hidden = true;
        other.classList.remove("is-open");
      });

      // toggle bieżącego
      btn.setAttribute("aria-expanded", String(!isOpen));
      panel.hidden = isOpen;
      item.classList.toggle("is-open", !isOpen);
    });
  });
}

function setupFaqSearch() {
  const search = document.getElementById("faqSearch");
  const list = document.getElementById("faqList");
  const empty = document.getElementById("faqEmpty");
  const count = document.getElementById("faqCount");

  if (!search || !list) return;

  const items = Array.from(list.querySelectorAll(".faq-item"));

  function normalize(str) {
    return (str || "").toLowerCase().trim();
  }

  function update() {
    const q = normalize(search.value);
    let visible = 0;

    items.forEach((item) => {
      const text = normalize(item.innerText);
      const tags = normalize(item.getAttribute("data-tags"));
      const hit = !q || text.includes(q) || tags.includes(q);

      item.style.display = hit ? "" : "none";
      if (hit) visible++;

      if (!hit) {
        const btn = item.querySelector(".faq-q");
        const panel = item.querySelector(".faq-a");
        if (btn && panel) {
          btn.setAttribute("aria-expanded", "false");
          panel.hidden = true;
        }
        item.classList.remove("is-open");
      }
    });

    if (count) {
      count.textContent = q ? `${visible} treff` : "";
    }
    if (empty) empty.hidden = visible !== 0;
  }

  search.addEventListener("input", update);
  update();
}

document.addEventListener("DOMContentLoaded", () => {
  setupFaqAccordion();
  setupFaqSearch();
});

// ===== BESTILL TIME =====

function setupBookingForm() {
  const form = document.getElementById("bookingForm");
  const confirmation = document.getElementById("bookingConfirmation");
  if (!form || !confirmation) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    form.hidden = true;
    confirmation.hidden = false;
    confirmation.scrollIntoView({ behavior: "smooth" });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupBookingForm();
});
