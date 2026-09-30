const CART_KEY = "veloria_cart";

const state = {
  products: [],
  cart: loadCart(),
};

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || {};
  } catch {
    return {};
  }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(state.cart));
}

function formatPrice(cents) {
  return (cents / 100).toLocaleString("pt-PT", {
    style: "currency",
    currency: "EUR",
  });
}

async function loadProducts() {
  const res = await fetch("/api/products");
  state.products = await res.json();
  renderProducts();
}

function renderProducts() {
  const vipGrid = document.getElementById("vip-grid");
  const keyGrid = document.getElementById("key-grid");
  vipGrid.innerHTML = "";
  keyGrid.innerHTML = "";

  state.products.forEach((product) => {
    const card = document.createElement("div");
    card.className = `card color-${product.color}`;
    card.innerHTML = `
      ${product.popular ? '<span class="card-badge">MAIS POPULAR</span>' : ""}
      <div class="card-icon">${product.icon}</div>
      <h3>${product.name}</h3>
      <p class="tagline">${product.tagline}</p>
      <ul>
        ${product.perks.map((perk) => `<li>${perk}</li>`).join("")}
      </ul>
      <div class="card-footer">
        <span class="price">${formatPrice(product.price)}</span>
        <button class="add-btn" data-id="${product.id}">Adicionar</button>
      </div>
    `;
    (product.category === "vip" ? vipGrid : keyGrid).appendChild(card);
  });

  document.querySelectorAll(".add-btn").forEach((btn) => {
    btn.addEventListener("click", () => addToCart(btn.dataset.id));
  });
}

function addToCart(id) {
  state.cart[id] = (state.cart[id] || 0) + 1;
  saveCart();
  renderCart();
  openCart();
}

function changeQty(id, delta) {
  const newQty = (state.cart[id] || 0) + delta;
  if (newQty <= 0) {
    delete state.cart[id];
  } else {
    state.cart[id] = newQty;
  }
  saveCart();
  renderCart();
}

function removeFromCart(id) {
  delete state.cart[id];
  saveCart();
  renderCart();
}

function cartEntries() {
  return Object.entries(state.cart)
    .map(([id, quantity]) => ({
      product: state.products.find((p) => p.id === id),
      quantity,
    }))
    .filter((entry) => entry.product);
}

function renderCart() {
  const container = document.getElementById("cart-items");
  const entries = cartEntries();
  const count = entries.reduce((sum, e) => sum + e.quantity, 0);
  document.getElementById("cart-count").textContent = count;

  if (entries.length === 0) {
    container.innerHTML = '<p class="cart-empty">O carrinho está vazio por agora.</p>';
  } else {
    container.innerHTML = entries
      .map(
        ({ product, quantity }) => `
        <div class="cart-item">
          <div class="icon">${product.icon}</div>
          <div class="details">
            <strong>${product.name}</strong>
            <span>${formatPrice(product.price)} cada</span>
          </div>
          <div class="qty-controls">
            <button data-action="dec" data-id="${product.id}">−</button>
            <span>${quantity}</span>
            <button data-action="inc" data-id="${product.id}">+</button>
          </div>
          <button class="remove-btn" data-action="remove" data-id="${product.id}">✕</button>
        </div>
      `
      )
      .join("");
  }

  const total = entries.reduce((sum, e) => sum + e.product.price * e.quantity, 0);
  document.getElementById("cart-total").textContent = formatPrice(total);

  container.querySelectorAll("[data-action]").forEach((btn) => {
    const { action, id } = btn.dataset;
    btn.addEventListener("click", () => {
      if (action === "inc") changeQty(id, 1);
      if (action === "dec") changeQty(id, -1);
      if (action === "remove") removeFromCart(id);
    });
  });
}

function openCart() {
  document.getElementById("cart-overlay").classList.add("open");
  document.getElementById("cart-drawer").classList.add("open");
}

function closeCart() {
  document.getElementById("cart-overlay").classList.remove("open");
  document.getElementById("cart-drawer").classList.remove("open");
}

async function startCheckout() {
  const entries = cartEntries();
  if (entries.length === 0) return;

  const checkoutBtn = document.getElementById("checkout-btn");
  checkoutBtn.disabled = true;
  checkoutBtn.textContent = "A processar...";

  try {
    const res = await fetch("/api/checkout/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: entries.map((e) => ({ id: e.product.id, quantity: e.quantity })),
      }),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Erro ao iniciar o pagamento.");

    localStorage.removeItem(CART_KEY);
    window.location.href = data.url;
  } catch (err) {
    alert(err.message);
    checkoutBtn.disabled = false;
    checkoutBtn.textContent = "Finalizar Compra";
  }
}

function setupUI() {
  document.getElementById("open-cart").addEventListener("click", openCart);
  document.getElementById("close-cart").addEventListener("click", closeCart);
  document.getElementById("cart-overlay").addEventListener("click", closeCart);
  document.getElementById("checkout-btn").addEventListener("click", startCheckout);

  document.getElementById("copy-ip").addEventListener("click", (e) => {
    navigator.clipboard.writeText("play.veloriasmp.net");
    const btn = e.target;
    const original = btn.textContent;
    btn.textContent = "Copiado!";
    setTimeout(() => (btn.textContent = original), 1500);
  });

  const logoImg = document.getElementById("logo-img");
  const logoFallback = document.getElementById("logo-fallback");
  logoImg.addEventListener("load", () => {
    logoImg.classList.add("loaded");
    logoFallback.style.display = "none";
  });
  logoImg.addEventListener("error", () => {
    logoImg.classList.remove("loaded");
    logoFallback.style.display = "flex";
  });
}

setupUI();
loadProducts().then(renderCart);
