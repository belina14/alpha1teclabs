/*
  Demo-only: generates realistic-looking availability & pricing.
  Real domain availability needs a backend + registrar API.
*/
(() => {
  const BRAND_BASE = "alpha1teclabs"; // <-- change if you want another default name

  const TLD_PRICES = {
    ".com": 19.54,
    ".net": 22.99,
    ".org": 22.99,
    ".uk": 5.36,
    ".co.uk": 5.36,
    ".org.uk": 5.36,
    ".ltd.uk": 5.36,
    ".plc.uk": 5.36,
    ".io": 41.23,
  };

  // IMPORTANT: match longer TLDs first (.co.uk before .uk)
  const tlds = Object.keys(TLD_PRICES).sort((a, b) => b.length - a.length);

  const queryEl = document.getElementById("domainQuery");
  const searchBtn = document.getElementById("domainSearchBtn");
  const resultsWrap = document.getElementById("domainResults");
  const resultsTitle = document.getElementById("resultsTitle");
  const resultsList = document.getElementById("resultsList");
  const presetButtons = Array.from(document.querySelectorAll(".domains-ext-btn"));

  function normalizeQuery(raw) {
    return (raw ?? "").trim().toLowerCase().replace(/\s+/g, "-");
  }

  function hashString(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i += 1) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function isAvailable(domain) {
    return (hashString(domain) % 100) < 60; // ~60% available
  }

  function formatPrice(n) {
    return `£${n.toFixed(2)}/yr`;
  }

  function buildSuggestions(q) {
    // If user clicked an extension button OR typed only an extension (".co.uk")
    if (q.startsWith(".")) {
      const ext = q; // keep dots exactly
      return [`${BRAND_BASE}${ext}`]; // ONLY one, no "yourname" variants
    }

    // If user typed a full domain (contains a dot), return it as-is
    if (q.includes(".")) {
      return [q];
    }

    // Otherwise user typed a name: generate all TLD options
    const clean = q.replace(/[^a-z0-9-]/g, "") || BRAND_BASE;
    return tlds.map((tld) => `${clean}${tld}`);
  }

  function priceForDomain(domain) {
    const matched = tlds.find((t) => domain.endsWith(t));
    const base = matched ? TLD_PRICES[matched] : 19.99;
    const bump = (hashString(domain) % 101) / 100; // 0.00 - 1.00
    return base + (matched === ".io" ? bump * 2 : bump);
  }

  function renderResults(rawQuery) {
    const q = normalizeQuery(rawQuery);
    if (!q) {
      resultsWrap.hidden = true;
      resultsList.innerHTML = "";
      return;
    }

    const suggestions = buildSuggestions(q);
    resultsTitle.textContent = `Results for "${q}"`;

    resultsList.innerHTML = suggestions
      .map((domain) => {
        const available = isAvailable(domain);
        const price = priceForDomain(domain);

        if (!available) {
          return `
            <div class="domain-row taken">
              <div class="domain-left">
                <div class="domain-name">${domain}</div>
                <div class="badge taken">Taken</div>
              </div>
              <div class="domain-right">
                <div class="domain-action disabled">Not available</div>
              </div>
            </div>
          `;
        }

        return `
          <div class="domain-row">
            <div class="domain-left">
              <div class="domain-name">${domain}</div>
              <div class="badge available">Available</div>
            </div>
            <div class="domain-right">
              <div class="domain-price">${formatPrice(price)}</div>
              <button class="domain-action add" data-domain="${domain}" data-price="${price.toFixed(2)}">Add to Cart</button>
            </div>
          </div>
        `;
      })
      .join("");

    resultsWrap.hidden = false;
    setTimeout(() => resultsWrap.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }

  function addToCart(domain, price) {
    const key = "alpha1_cart";
    const cart = JSON.parse(localStorage.getItem(key) || "[]");
    if (!cart.some((i) => i.domain === domain)) {
      cart.push({ domain, price: Number(price), addedAt: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(cart));
    }
  }

  function onSearch() {
    renderResults(queryEl.value);
  }

  searchBtn?.addEventListener("click", onSearch);

  queryEl?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch();
    }
  });

  presetButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      queryEl.value = btn.getAttribute("data-preset") || "";
      onSearch();
    });
  });

  resultsList?.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;

    const btn = target.closest("button.domain-action.add");
    if (!btn) return;

    const domain = btn.getAttribute("data-domain");
    const price = btn.getAttribute("data-price");
    if (!domain || !price) return;

    addToCart(domain, price);
    btn.textContent = "Added";
    btn.disabled = true;
    btn.style.opacity = "0.85";
  });
})();