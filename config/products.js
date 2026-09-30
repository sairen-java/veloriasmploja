// Catálogo de produtos da loja. Edita aqui para mudar ranks, keys e preços.
// price está em cêntimos (ex: 499 = 4,99€).

const PRODUCTS = [
  // ---------- VIPs ----------
  {
    id: "vip",
    category: "vip",
    name: "VIP",
    tagline: "O primeiro passo para uma aventura melhor",
    price: 499,
    icon: "🐷",
    color: "pink",
    perks: [
      "Tag [VIP] colorida no chat",
      "2 /home extra",
      "Kit VIP diário",
      "Acesso a /hat",
    ],
  },
  {
    id: "vip-plus",
    category: "vip",
    name: "VIP+",
    tagline: "Mais conforto e liberdade para construir",
    price: 999,
    icon: "🌈",
    color: "mint",
    popular: true,
    perks: [
      "Tag [VIP+] colorida no chat",
      "4 /home extra",
      "Kit VIP+ diário",
      "Acesso a /fly (na tua ilha)",
      "Acesso a /hat e /nick",
    ],
  },
  {
    id: "mvp",
    category: "vip",
    name: "MVP",
    tagline: "A experiência completa do Veloria SMP",
    price: 1999,
    icon: "☁️",
    color: "lavender",
    perks: [
      "Tag [MVP] com cor personalizada",
      "6 /home extra",
      "Kit MVP diário",
      "Acesso a /fly e /feed",
      "Cor de nome personalizada",
      "Acesso antecipado a eventos",
    ],
  },

  // ---------- Keys ----------
  {
    id: "key-common",
    category: "key",
    name: "Chave Comum",
    tagline: "Abre a Crate Comum",
    price: 199,
    icon: "🗝️",
    color: "sky",
    perks: ["1x Chave Comum", "Recompensas básicas de blocos e comida"],
  },
  {
    id: "key-rare",
    category: "key",
    name: "Chave Rara",
    tagline: "Abre a Crate Rara",
    price: 499,
    icon: "✨",
    color: "sun",
    popular: true,
    perks: ["1x Chave Rara", "Recompensas de equipamento encantado"],
  },
  {
    id: "key-legendary",
    category: "key",
    name: "Chave Lendária",
    tagline: "Abre a Crate Lendária",
    price: 999,
    icon: "🌟",
    color: "sunset",
    perks: ["1x Chave Lendária", "Recompensas raras e cosméticos exclusivos"],
  },
];

function getProducts() {
  return PRODUCTS;
}

function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id);
}

module.exports = { PRODUCTS, getProducts, getProductById };
