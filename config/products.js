// Catálogo de produtos da loja. Edita aqui para mudar ranks, keys e preços.
// price está em cêntimos (ex: 499 = 4,99€).
//
// Nomes de Ranks e Caixas já ajustados aos reais do servidor (Prisma, Aurora,
// Celestial / Comum, Rara, Lendária, Veloria). Preços e perks são placeholders
// — ajusta-os para bater certo com o que está configurado no LuckPerms e nas
// crates do servidor.

const PRODUCTS = [
  // ---------- Ranks (VIP) ----------
  {
    id: "prisma",
    category: "vip",
    name: "Prisma",
    tagline: "O primeiro rank do Veloria SMP",
    price: 499,
    icon: "💠",
    color: "mint",
    perks: [
      "Tag [Prisma] colorida no chat",
      "2 /home extra",
      "Kit Prisma diário",
      "Acesso a /hat",
    ],
  },
  {
    id: "aurora",
    category: "vip",
    name: "Aurora",
    tagline: "Mais conforto e liberdade para construir",
    price: 999,
    icon: "🌌",
    color: "lavender",
    popular: true,
    perks: [
      "Tag [Aurora] colorida no chat",
      "4 /home extra",
      "Kit Aurora diário",
      "Acesso a /fly (na tua ilha)",
      "Acesso a /hat e /nick",
    ],
  },
  {
    id: "celestial",
    category: "vip",
    name: "Celestial",
    tagline: "A experiência completa do Veloria SMP",
    price: 1999,
    icon: "🪐",
    color: "sunset",
    perks: [
      "Tag [Celestial] com cor personalizada",
      "6 /home extra",
      "Kit Celestial diário",
      "Acesso a /fly e /feed",
      "Cor de nome personalizada",
      "Acesso antecipado a eventos",
    ],
  },

  // ---------- Keys (Caixas de Veloria) ----------
  {
    id: "key-comum",
    category: "key",
    name: "Chave Comum",
    tagline: "Abre a Caixa Comum",
    price: 199,
    icon: "🗝️",
    color: "sky",
    perks: ["1x Chave Comum", "Recompensas básicas de blocos e comida"],
  },
  {
    id: "key-rara",
    category: "key",
    name: "Chave Rara",
    tagline: "Abre a Caixa Rara",
    price: 499,
    icon: "✨",
    color: "sun",
    popular: true,
    perks: ["1x Chave Rara", "Recompensas de equipamento encantado"],
  },
  {
    id: "key-lendaria",
    category: "key",
    name: "Chave Lendária",
    tagline: "Abre a Caixa Lendária",
    price: 999,
    icon: "🌟",
    color: "sunset",
    perks: ["1x Chave Lendária", "Recompensas raras e cosméticos exclusivos"],
  },
  {
    id: "key-veloria",
    category: "key",
    name: "Chave Veloria",
    tagline: "Abre a Caixa Veloria — a mais exclusiva do servidor",
    price: 1999,
    icon: "🔮",
    color: "lavender",
    perks: [
      "1x Chave Veloria",
      "Recompensas exclusivas e únicas do servidor",
      "Cosméticos que não existem em mais nenhuma caixa",
    ],
  },
];

function getProducts() {
  return PRODUCTS;
}

function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id);
}

module.exports = { PRODUCTS, getProducts, getProductById };
