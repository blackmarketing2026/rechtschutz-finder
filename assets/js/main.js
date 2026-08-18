document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav__toggle");
  var links = document.querySelector(".nav__links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    links.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  initCompareTableFilter();
  initFormStub("contact-form", "contact-status", "Danke für deine Nachricht! Wir melden uns in Kürze.");
  initFormStub("newsletter-form", "newsletter-status", "Danke! Bitte bestätige die Anmeldung über den Link in deiner E-Mail.");
  markAffiliateElements();
});

/**
 * Ergänzt bei allen Affiliate-Elementen (Attribut data-affiliate) einen
 * für Screenreader hörbaren Hinweis. Das sichtbare Sternchen selbst wird
 * unabhängig von JavaScript per CSS (::after) dargestellt, damit die
 * Kennzeichnung auch ohne aktiviertes JavaScript zuverlässig sichtbar ist.
 */
function markAffiliateElements() {
  document.querySelectorAll("[data-affiliate]").forEach(function (el) {
    if (el.querySelector(".affiliate-sr-label")) return;
    var srLabel = document.createElement("span");
    srLabel.className = "affiliate-sr-label visually-hidden";
    srLabel.textContent = " (Affiliate-Link/Werbung)";
    el.appendChild(srLabel);
  });
}

function initCompareTableFilter() {
  var buttons = document.querySelectorAll(".filter-btn");
  var rows = document.querySelectorAll(".compare-table tbody tr");
  if (!buttons.length || !rows.length) return;

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      buttons.forEach(function (b) { b.classList.remove("is-active"); });
      button.classList.add("is-active");

      var filter = button.getAttribute("data-filter");
      rows.forEach(function (row) {
        var tags = (row.getAttribute("data-tags") || "").split(" ");
        var show = filter === "alle" || tags.indexOf(filter) !== -1;
        row.classList.toggle("is-hidden", !show);
      });
    });
  });
}

/**
 * Kein Backend angebunden: validiert client-seitig und zeigt eine
 * Bestätigung an. Bei echter Anbindung hier den fetch()-Aufruf ergänzen.
 */
function initFormStub(formId, statusId, successMessage) {
  var form = document.getElementById(formId);
  var status = document.getElementById(statusId);
  if (!form || !status) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      status.textContent = "Bitte fülle alle Pflichtfelder korrekt aus.";
      status.className = "form-status error";
      return;
    }

    status.textContent = successMessage;
    status.className = "form-status success";
    form.reset();
  });
}
