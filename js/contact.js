// contact.js
// Accessible client-side validation for the contact form.
// There is no backend attached — this only validates and shows a
// confirmation state; it does not actually transmit the message.

function setError(field, message) {
  const wrap = field.closest(".field");
  if (!wrap) return;
  const errorEl = wrap.querySelector(".error-msg");
  if (message) {
    wrap.classList.add("has-error");
    if (errorEl) errorEl.textContent = message;
    field.setAttribute("aria-invalid", "true");
  } else {
    wrap.classList.remove("has-error");
    if (errorEl) errorEl.textContent = "";
    field.removeAttribute("aria-invalid");
  }
}

function validateField(field) {
  const value = field.value.trim();

  if (field.hasAttribute("required") && !value) {
    setError(field, "This field is required.");
    return false;
  }

  if (field.type === "email" && value) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      setError(field, "Enter a valid email address.");
      return false;
    }
  }

  if (field.type === "tel" && value) {
    const phonePattern = /^[0-9+()\s-]{7,}$/;
    if (!phonePattern.test(value)) {
      setError(field, "Enter a valid phone number.");
      return false;
    }
  }

  setError(field, "");
  return true;
}

export function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const status = document.getElementById("contact-status");
  const fields = form.querySelectorAll("input[required], textarea[required], input[type='email'], input[type='tel']");

  fields.forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let allValid = true;
    fields.forEach((field) => {
      if (!validateField(field)) allValid = false;
    });

    if (!allValid) {
      if (status) {
        status.textContent = "Please fix the highlighted fields and try again.";
        status.classList.add("is-visible");
      }
      form.querySelector(".has-error input, .has-error textarea, .has-error select")?.focus();
      return;
    }

    if (status) {
      status.textContent =
        "Thanks — this form is a working demo without a live inbox behind it yet. For a real reply, please reach us on WhatsApp or email using the details alongside this form.";
      status.classList.add("is-visible");
    }
    form.reset();
  });
}

document.addEventListener("DOMContentLoaded", initContactForm);
