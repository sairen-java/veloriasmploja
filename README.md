# Loja Veloria SMP

Loja online para o servidor de Minecraft **Veloria SMP**, para vender **ranks VIP** e **Keys**, com pagamentos processados pela **Stripe**.

## Funcionalidades

- Catálogo de VIPs e Keys (editável em `config/products.js`)
- Carrinho de compras (guardado no browser)
- Checkout seguro com o Stripe Checkout (o site nunca vê nem guarda dados de cartão)
- Recolha do **nick de Minecraft** diretamente no checkout da Stripe
- Webhook que regista as encomendas pagas em `data/orders.json`
- Endpoints de admin para consultar/marcar encomendas como entregues (para ligar a um plugin do servidor, por exemplo)
- Visual escuro e profissional (azul-marinho + dourado), com o logo real do servidor

## Estrutura do projeto

```
config/products.js   -> catálogo de produtos (nome, preço, perks, ícone)
lib/db.js             -> "base de dados" simples em ficheiro JSON
lib/stripe.js         -> cliente Stripe
routes/products.js    -> GET /api/products
routes/checkout.js    -> cria e consulta sessões de checkout
routes/webhook.js     -> recebe eventos da Stripe (pagamento confirmado)
routes/orders.js      -> endpoints de admin (protegidos por ADMIN_KEY)
public/               -> site (HTML/CSS/JS)
data/orders.json      -> encomendas pagas (criado automaticamente, não vai para o git)
```

## Como correr localmente

1. Instalar dependências:
   ```bash
   npm install
   ```
2. Copiar o ficheiro de ambiente e preencher os valores:
   ```bash
   cp .env.example .env
   ```
   - `STRIPE_SECRET_KEY`: chave secreta da tua conta Stripe (usa uma chave de teste `sk_test_...` para experimentar)
   - `STRIPE_WEBHOOK_SECRET`: obténs ao criares o webhook (ver abaixo)
   - `DOMAIN`: URL pública do site (em localhost pode ficar `http://localhost:3000`)
   - `ADMIN_KEY`: uma chave à tua escolha para proteger os endpoints de admin
3. Iniciar o servidor:
   ```bash
   npm start
   ```
4. Abrir `http://localhost:3000`

## Configurar o Stripe

1. Cria uma conta em https://dashboard.stripe.com se ainda não tiveres.
2. Vai a **Developers → API keys** e copia a **Secret key** para `STRIPE_SECRET_KEY`.
3. Para testares pagamentos sem gastar dinheiro real, usa o [Stripe CLI](https://stripe.com/docs/stripe-cli) para encaminhar os webhooks para a tua máquina:
   ```bash
   stripe listen --forward-to localhost:3000/webhook/stripe
   ```
   O comando dá-te um `whsec_...` — coloca-o em `STRIPE_WEBHOOK_SECRET`.
4. Em produção, cria o webhook em **Developers → Webhooks** apontando para `https://oteudominio.com/webhook/stripe`, a escutar o evento `checkout.session.completed`, e usa o segredo gerado aí.
5. Cartão de teste: `4242 4242 4242 4242`, qualquer data futura e qualquer CVC.

## Editar produtos, preços e ranks

Tudo está em `config/products.js`. Cada produto tem:

```js
{
  id: "aurora",         // identificador único, não mudar depois de já haver vendas
  category: "vip",      // "vip" ou "key"
  name: "Aurora",
  tagline: "...",
  price: 999,           // em cêntimos (999 = 9,99€)
  icon: "🌈",
  color: "mint",        // pink | mint | lavender | sky | sun | sunset
  popular: true,        // mostra o selo "MAIS POPULAR" (opcional)
  perks: ["...", "..."],
}
```

Basta editar este ficheiro e reiniciar o servidor — não é preciso tocar em mais nada.

## Logo do servidor

O cabeçalho, o hero e o cartão do servidor carregam `public/server-icon.png`. Se o ficheiro não existir, o cabeçalho mostra automaticamente um símbolo alternativo (não parte nada). Para trocar o logo, basta substituir esse ficheiro (idealmente quadrado, ex: 256x256) e recarregar a página.

## Entrega dos VIPs/Keys no servidor

Este projeto trata do **site e do pagamento**. A entrega automática dentro do Minecraft (dar o rank ou a key ao jogador) depende do software do teu servidor (Paper, Spigot, etc.) e não está incluída, mas o backend já deixa tudo pronto para isso:

- Depois de cada pagamento confirmado, a encomenda fica guardada em `data/orders.json` com `fulfilled: false`.
- Um plugin (ou script) do servidor pode consultar as encomendas por entregar:
  ```
  GET /api/admin/orders?status=pending
  Header: x-admin-key: <o valor de ADMIN_KEY>
  ```
- Depois de entregar, marca como feita:
  ```
  POST /api/admin/orders/<id>/fulfill
  Header: x-admin-key: <o valor de ADMIN_KEY>
  ```

Alternativa mais simples: um administrador consulta essa lista manualmente e dá os ranks/keys à mão com comandos de consola (`lp user <nick> parent add vip`, `/crate key give <nick> common 1`, etc.).

## Publicar online (deploy)

Qualquer serviço que corra Node.js serve (Railway, Render, Fly.io, VPS próprio, etc.). Passos gerais:

1. Fazer deploy do projeto (com `npm install` e `npm start`).
2. Definir as variáveis de ambiente do `.env` no painel do serviço escolhido.
3. Atualizar `DOMAIN` para o domínio final.
4. Atualizar o webhook da Stripe para apontar para `https://oteudominio.com/webhook/stripe`.

## Aviso

Este projeto não é afiliado à Mojang, Microsoft ou Stripe. Certifica-te de que a venda de vantagens de gameplay (pay-to-win) respeita os termos de serviço do Minecraft (a Mojang permite vender cosméticos e conveniências, mas não vantagens que quebrem o jogo para quem não paga).
