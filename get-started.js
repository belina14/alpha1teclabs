(() => {
  const state = {
    step: 1,
    plan: null,
    price: null,
    firstName: "",
    lastName: "",
    email: "",
    company: "",
  };

  const els = {
    sections: Array.from(document.querySelectorAll("[data-step-section]")),
    circles: {
      1: document.querySelector('[data-step-circle="1"]'),
      2: document.querySelector('[data-step-circle="2"]'),
      3: document.querySelector('[data-step-circle="3"]'),
    },
    lines: {
      1: document.querySelector('[data-step-line="1"]'),
      2: document.querySelector('[data-step-line="2"]'),
    },
    labels: {
      1: document.querySelector('[data-step-label="1"]'),
      2: document.querySelector('[data-step-label="2"]'),
      3: document.querySelector('[data-step-label="3"]'),
    },
    planCards: Array.from(document.querySelectorAll(".gs-plan-card")),
    btnContinue1: document.getElementById("gsContinue1"),
    btnContinue2: document.getElementById("gsContinue2"),
    btnBack2: document.getElementById("gsBack2"),
    btnBack3: document.getElementById("gsBack3"),
    btnComplete: document.getElementById("gsComplete"),
    form: document.getElementById("gsForm"),
    inputs: {
      firstName: document.getElementById("firstName"),
      lastName: document.getElementById("lastName"),
      email: document.getElementById("email"),
      company: document.getElementById("company"),
    },
    summary: {
      plan: document.getElementById("sumPlan"),
      price: document.getElementById("sumPrice"),
      name: document.getElementById("sumName"),
      email: document.getElementById("sumEmail"),
    },
    toast: document.getElementById("gsToast"),
    toastText: document.getElementById("gsToastText"),
  };

  let toastTimer = null;

  function showToast(message) {
    if (!els.toast || !els.toastText) return;
    els.toastText.textContent = message;
    els.toast.hidden = false;

    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      els.toast.hidden = true;
    }, 2600);
  }

  function setCircleDone(step) {
    const c = els.circles[step];
    if (!c) return;
    c.classList.remove("gs-circle-muted", "gs-circle-active");
    c.classList.add("gs-circle-done");
    c.textContent = "✓";
  }

  function setCircleActive(step) {
    const c = els.circles[step];
    if (!c) return;
    c.classList.remove("gs-circle-muted", "gs-circle-done");
    c.classList.add("gs-circle-active");
    c.textContent = String(step);
  }

  function setCircleMuted(step) {
    const c = els.circles[step];
    if (!c) return;
    c.classList.remove("gs-circle-active", "gs-circle-done");
    c.classList.add("gs-circle-muted");
    c.textContent = String(step);
  }

  function setLabelActive(step) {
    Object.entries(els.labels).forEach(([k, el]) => {
      if (!el) return;
      el.classList.toggle("gs-step-label-active", Number(k) === step);
    });
  }

  function setLineActive(lineIndex, active) {
    const line = els.lines[lineIndex];
    if (!line) return;
    line.classList.toggle("gs-line-active", Boolean(active));
  }

  function showStep(step) {
    state.step = step;

    els.sections.forEach((sec) => {
      const s = Number(sec.getAttribute("data-step-section"));
      sec.hidden = s !== step;
    });

    setLabelActive(step);

    if (step === 1) {
      setCircleActive(1);
      setCircleMuted(2);
      setCircleMuted(3);
      setLineActive(1, false);
      setLineActive(2, false);
    }

    if (step === 2) {
      setCircleDone(1);
      setCircleActive(2);
      setCircleMuted(3);
      setLineActive(1, true);
      setLineActive(2, false);
    }

    if (step === 3) {
      setCircleDone(1);
      setCircleDone(2);
      setCircleActive(3);
      setLineActive(1, true);
      setLineActive(2, true);
    }

    const current = document.querySelector(`[data-step-section="${step}"]`);
    if (current) current.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function clearPlanSelectionUI() {
    els.planCards.forEach((card) => card.classList.remove("gs-selected"));
  }

  function selectPlan(card) {
    const plan = card.getAttribute("data-plan");
    const price = card.getAttribute("data-price");
    if (!plan || !price) return;

    state.plan = plan;
    state.price = price;

    clearPlanSelectionUI();
    card.classList.add("gs-selected");
  }

  function isStep1Valid() {
    return Boolean(state.plan && state.price);
  }

  function readFormState() {
    state.firstName = (els.inputs.firstName?.value ?? "").trim();
    state.lastName = (els.inputs.lastName?.value ?? "").trim();
    state.email = (els.inputs.email?.value ?? "").trim();
    state.company = (els.inputs.company?.value ?? "").trim();
  }

  function isEmailValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isStep2Valid() {
    readFormState();
    if (!state.firstName) return false;
    if (!state.email) return false;
    if (!isEmailValid(state.email)) return false;
    return true;
  }

  function renderSummary() {
    const fullName = [state.firstName, state.lastName].filter(Boolean).join(" ");
    els.summary.plan.textContent = state.plan ?? "—";
    els.summary.price.textContent = state.price ?? "—";
    els.summary.name.textContent = fullName || "—";
    els.summary.email.textContent = state.email ?? "—";
  }

  function bindEvents() {
    els.planCards.forEach((card) => {
      card.addEventListener("click", () => selectPlan(card));
    });

    els.btnContinue1?.addEventListener("click", () => {
      if (!isStep1Valid()) {
        showToast("Please select a plan to continue");
        return;
      }
      showStep(2);
    });

    els.btnBack2?.addEventListener("click", () => showStep(1));

    els.btnContinue2?.addEventListener("click", () => {
      if (!isStep2Valid()) {
        showToast("Please fill in all required fields");
        return;
      }
      renderSummary();
      showStep(3);
    });

    els.btnBack3?.addEventListener("click", () => showStep(2));

    els.btnComplete?.addEventListener("click", () => {
      showToast("Order completed successfully!");
      // Optional: reset to step 1 after completion
      // setTimeout(() => showStep(1), 900);
    });

    els.form?.addEventListener("submit", (e) => e.preventDefault());
  }

  function init() {
    bindEvents();
    showStep(1);
  }

  init();
})();
