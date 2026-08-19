const money = value => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
let categories = ["Combos", "Hamburgueres", "Porcoes", "Bebidas", "Sobremesas", "Promocoes"];
const storageKey = "mao-na-brasa-admin-v1";
const supabaseUrl = "https://wepolfwqfylyuvtudzxk.supabase.co";
const supabaseKey = "sb_publishable_ApNh8NuE8KZx2Zk2SJ-hDg_GaJMXX1-";
let supabaseClient = null;
const defaultSite = {
  brandShort: "Mão na Brasa",
  brandTag: "Burger",
  whatsapp: "5564992360895",
  whatsappDisplay: "(64) 99236-0895",
  instagram: "@mao_na_brasa_burger",
  instagramUrl: "https://www.instagram.com/mao_na_brasa_burger/",
  address: "Endereco configuravel da hamburgueria",
  hours: "Segunda a domingo, 18:00 as 23:30",
  heroEyebrow: "Hamburgueria artesanal premium",
  heroTitle: "O hamburguer que voce estava esperando.",
  heroText: "Ingredientes selecionados, combinacoes irresistiveis e sabor de verdade em uma experiencia digital de alto nivel.",
  deliveryInfo: "Entrega 35-50 min",
  ratingInfo: "4.9 dos clientes",
  avgTicket: "R$ 54,80",
  todayOrders: "128",
  promoBadge: "Combo da noite",
  promoTitle: "Barca Mão na Brasa",
  promoText: "2 hamburgueres, batata frita com bacon, rodela de cebola e 2 refrigerantes lata.",
  promoPrice: "R$ 89,90",
  featureTitle: "Mão na Brasa Signature",
  featureText: "Blend 180g prensado na chapa, cheddar maturado, bacon crocante, cebola caramelizada, picles da casa e molho da brasa.",
  aboutEyebrow: "Sobre a Mão na Brasa",
  aboutTitle: "Cozinha aberta, fogo alto e obsessao por detalhe.",
  aboutText: "A Mão na Brasa Burger nasceu para transformar o pedido de hamburguer em um ritual simples e muito bem executado: carne moida diariamente, pao de fermentacao longa, molhos autorais e operacao pensada para chegar quente.",
  statOrders: "12k+",
  statRating: "4.9",
  statPrep: "35min",
  reviewScore: "4.9/5",
  reviewSummary: "Media de 1.827 avaliacoes verificadas."
};
const defaultGallery = [
  { src: "assets/burger-double-cheddar-bacon.jpg", alt: "Hamburguer duplo com cheddar e bacon" },
  { src: "assets/burger-frango-duplo-bacon.jpg", alt: "Hamburguer crispy duplo com bacon" },
  { src: "assets/kitchen-team.png", alt: "Cozinha profissional" },
  { src: "assets/combo-caixa-fritas.jpg", alt: "Combo com hamburguer cortado e fritas" },
  { src: "assets/burger-cebola-bacon.jpg", alt: "Hamburguer com cebola caramelizada e bacon" },
  { src: "assets/promo-barca.jpg", alt: "Barca promocional com hamburgueres e fritas" }
];
const defaultInstagramImages = [
  { src: "assets/burger-queijo-coalho-bacon.jpg", alt: "Post de hamburguer com queijo coalho" },
  { src: "assets/combo-refri-fritas.jpg", alt: "Post de combo com refrigerante e fritas" },
  { src: "assets/burger-pulled-cremoso.jpg", alt: "Post de hamburguer com carne desfiada" }
];
let addonGroups = [
  {
    group: "Carnes & complementos",
    items: [
      { name: "Hambúrguer 150g", price: 4 },
      { name: "Salsicha", price: 2 },
      { name: "Muçarela", price: 2.5 },
      { name: "Cheddar", price: 2.5 },
      { name: "Ovo", price: 3 }
    ]
  },
  {
    group: "Salada",
    items: [
      { name: "Alface", price: 1 },
      { name: "Tomate", price: 1 },
      { name: "Cebola caramelizada", price: 2 }
    ]
  },
  {
    group: "Molhos",
    items: [
      { name: "Molho verde extra", price: 1.5 }
    ]
  },
  {
    group: "Batatas",
    items: [
      { name: "Batata frita pequena", price: 9.99 },
      { name: "Batata frita grande", price: 15.99 },
      { name: "Batata pequena com bacon e cheddar", price: 12.99 },
      { name: "Batata grande com bacon e cheddar", price: 25.99 }
    ]
  }
];
let products = [
  { id: 1, cat: "Hamburgueres", name: "Mão na Brasa Signature", desc: "Duplo smash, cheddar cremoso, bacon crocante e molho da brasa.", price: 39.9, old: 44.9, badge: "Mais vendido", img: "assets/burger-double-cheddar-bacon.jpg", ingredients: "Blend da casa, brioche com gergelim, cheddar, bacon crocante e molho da brasa." },
  { id: 2, cat: "Combos", name: "Barca Mão na Brasa", desc: "2 hamburgueres, batata frita com bacon, rodela de cebola e 2 refrigerantes lata.", price: 89.9, badge: "Oferta", img: "assets/promo-barca.jpg", ingredients: "Dois burgers, batata com bacon, aneis de cebola e dois refrigerantes lata." },
  { id: 3, cat: "Hamburgueres", name: "Crispy Bacon", desc: "Frango crispy duplo, queijo derretido, bacon e molho especial.", price: 36.9, badge: "Crocante", img: "assets/burger-frango-duplo-bacon.jpg", ingredients: "Dois filés crispy, queijo, bacon crocante e molho especial no brioche." },
  { id: 4, cat: "Hamburgueres", name: "Salada Bacon", desc: "Burger alto com bacon, queijo, tomate, cebola roxa, alface e molho.", price: 34.9, img: "assets/burger-crispy-salada-bacon.jpg", ingredients: "Blend artesanal, queijo, bacon, alface, tomate, cebola roxa e molho da casa." },
  { id: 5, cat: "Hamburgueres", name: "Egg Bacon Brasa", desc: "Carne artesanal, ovo, queijo, bacon, salada fresca e molho cremoso.", price: 37.9, img: "assets/burger-egg-bacon-salada.jpg", ingredients: "Blend bovino, ovo, queijo, bacon, alface, tomate, cebola roxa e molho especial." },
  { id: 6, cat: "Hamburgueres", name: "Triplo Queijo Bacon", desc: "Tres carnes, queijo em camadas e bacon para fome grande.", price: 48.9, badge: "Gigante", img: "assets/burger-triplo-queijo-bacon.jpg", ingredients: "Tres blends artesanais, queijo derretido em camadas, bacon e brioche." },
  { id: 7, cat: "Hamburgueres", name: "Pulled Brasa", desc: "Carne desfiada suculenta, bacon, queijo e salada.", price: 41.9, badge: "Especial", img: "assets/burger-pulled-bacon.jpg", ingredients: "Blend artesanal, carne desfiada, bacon, queijo, tomate, cebola roxa, alface e molho." },
  { id: 8, cat: "Hamburgueres", name: "Queijo Coalho Bacon", desc: "Queijo coalho tostado, bacon e burger artesanal com salada.", price: 42.9, img: "assets/burger-queijo-coalho-bacon.jpg", ingredients: "Blend bovino, queijo coalho tostado, bacon, queijo, salada e molho." },
  { id: 9, cat: "Hamburgueres", name: "Cebola Caramelizada", desc: "Burger com queijo, bacon e cebola caramelizada em dose generosa.", price: 38.9, img: "assets/burger-cebola-bacon.jpg", ingredients: "Blend da casa, queijo, bacon, cebola caramelizada, salada e molho." },
  { id: 10, cat: "Hamburgueres", name: "Duplo Salada Bacon", desc: "Duas carnes, queijo, bacon, salada completa e molho cremoso.", price: 43.9, img: "assets/burger-duplo-salada-bacon.jpg", ingredients: "Dois blends, queijo, bacon, tomate, cebola roxa, alface e molho especial." },
  { id: 11, cat: "Combos", name: "Combo Bacon Fritas", desc: "Burger com bacon, fritas e refrigerante lata.", price: 44.9, img: "assets/combo-bacon-fritas.jpg", ingredients: "Burger artesanal, batata frita e refrigerante lata." },
  { id: 12, cat: "Combos", name: "Combo Salada Fritas", desc: "Burger salada com bacon, fritas e refrigerante.", price: 44.9, img: "assets/combo-salada-fritas.jpg", ingredients: "Burger salada com bacon, batata frita e refrigerante lata." },
  { id: 13, cat: "Combos", name: "Box Burger Fritas", desc: "Hamburguer cortado, molho cremoso, bacon e fritas.", price: 49.9, badge: "Delivery", img: "assets/combo-caixa-fritas.jpg", ingredients: "Burger em box, fritas crocantes, cheddar cremoso e bacon." },
  { id: 14, cat: "Porcoes", name: "Fritas com Bacon", desc: "Porcao generosa de batata frita com bacon e molho cremoso.", price: 24.9, img: "assets/combo-caixa-fritas.jpg", ingredients: "Batata frita, bacon crocante e molho cremoso." },
  { id: 15, cat: "Bebidas", name: "Refrigerante Lata", desc: "Bebida gelada para acompanhar seu pedido.", price: 7.9, img: "assets/combo-refri-fritas.jpg", ingredients: "Refrigerante lata 350ml, sabores conforme disponibilidade." },
  { id: 16, cat: "Promocoes", name: "Barca Promocional", desc: "Oferta completa para dividir: 2 burgers, fritas, bacon, cebola e 2 refris.", price: 89.9, old: 104.8, badge: "Limitado", img: "assets/promo-barca.jpg", ingredients: "Dois hamburgueres, fritas com bacon, aneis de cebola e dois refrigerantes lata." }
];
let reviews = [
  ["MA", "Marina Alves", "O pedido chegou quente, bonito e com embalagem impecavel. Parece experiencia de marca grande."],
  ["RC", "Rafael Costa", "O Mão na Brasa Signature e absurdo. O checkout tambem e muito rapido no celular."],
  ["LB", "Lia Braga", "Visual premium, atendimento agil e hamburguer com gosto de cozinha de verdade."]
];
let activeCategory = "Combos";
let cart = [];
let orderNumber = 1048;
let site = { ...defaultSite };
let galleryImages = [...defaultGallery];
let instagramImages = [...defaultInstagramImages];
let adminLoggedIn = false;

const $ = selector => document.querySelector(selector);
const $$ = selector => Array.from(document.querySelectorAll(selector));

async function init() {
  initSupabase();
  await loadAdminState();
  applySiteContent();
  renderMediaGrids();
  renderCategories();
  renderProducts();
  renderReviews();
  renderCart();
  renderAdminGate();
  bindEvents();
  tickCountdown();
  setInterval(tickCountdown, 1000);
  revealOnScroll();
}

function initSupabase() {
  if (window.supabase?.createClient) {
    supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
  }
}

function applySavedState(saved = {}) {
  site = { ...defaultSite, ...(saved.site || {}) };
  if (Array.isArray(saved.products)) products = saved.products;
  if (Array.isArray(saved.categories)) categories = saved.categories;
  if (Array.isArray(saved.addonGroups)) addonGroups = saved.addonGroups;
  if (Array.isArray(saved.reviews)) reviews = saved.reviews;
  if (Array.isArray(saved.galleryImages)) galleryImages = saved.galleryImages;
  if (Array.isArray(saved.instagramImages)) instagramImages = saved.instagramImages;
}

async function loadAdminState() {
  try {
    if (supabaseClient) {
      const { data } = await supabaseClient.from("settings").select("value").eq("key", "site_data").maybeSingle();
      if (data?.value) {
        applySavedState(data.value);
        localStorage.setItem(storageKey, JSON.stringify(data.value));
      } else {
        applySavedState(JSON.parse(localStorage.getItem(storageKey) || "{}"));
      }
      const { data: sessionData } = await supabaseClient.auth.getSession();
      adminLoggedIn = Boolean(sessionData?.session);
      return;
    }
    applySavedState(JSON.parse(localStorage.getItem(storageKey) || "{}"));
  } catch {
    site = { ...defaultSite };
  }
}

function saveAdminState() {
  const payload = { site, products, categories, addonGroups, reviews, galleryImages, instagramImages };
  localStorage.setItem(storageKey, JSON.stringify(payload));
  if (supabaseClient && adminLoggedIn) {
    supabaseClient.from("settings").upsert({ key: "site_data", value: payload, updated_at: new Date().toISOString() }, { onConflict: "key" })
      .then(({ error }) => { if (error) toast("Erro ao salvar no Supabase"); });
  }
}

function getAddons() {
  return addonGroups.flatMap(group => group.items.map(item => ({ ...item, group: group.group })));
}

function applySiteContent() {
  $$("[data-site]").forEach(el => {
    const key = el.dataset.site;
    if (site[key] !== undefined) el.textContent = site[key];
  });
  $$("[data-link='whatsapp']").forEach(el => el.href = `https://wa.me/${site.whatsapp}`);
  $$("[data-link='instagram']").forEach(el => el.href = site.instagramUrl);
  const contact = `${site.hours}. WhatsApp: ${site.whatsappDisplay}. Instagram: ${site.instagram}.`;
  $$("[data-site='contactLine']").forEach(el => el.textContent = contact);
}

function renderMediaGrids() {
  $("#gallery").innerHTML = galleryImages.map(image => `<img src="${image.src}" alt="${escAttr(image.alt)}">`).join("");
  $("#instaGrid").innerHTML = instagramImages.map(image => `<img src="${image.src}" alt="${escAttr(image.alt)}">`).join("");
}

function bindEvents() {
  window.addEventListener("scroll", () => $("#topbar").classList.toggle("scrolled", scrollY > 20));
  $("#menuButton").addEventListener("click", () => $("#mobileMenu").classList.toggle("open"));
  $$("[data-scroll]").forEach(btn => btn.addEventListener("click", () => $(btn.dataset.scroll).scrollIntoView()));
  $("#cartButton").addEventListener("click", openCart);
  $("#bottomCart").addEventListener("click", openCart);
  $("#closeCart").addEventListener("click", closeCart);
  $("#checkoutButton").addEventListener("click", openCheckout);
  $("#adminLoginButton").addEventListener("click", adminLogin);
  $("#adminPassword").addEventListener("keydown", event => { if (event.key === "Enter") adminLogin(); });
  $("#adminEmail").addEventListener("keydown", event => { if (event.key === "Enter") adminLogin(); });
  $("#adminLogout").addEventListener("click", adminLogout);
  $("[data-feature-add]").addEventListener("click", () => openProduct(products[0].id));
  $("#gallery").addEventListener("click", event => {
    if (event.target.tagName === "IMG") {
      $("#lightbox img").src = event.target.src;
      $("#lightbox").classList.add("open");
      $("#lightbox").setAttribute("aria-hidden", "false");
    }
  });
  $("#lightbox button").addEventListener("click", () => $("#lightbox").classList.remove("open"));
  $$(".admin-tab").forEach(tab => tab.addEventListener("click", () => renderAdmin(tab.dataset.admin)));
}

function adminLogin() {
  if (!supabaseClient) {
    adminLoggedIn = true;
    renderAdminGate();
    return toast("Admin local liberado");
  }
  const email = $("#adminEmail").value.trim();
  const password = $("#adminPassword").value;
  if (!email || !password) return toast("Informe email e senha");
  supabaseClient.auth.signInWithPassword({ email, password }).then(async ({ error }) => {
    if (error) return toast(`Erro: ${error.message}`);
    adminLoggedIn = true;
    await loadAdminState();
    applySiteContent();
    renderMediaGrids();
    renderCategories();
    renderProducts();
    renderReviews();
    renderAdminGate();
    toast("Admin conectado ao Supabase");
  });
}

function adminLogout() {
  if (supabaseClient) supabaseClient.auth.signOut();
  adminLoggedIn = false;
  renderAdminGate();
}

function renderAdminGate() {
  $("#adminLogin").hidden = adminLoggedIn;
  $("#adminWorkspace").hidden = !adminLoggedIn;
  if (adminLoggedIn) renderAdmin("site");
}

function renderCategories() {
  $("#categoryTabs").innerHTML = categories.map(cat => `<button class="${cat === activeCategory ? "active" : ""}" data-cat="${cat}" role="tab">${cat}</button>`).join("");
  $$("#categoryTabs button").forEach(btn => btn.addEventListener("click", () => {
    activeCategory = btn.dataset.cat;
    renderCategories();
    renderProducts();
  }));
}

function renderProducts() {
  const list = products.filter(product => product.cat === activeCategory);
  if (!list.length) {
    $("#productGrid").innerHTML = `<div class="empty product-empty"><b>Nenhum produto ativo nesta categoria.</b><p>Esta area esta pronta para receber novos itens pelo painel administrativo.</p><button class="btn outline" onclick="document.querySelector('#categoryTabs button')?.click()">Ver primeira categoria</button></div>`;
    return;
  }
  $("#productGrid").innerHTML = list.map(product => `
    <article class="product-card reveal">
      <button class="product-media" onclick="openProduct(${product.id})" aria-label="Abrir ${product.name}">
        <img src="${product.img}" alt="${product.name}">
      </button>
      <div class="product-body">
        <div>${product.badge ? `<span class="badge">${product.badge}</span>` : ""}<h3>${product.name}</h3></div>
        <p>${product.desc}</p>
        <div class="product-bottom">
          <span class="price">${money(product.price)}${product.old ? `<span class="old-price">${money(product.old)}</span>` : ""}</span>
          <button class="btn primary small" onclick="openProduct(${product.id})">Adicionar</button>
        </div>
      </div>
    </article>
  `).join("");
  revealOnScroll();
}

function openProduct(id, existingIndex = null) {
  const product = products.find(item => item.id === id);
  let qty = existingIndex !== null ? cart[existingIndex].qty : 1;
  let selected = existingIndex !== null ? [...cart[existingIndex].addons] : [];
  const notes = existingIndex !== null ? cart[existingIndex].notes : "";
  const modal = $("#productModal");
  const render = () => {
    const total = (product.price + selected.reduce((sum, item) => sum + item.price, 0)) * qty;
    modal.innerHTML = `
      <div class="modal-card modal-product">
        <img src="${product.img}" alt="${product.name}">
        <div class="modal-body">
          <div class="step-head"><span class="badge">${product.cat}</span><button class="icon-btn" onclick="closeModal('productModal')">Fechar</button></div>
          <div><h2>${product.name}</h2><p>${product.desc}</p></div>
          <p><strong>Ingredientes:</strong> ${product.ingredients}</p>
          <div>
            <div class="step-head"><strong>Quantidade</strong><div class="qty-row"><button id="minusQty">-</button><b>${qty}</b><button id="plusQty">+</button></div></div>
          </div>
          <div><strong>Escolha seus adicionais</strong><div class="addon-list">
            ${addonGroups.map(group => `<div class="addon-group"><h3>${group.group}</h3>${group.items.map(addon => `<label class="addon"><span><input type="checkbox" value="${addon.name}" ${selected.some(item => item.name === addon.name) ? "checked" : ""}> ${addon.name}</span><b>+ ${money(addon.price)}</b></label>`).join("")}</div>`).join("")}
          </div></div>
          <label>Observacoes<textarea id="itemNotes" rows="3" placeholder="Sem cebola, por favor.">${notes}</textarea></label>
          <button class="btn primary full" id="addToCart">Adicionar ao carrinho - ${money(total)}</button>
        </div>
      </div>`;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    $("#minusQty").onclick = () => { qty = Math.max(1, qty - 1); render(); };
    $("#plusQty").onclick = () => { qty += 1; render(); };
    $$(".addon input").forEach(input => input.onchange = () => {
      selected = $$(".addon input:checked").map(el => getAddons().find(addon => addon.name === el.value));
      render();
    });
    $("#addToCart").onclick = () => {
      const item = { key: Date.now(), productId: product.id, name: product.name, price: product.price, qty, addons: selected, notes: $("#itemNotes").value };
      if (existingIndex !== null) cart[existingIndex] = item; else cart.push(item);
      closeModal("productModal");
      renderCart();
      openCart();
      toast(`${product.name} adicionado ao carrinho`);
    };
  };
  render();
}

function renderCart() {
  $("#cartCount").textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  if (!cart.length) {
    $("#cartItems").innerHTML = `<div class="empty"><b>Seu carrinho esta vazio.</b><p>Que tal escolher alguma coisa deliciosa?</p><button class="btn outline" onclick="closeCart(); document.querySelector('#cardapio').scrollIntoView()">Ver cardapio</button></div>`;
    $("#cartSummary").innerHTML = "";
    $("#checkoutButton").disabled = true;
    return;
  }
  $("#checkoutButton").disabled = false;
  $("#cartItems").innerHTML = cart.map((item, index) => {
    const addonsText = item.addons.length ? item.addons.map(addon => addon.name).join(", ") : "Sem adicionais";
    return `<article class="cart-item">
      <div class="cart-item-head"><strong>${item.name}</strong><button onclick="removeItem(${index})">Remover</button></div>
      <small>${addonsText}</small>${item.notes ? `<p>${item.notes}</p>` : ""}
      <div class="qty-row"><span>${money(itemTotal(item))}</span><span><button onclick="changeQty(${index}, -1)">-</button> <b>${item.qty}</b> <button onclick="changeQty(${index}, 1)">+</button> <button onclick="editItem(${index})">Editar</button></span></div>
    </article>`;
  }).join("");
  const subtotal = cart.reduce((sum, item) => sum + itemTotal(item), 0);
  const fee = subtotal > 80 ? 0 : 7.9;
  const discount = subtotal > 70 ? subtotal * .1 : 0;
  $("#cartSummary").innerHTML = `
    <div class="summary-line"><span>Subtotal</span><b>${money(subtotal)}</b></div>
    <div class="summary-line"><span>Taxa de entrega</span><b>${fee ? money(fee) : "Gratis"}</b></div>
    <div class="summary-line"><span>Desconto</span><b>${discount ? `-${money(discount)}` : money(0)}</b></div>
    <div class="summary-line total"><span>Total</span><b>${money(subtotal + fee - discount)}</b></div>`;
}

function itemTotal(item) { return (item.price + item.addons.reduce((sum, addon) => sum + addon.price, 0)) * item.qty; }
function changeQty(index, delta) { cart[index].qty += delta; if (cart[index].qty <= 0) cart.splice(index, 1); renderCart(); }
function removeItem(index) { cart.splice(index, 1); renderCart(); toast("Item removido"); }
function editItem(index) { openProduct(cart[index].productId, index); }
function openCart() { $("#cartDrawer").classList.add("open"); $("#cartDrawer").setAttribute("aria-hidden", "false"); }
function closeCart() { $("#cartDrawer").classList.remove("open"); $("#cartDrawer").setAttribute("aria-hidden", "true"); }
function closeModal(id) { $(`#${id}`).classList.remove("open"); $(`#${id}`).setAttribute("aria-hidden", "true"); }

function openCheckout(step = 1, data = {}) {
  if (!cart.length) return toast("Escolha um produto primeiro");
  closeCart();
  const modal = $("#checkoutModal");
  const subtotal = cart.reduce((sum, item) => sum + itemTotal(item), 0);
  const fee = data.delivery === "retirada" ? 0 : subtotal > 80 ? 0 : 7.9;
  const total = subtotal + fee - (subtotal > 70 ? subtotal * .1 : 0);
  const content = {
    1: `<label>Nome<input id="name" value="${data.name || ""}" required></label><label>Telefone<input id="phone" value="${data.phone || ""}" required></label><label>WhatsApp<input id="whatsapp" value="${data.whatsapp || ""}" required></label>`,
    2: `<label>Tipo<select id="delivery"><option value="entrega">Entrega</option><option value="retirada">Retirada no local</option></select></label><div class="form-grid"><label>CEP<input id="zip" value="${data.zip || ""}"></label><label>Rua<input id="street" value="${data.street || ""}"></label><label>Numero<input id="number" value="${data.number || ""}"></label><label>Bairro<input id="district" value="${data.district || ""}"></label></div><label>Referencia<input id="ref" value="${data.ref || ""}"></label>`,
    3: `<label>Pagamento<select id="payment"><option>PIX</option><option>Cartao - credito</option><option>Cartao - debito</option><option>Dinheiro</option></select></label><label>Troco para<input id="change" placeholder="R$ 100,00"></label><label>Observacao do pedido<textarea id="orderNote" rows="3" placeholder="Sem cebola, por favor.">${data.orderNote || ""}</textarea></label><div class="promo-card"><span class="badge">PIX</span><p>Chave PIX configuravel no painel administrativo. QR Code demonstrativo habilitado no sistema real.</p></div>`,
    4: `<div class="empty"><b>Pedido confirmado!</b><p>Seu pedido foi recebido com sucesso.</p><h2>Pedido #${orderNumber++}</h2><p>Previsao: 35-50 min</p></div><div class="order-status">${["Pedido recebido", "Confirmado", "Em preparacao", "Pronto", "Saiu para entrega", "Entregue"].map((label, index) => `<div class="status-step ${index < 2 ? "done" : ""}"><span class="dot"></span><span>${label}</span></div>`).join("")}</div><button class="btn outline full" onclick="closeModal('checkoutModal'); document.querySelector('#cardapio').scrollIntoView()">Voltar para o cardapio</button>`
  }[step];
  modal.innerHTML = `<div class="modal-card checkout-card">
    <div class="step-head"><h2>${step === 4 ? "Acompanhar pedido" : "Finalizar pedido"}</h2><button class="icon-btn" onclick="closeModal('checkoutModal')">Fechar</button></div>
    <div class="steps">${[1,2,3,4].map(i => `<span class="${i <= step ? "active" : ""}"></span>`).join("")}</div>
    <p>Etapa ${step}: ${["Dados", "Entrega", "Pagamento", "Confirmacao"][step - 1]} | Total ${money(total)}</p>
    <div class="form-card">${content}</div>
    ${step < 4 ? `<button class="btn primary full" id="nextStep">Proximo passo</button>` : `<a class="btn primary full" target="_blank" rel="noreferrer" href="${whatsAppLink(total)}">Enviar pedido no WhatsApp</a>`}
  </div>`;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  const deliverySelect = $("#delivery");
  if (deliverySelect && data.delivery) deliverySelect.value = data.delivery;
  const next = $("#nextStep");
  if (next) next.onclick = () => openCheckout(step + 1, collectCheckout(data));
  if (step === 4) { cart = []; renderCart(); }
}

function collectCheckout(data) {
  return {
    ...data,
    name: $("#name")?.value || data.name,
    phone: $("#phone")?.value || data.phone,
    whatsapp: $("#whatsapp")?.value || data.whatsapp,
    delivery: $("#delivery")?.value || data.delivery,
    zip: $("#zip")?.value || data.zip,
    street: $("#street")?.value || data.street,
    number: $("#number")?.value || data.number,
    district: $("#district")?.value || data.district,
    ref: $("#ref")?.value || data.ref,
    payment: $("#payment")?.value || data.payment,
    orderNote: $("#orderNote")?.value || data.orderNote
  };
}

function whatsAppLink(total) {
  const items = cart.map(item => `${item.qty}x ${item.name}`).join("%0A");
  return `https://wa.me/${site.whatsapp}?text=NOVO%20PEDIDO%20%231048%0A${items}%0ATotal:%20${encodeURIComponent(money(total))}`;
}

function renderReviews() {
  $("#reviews").innerHTML = reviews.map(([initials, name, text]) => `<article class="review-card"><div class="avatar">${initials}</div><h3>${name}</h3><strong>★★★★★</strong><p>"${text}"</p></article>`).join("");
}

function escAttr(value = "") {
  return String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
}

function renderSiteEditor() {
  const fields = [
    ["brandShort", "Nome curto"], ["brandTag", "Complemento da marca"], ["heroEyebrow", "Texto pequeno do hero"],
    ["heroTitle", "Titulo principal"], ["heroText", "Texto do hero"], ["deliveryInfo", "Info entrega"],
    ["ratingInfo", "Info avaliacao"], ["avgTicket", "Ticket medio"], ["todayOrders", "Pedidos hoje"],
    ["promoBadge", "Badge promocao"], ["promoTitle", "Titulo promocao"], ["promoText", "Texto promocao"],
    ["promoPrice", "Preco promocao"], ["featureTitle", "Produto destaque"], ["featureText", "Texto produto destaque"],
    ["aboutEyebrow", "Texto pequeno sobre"], ["aboutTitle", "Titulo sobre"], ["aboutText", "Texto sobre"],
    ["statOrders", "Indicador pedidos"], ["statRating", "Indicador avaliacao"], ["statPrep", "Indicador preparo"],
    ["reviewScore", "Nota avaliacoes"], ["reviewSummary", "Resumo avaliacoes"]
  ];
  return `<form class="form-card admin-form-grid admin-editor" onsubmit="saveSiteEditor(event)">
    ${fields.map(([key, label]) => `<label>${label}<textarea rows="${key.includes("Text") || key === "aboutText" ? 3 : 1}" data-site-input="${key}">${escAttr(site[key])}</textarea></label>`).join("")}
    <button class="btn primary">Salvar textos do site</button>
  </form>`;
}

function renderProductEditor() {
  return `<div class="table-card admin-editor"><div class="step-head"><div><h3>Produtos editaveis</h3><p class="admin-hint">Clique em novo produto, preencha os campos, envie uma foto e depois salve o cardapio.</p></div><button type="button" class="btn ghost small" onclick="addAdminProduct()">Novo produto</button></div>
    <div class="admin-product-list">${products.map((product, index) => `<form class="product-edit-card ${product.isDraft ? "is-draft" : ""}" data-product-row="${index}" data-product-id="${product.id}">
      <div class="product-edit-media">
        <img data-product-preview="${index}" src="${product.img}" alt="${escAttr(product.name)}">
        <label class="btn ghost small file-btn">Trocar foto<input type="file" accept="image/*" onchange="handleProductImageUpload(event, ${index})"></label>
      </div>
      <div class="product-edit-fields">
        <div class="product-edit-head">
          <strong>${product.isDraft ? "Novo produto" : `Produto #${index + 1}`}</strong>
          <button type="button" class="btn ghost small danger" onclick="removeAdminProduct(${index})">Excluir</button>
        </div>
        <div class="form-grid">
          <label>Nome<input data-field="name" value="${escAttr(product.name)}"></label>
          <label>Categoria<select data-field="cat">${categories.map(cat => `<option ${cat === product.cat ? "selected" : ""}>${cat}</option>`).join("")}</select></label>
          <label>Preco<input data-field="price" value="${product.price}"></label>
          <label>Preco promocional<input data-field="old" value="${product.old || ""}"></label>
          <label>Badge<input data-field="badge" value="${escAttr(product.badge || "")}"></label>
        </div>
        <input type="hidden" data-field="img" value="${escAttr(product.img)}">
        <label>Descricao<textarea data-field="desc">${escAttr(product.desc)}</textarea></label>
        <label>Ingredientes<textarea data-field="ingredients">${escAttr(product.ingredients)}</textarea></label>
      </div>
    </form>`).join("")}</div>
    <button type="button" class="btn primary full" onclick="saveProductsEditor()">Salvar cardapio</button>
  </div>`;
}

function renderGalleryEditor() {
  const card = (image, index, type) => `<article class="media-edit-card">
    <img src="${image.src}" alt="${escAttr(image.alt)}">
    <label>Descricao<input data-media-alt="${type}-${index}" value="${escAttr(image.alt)}"></label>
    <button class="btn ghost small" onclick="removeMediaImage('${type}', ${index})">Remover</button>
  </article>`;
  return `<div class="table-card admin-editor">
    <div class="step-head"><h3>Galeria do site</h3><label class="btn ghost small file-btn">Adicionar foto<input type="file" accept="image/*" multiple onchange="handleGalleryUpload(event, 'gallery')"></label></div>
    <div class="media-edit-grid">${galleryImages.map((image, index) => card(image, index, "gallery")).join("")}</div>
    <button class="btn primary full" onclick="saveMediaDescriptions('gallery')">Salvar galeria</button>
  </div>
  <div class="table-card admin-editor">
    <div class="step-head"><h3>Fotos do Instagram</h3><label class="btn ghost small file-btn">Adicionar foto<input type="file" accept="image/*" multiple onchange="handleGalleryUpload(event, 'instagram')"></label></div>
    <div class="media-edit-grid">${instagramImages.map((image, index) => card(image, index, "instagram")).join("")}</div>
    <button class="btn primary full" onclick="saveMediaDescriptions('instagram')">Salvar Instagram</button>
  </div>`;
}

function renderAddonEditor() {
  return `<div class="addon-admin-grid">${addonGroups.map((group, groupIndex) => `<div class="table-card admin-editor">
    <div class="step-head"><label>Grupo<input data-addon-group="${groupIndex}" value="${escAttr(group.group)}"></label><button class="btn ghost small" onclick="addAdminAddon(${groupIndex})">Novo item</button></div>
    ${group.items.map((addon, itemIndex) => `<div class="form-grid addon-row" data-addon-row="${groupIndex}-${itemIndex}">
      <label>Adicional<input data-addon-name value="${escAttr(addon.name)}"></label>
      <label>Preco<input data-addon-price value="${addon.price}"></label>
    </div>`).join("")}
  </div>`).join("")}</div>
  <button class="btn primary full" onclick="saveAddonsEditor()">Salvar adicionais</button>`;
}

function renderCategoryEditor() {
  return `<div class="table-card admin-editor"><div class="step-head"><h3>Categorias do cardapio</h3><button class="btn ghost small" onclick="addAdminCategory()">Nova categoria</button></div>
    <div class="admin-product-list">${categories.map((category, index) => `<div class="form-grid addon-row"><label>Categoria<input data-category-index="${index}" value="${escAttr(category)}"></label><button class="btn ghost small" onclick="removeAdminCategory(${index})">Excluir</button></div>`).join("")}</div>
    <button class="btn primary full" onclick="saveCategoriesEditor()">Salvar categorias</button>
  </div>`;
}

function renderReviewEditor() {
  return `<div class="table-card admin-editor"><div class="step-head"><h3>Avaliacoes editaveis</h3><button class="btn ghost small" onclick="addAdminReview()">Nova avaliacao</button></div>
    <div class="admin-product-list">${reviews.map((review, index) => `<form class="product-edit-card" data-review-row="${index}">
      <div class="form-grid">
        <label>Iniciais<input data-review-field="0" value="${escAttr(review[0])}"></label>
        <label>Nome<input data-review-field="1" value="${escAttr(review[1])}"></label>
      </div>
      <label>Comentario<textarea data-review-field="2">${escAttr(review[2])}</textarea></label>
      <button type="button" class="btn ghost small" onclick="removeAdminReview(${index})">Excluir avaliacao</button>
    </form>`).join("")}</div>
    <button class="btn primary full" onclick="saveReviewsEditor()">Salvar avaliacoes</button>
  </div>`;
}

function renderAdmin(panel) {
  $$(".admin-tab").forEach(tab => tab.classList.toggle("active", tab.dataset.admin === panel));
  const titles = { site: "Editar site", products: "Cardapio", categories: "Categorias", addons: "Adicionais", gallery: "Galeria", promos: "Promocoes", customers: "Clientes", reviews: "Avaliacoes", settings: "Configuracoes" };
  const subtitles = {
    site: "Altere textos, chamada principal, promocao em destaque e indicadores da pagina.",
    products: "Cadastre, edite, exclua e troque fotos dos itens do cardapio.",
    categories: "Organize as abas visiveis no cardapio do cliente.",
    addons: "Configure complementos, saladas, molhos e batatas que entram no pedido.",
    gallery: "Envie fotos direto da galeria do celular ou computador.",
    promos: "Configure cupons, combos e ofertas por tempo limitado.",
    customers: "Veja clientes, recorrencia, gasto acumulado e ultimo pedido.",
    reviews: "Edite depoimentos exibidos na vitrine.",
    settings: "Ajuste contatos, horario, endereco e dados principais da loja."
  };
  $("#adminTitle").textContent = titles[panel];
  $("#adminSubtitle").textContent = subtitles[panel];
  const panels = {
    site: renderSiteEditor(),
    products: renderProductEditor(),
    categories: renderCategoryEditor(),
    addons: renderAddonEditor(),
    gallery: renderGalleryEditor(),
    promos: `<div class="metric-grid"><div class="metric"><small>Cupom</small><strong>BRASA10</strong><p>10% acima de R$ 70</p></div><div class="metric"><small>Combo</small><strong>Smoke</strong><p>Valido ate 23:59</p></div><div class="metric"><small>Fixo</small><strong>R$ 8 off</strong><p>Primeiro pedido</p></div></div>`,
    customers: `<div class="table-card"><table><thead><tr><th>Cliente</th><th>Telefone</th><th>Pedidos</th><th>Valor gasto</th><th>Ultimo pedido</th></tr></thead><tbody>${[["Marina Alves","6499236-0895","28","R$ 1.642","Hoje"],["Rafael Costa","6498123-2048","21","R$ 1.104","Ontem"],["Lia Braga","6497000-3300","17","R$ 934","Segunda"]].map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`,
    reviews: renderReviewEditor(),
    settings: `<form class="form-card admin-editor" onsubmit="saveSettingsEditor(event)"><div class="form-grid"><label>Nome da loja<input data-setting="brandShort" value="${escAttr(site.brandShort)}"></label><label>WhatsApp numero limpo<input data-setting="whatsapp" value="${escAttr(site.whatsapp)}"></label><label>WhatsApp exibicao<input data-setting="whatsappDisplay" value="${escAttr(site.whatsappDisplay)}"></label><label>Instagram<input data-setting="instagram" value="${escAttr(site.instagram)}"></label><label>URL Instagram<input data-setting="instagramUrl" value="${escAttr(site.instagramUrl)}"></label><label>Horario<input data-setting="hours" value="${escAttr(site.hours)}"></label><label>Endereco<input data-setting="address" value="${escAttr(site.address)}"></label><label>Taxa de entrega<input value="7,90"></label><label>Raio de entrega<input value="6 km"></label></div><button class="btn primary">Salvar configuracoes</button></form>`
  };
  $("#adminContent").innerHTML = panels[panel];
}

function refreshEditableViews(panel = "site", message = "Alteracoes salvas") {
  saveAdminState();
  applySiteContent();
  renderCategories();
  renderProducts();
  renderReviews();
  renderMediaGrids();
  renderCart();
  renderAdmin(panel);
  toast(message);
}

function saveSiteEditor(event) {
  event.preventDefault();
  $$("[data-site-input]").forEach(input => site[input.dataset.siteInput] = input.value);
  refreshEditableViews("site");
}

function saveSettingsEditor(event) {
  event.preventDefault();
  $$("[data-setting]").forEach(input => site[input.dataset.setting] = input.value);
  site.instagram = site.instagram.startsWith("@") ? site.instagram : `@${site.instagram}`;
  refreshEditableViews("settings");
}

function saveProductsEditor() {
  products = $$("[data-product-row]").map(row => {
    const product = {};
    row.querySelectorAll("[data-field]").forEach(input => {
      const field = input.dataset.field;
      product[field] = field === "price" || field === "old" ? Number(String(input.value).replace(",", ".")) || undefined : input.value;
    });
    product.id = Number(row.dataset.productId) || Date.now();
    product.name = product.name?.trim() || "Produto sem nome";
    product.desc = product.desc?.trim() || "Descricao do produto.";
    product.ingredients = product.ingredients?.trim() || "Ingredientes do produto.";
    product.cat = product.cat || categories[0] || "Hamburgueres";
    product.img = product.img || "assets/burger-double-cheddar-bacon.jpg";
    delete product.isDraft;
    return product;
  });
  activeCategory = products[0]?.cat || activeCategory;
  refreshEditableViews("products", "Cardapio salvo e atualizado");
}

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function uploadImageFile(file, folder = "uploads") {
  if (!supabaseClient || !adminLoggedIn) return readImageFile(file);
  const ext = file.name.split(".").pop() || "jpg";
  const safeName = `${folder}/${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;
  const { error } = await supabaseClient.storage.from("site-images").upload(safeName, file, {
    cacheControl: "3600",
    upsert: false
  });
  if (error) {
    toast("Falha no upload. Salvando localmente.");
    return readImageFile(file);
  }
  const { data } = supabaseClient.storage.from("site-images").getPublicUrl(safeName);
  return data.publicUrl;
}

async function handleProductImageUpload(event, index) {
  const file = event.target.files?.[0];
  if (!file) return;
  const imageUrl = await uploadImageFile(file, "products");
  const row = event.target.closest("[data-product-row]");
  row.querySelector('[data-field="img"]').value = imageUrl;
  row.querySelector(`[data-product-preview="${index}"]`).src = imageUrl;
  toast("Foto carregada. Clique em salvar cardapio.");
}

function addAdminProduct() {
  const category = activeCategory || categories[0] || "Hamburgueres";
  const product = { id: Date.now(), cat: category, name: "Novo produto", desc: "Descricao do produto.", price: 0, old: undefined, badge: "", img: "assets/burger-double-cheddar-bacon.jpg", ingredients: "Ingredientes do produto.", isDraft: true };
  products.unshift(product);
  activeCategory = category;
  refreshEditableViews("products", "Produto novo criado no topo. Preencha e salve.");
}

async function handleGalleryUpload(event, type) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;
  const uploaded = await Promise.all(files.map(async file => ({ src: await uploadImageFile(file, type), alt: file.name.replace(/\.[^.]+$/, "") })));
  if (type === "instagram") instagramImages.push(...uploaded);
  else galleryImages.push(...uploaded);
  refreshEditableViews("gallery");
}

function saveMediaDescriptions(type) {
  const target = type === "instagram" ? instagramImages : galleryImages;
  $$(`[data-media-alt^="${type}-"]`).forEach(input => {
    const index = Number(input.dataset.mediaAlt.split("-").pop());
    if (target[index]) target[index].alt = input.value;
  });
  refreshEditableViews("gallery");
}

function removeMediaImage(type, index) {
  if (type === "instagram") instagramImages.splice(index, 1);
  else galleryImages.splice(index, 1);
  refreshEditableViews("gallery");
}

function resetAdminData() {
  localStorage.removeItem(storageKey);
  location.reload();
}

function removeAdminProduct(index) {
  products.splice(index, 1);
  refreshEditableViews("products");
}

function saveCategoriesEditor() {
  categories = $$("[data-category-index]").map(input => input.value.trim()).filter(Boolean);
  if (!categories.length) categories = ["Hamburgueres"];
  if (!categories.includes(activeCategory)) activeCategory = categories[0];
  refreshEditableViews("categories");
}

function addAdminCategory() {
  categories.push("Nova categoria");
  refreshEditableViews("categories");
}

function removeAdminCategory(index) {
  categories.splice(index, 1);
  if (!categories.length) categories.push("Hamburgueres");
  refreshEditableViews("categories");
}

function saveAddonsEditor() {
  addonGroups = $$("[data-addon-group]").map(groupInput => {
    const groupIndex = groupInput.dataset.addonGroup;
    const items = $$(`[data-addon-row^="${groupIndex}-"]`).map(row => ({
      name: row.querySelector("[data-addon-name]").value,
      price: Number(row.querySelector("[data-addon-price]").value.replace(",", ".")) || 0
    })).filter(item => item.name.trim());
    return { group: groupInput.value, items };
  });
  refreshEditableViews("addons");
}

function addAdminAddon(groupIndex) {
  addonGroups[groupIndex].items.push({ name: "Novo adicional", price: 0 });
  refreshEditableViews("addons");
}

function saveReviewsEditor() {
  reviews = $$("[data-review-row]").map(row => [
    row.querySelector('[data-review-field="0"]').value,
    row.querySelector('[data-review-field="1"]').value,
    row.querySelector('[data-review-field="2"]').value
  ]).filter(review => review[1].trim() || review[2].trim());
  refreshEditableViews("reviews");
}

function addAdminReview() {
  reviews.push(["MB", "Novo cliente", "Comentario da avaliacao."]);
  refreshEditableViews("reviews");
}

function removeAdminReview(index) {
  reviews.splice(index, 1);
  refreshEditableViews("reviews");
}

function tickCountdown() {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 0);
  const diff = Math.max(0, end - now);
  const h = String(Math.floor(diff / 36e5)).padStart(2, "0");
  const m = String(Math.floor(diff % 36e5 / 6e4)).padStart(2, "0");
  const s = String(Math.floor(diff % 6e4 / 1000)).padStart(2, "0");
  $("#countdown").textContent = `${h}:${m}:${s}`;
  const hour = now.getHours();
  $("#storeStatus").textContent = hour >= 18 && hour < 24 ? "Aberto ate 23:30" : "Estamos fechados - voltamos as 18:00";
}

function revealOnScroll() {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  }), { threshold: .08 });
  $$(".reveal").forEach(el => observer.observe(el));
}

function toast(message) {
  $("#toast").textContent = message;
  $("#toast").classList.add("show");
  setTimeout(() => $("#toast").classList.remove("show"), 2400);
}

window.openProduct = openProduct;
window.closeModal = closeModal;
window.closeCart = closeCart;
window.changeQty = changeQty;
window.removeItem = removeItem;
window.editItem = editItem;
window.adminLogout = adminLogout;
window.saveSiteEditor = saveSiteEditor;
window.saveSettingsEditor = saveSettingsEditor;
window.saveProductsEditor = saveProductsEditor;
window.handleProductImageUpload = handleProductImageUpload;
window.addAdminProduct = addAdminProduct;
window.removeAdminProduct = removeAdminProduct;
window.saveCategoriesEditor = saveCategoriesEditor;
window.addAdminCategory = addAdminCategory;
window.removeAdminCategory = removeAdminCategory;
window.saveAddonsEditor = saveAddonsEditor;
window.addAdminAddon = addAdminAddon;
window.handleGalleryUpload = handleGalleryUpload;
window.saveMediaDescriptions = saveMediaDescriptions;
window.removeMediaImage = removeMediaImage;
window.resetAdminData = resetAdminData;
window.saveReviewsEditor = saveReviewsEditor;
window.addAdminReview = addAdminReview;
window.removeAdminReview = removeAdminReview;
document.addEventListener("DOMContentLoaded", init);
