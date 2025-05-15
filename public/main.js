// ------------------- Functions -------------------
function showError(input, errorEl) {
  input.classList.add("invalid");
  errorEl.style.display = "block";
}

function hideError(input, errorEl) {
  input.classList.remove("invalid");
  errorEl.style.display = "none";
}

function showToast(message, type = "success") {
  const toast = document.getElementById("success-toast");
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  setTimeout(() => toast.classList.remove("show"), 3000);
}

function resetField(input, errorEl) {
  input.value = "";
  input.classList.remove("valid", "invalid");
  if (errorEl) errorEl.style.display = "none";
}

// ------------------- Name Validation -------------------
const nameInput = document.getElementById("name");
const nameError = document.getElementById("name-error");

nameInput.addEventListener("blur", () => {
  const value = nameInput.value.trim();

  // Accepted characters: Letters, tildes and spaces, min 2 characters.
  const nameRegex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]{2,}$/;

  // Clean Clases
  nameInput.classList.remove("valid");
  nameInput.classList.remove("invalid");

  if (nameRegex.test(value)) {
    nameInput.classList.add("valid");
    nameError.style.display = "none";
    submitButton.disabled = false;
  } else {
    nameInput.classList.add("invalid");
    nameError.style.display = "block";
    submitButton.disabled = true;
  }
});

// ------------------- Phone Validation -------------------
const phoneInput = document.getElementById("phone");
const submitButton = document.querySelector('form button[type="submit"]');

new Cleave("#phone", {
  delimiters: ["(", ") ", "-", "-"],
  blocks: [0, 3, 3, 4],
  numericOnly: true,
});

phoneInput.addEventListener("input", () => {
  let raw = phoneInput.value.replace(/\D/g, ""); // Just numbers accepted
  if (raw.length === 10) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
});

// ------------------- Service Selection -------------------
const serviceSelect = document.getElementById("service-select");
const serviceError = document.getElementById("service-error");

const choicesInstance = new Choices(serviceSelect, {
  searchEnabled: true,
  itemSelectText: "",
  placeholder: true,
  searchPlaceholderValue: "Buscar servicio...",
  shouldSort: false,
  allowHTML: false,
});

// Validate with change
serviceSelect.addEventListener("change", () => {
  if (serviceSelect.value) {
    serviceSelect.classList.remove("invalid");
    serviceError.style.display = "none";
  }
});

// ------------------- Calendar -------------------
flatpickr("#datetime-picker", {
  enableTime: true,
  time_24hr: false,
  altInput: true,
  altFormat: "l, F j, Y - h:i K", // E.g. Thursday, May 15, 2025 - 03:30 PM
  dateFormat: "Y-m-d H:i",
  onChange: function () {
    const dateInput = document.getElementById("datetime-picker");
    const dateError = document.getElementById("date-error");
    dateInput.classList.remove("invalid");
    dateError.style.display = "none";
  },
});

// ------------------- Submit Form -------------------
const form = document.getElementById("appointment-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dateInput = document.getElementById("datetime-picker");
  const dateError = document.getElementById("date-error");
  const serviceSelect = document.getElementById("service-select");
  const serviceError = document.getElementById("service-error");

  let isValid = true;

  // Validate service
  if (!serviceSelect.value) {
    showError(serviceSelect, serviceError);
    isValid = false;
  } else {
    hideError(serviceSelect, serviceError);
  }

  // Validate date
  if (!dateInput.value) {
    showError(dateInput, dateError);
    isValid = false;
  } else {
    hideError(dateInput, dateError);
  }

  if (!isValid) return;

  // Send data
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    showToast(result.message || "¡Cita enviada con éxito!", "success");
  } catch (err) {
    showToast("Hubo un error al enviar la cita. Intenta nuevamente.", "error");
    return;
  }

  // Reset form manually
  resetField(nameInput, nameError);
  resetField(phoneInput);
  resetField(dateInput, dateError);
  if (dateInput._flatpickr) dateInput._flatpickr.clear();

  choicesInstance.removeActiveItems();
  choicesInstance.setChoiceByValue("");
  serviceSelect.classList.remove("valid", "invalid");
  serviceError.style.display = "none";

  document.getElementById("response-msg").textContent = "";
});