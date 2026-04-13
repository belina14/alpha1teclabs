(() => {
  const form = document.getElementById("supportTicketForm");
  const toast = document.getElementById("supportToast");
  const toastText = document.getElementById("supportToastText");

  let t = null;

  function showToast(msg) {
    if (!toast || !toastText) return;
    toastText.textContent = msg;
    toast.hidden = false;
    if (t) clearTimeout(t);
    t = setTimeout(() => (toast.hidden = true), 2600);
  }

  function isEmailValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form?.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = (form.querySelector('[name="name"]')?.value || "").trim();
    const email = (form.querySelector('[name="email"]')?.value || "").trim();
    const message = (form.querySelector('[name="message"]')?.value || "").trim();

    if (!name || !email || !message) {
      showToast("Please fill in all required fields");
      return;
    }

    if (!isEmailValid(email)) {
      showToast("Please enter a valid email address");
      return;
    }

    showToast("Ticket submitted successfully!");
    form.reset();
  });
})();
