// -----------------------------
// Productos vendate.cl
// -----------------------------
const products = [
    {
      id: 1,
      name: "Finger Tape 0,5 cm x 13 m",
      price: 4990,
      image: "img/finger.jpg", // asegúrate que el archivo exista
      description: "Ideal para dedos, sujeción firme y cómoda para deportistas."
    },
    {
      id: 2,
      name: "Tape rígido 5 cm x 5 m",
      price: 5990,
      image: "img/tape.jpg",
      description: "Perfecto para tobillos y rodillas. Soporte máximo en entrenamientos y partidos."
    },
    {
      id: 3,
      name: "Venda elástica tipo Coban",
      price: 3990,
      image: "img/coban.jpg",
      description: "Venda autoadherente que no se pega a la piel. Muy utilizada en fútbol profesional."
    }
  ];
  
  // -----------------------------
  // Funciones de carrito (localStorage)
  // -----------------------------
  function getCart() {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  }
  
  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
  }
  
  function addToCart(productId) {
    const cart = getCart();
    cart.push(productId); // guardamos solo IDs
    saveCart(cart);
  }
  
  function removeOneFromCart(productId) {
    const cart = getCart();
    const index = cart.indexOf(productId);
    if (index !== -1) {
      cart.splice(index, 1); // elimina una unidad de ese producto
      saveCart(cart);
    }
  }
  
  function clearCart() {
    localStorage.removeItem("cart");
    updateCartCount();
    renderCart();
  }
  
  function updateCartCount() {
    const badge = document.querySelector("#cart-count");
    if (!badge) return;
    const cart = getCart();
    badge.textContent = cart.length;
  }
  
  // -----------------------------
  // Home: grilla de productos
  // -----------------------------
  function renderProductList() {
    const listContainer = document.querySelector("#product-list");
    if (!listContainer) return;
  
    products.forEach(product => {
      const col = document.createElement("article");
      col.className = "col-12 col-sm-6 col-md-4";
  
      col.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${product.image}" class="card-img-top" alt="${product.name}">
          <div class="card-body d-flex flex-column">
            <h2 class="card-title h5">${product.name}</h2>
            <p class="card-text text-muted mb-2">$${product.price.toLocaleString("es-CL")}</p>
            <p class="card-text small flex-grow-1">${product.description}</p>
            <div class="d-flex gap-2 mt-3">
              <button class="btn btn-success btn-sm w-100" data-add="${product.id}">
                Agregar al carrito
              </button>
              <a href="product.html?id=${product.id}" class="btn btn-outline-primary btn-sm w-100">
                Ver más
              </a>
            </div>
          </div>
        </div>
      `;
      listContainer.appendChild(col);
    });
  
    // Delegación de eventos para los botones "Agregar al carrito"
    listContainer.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-add]");
      if (!button) return;
      const id = Number(button.getAttribute("data-add"));
      addToCart(id);
    });
  }
  
  // -----------------------------
  // Detalle de producto
  // -----------------------------
  function renderProductDetail() {
    const detailContainer = document.querySelector("#product-detail");
    if (!detailContainer) return;
  
    const params = new URLSearchParams(window.location.search);
    const productId = Number(params.get("id")) || 1;
    const product = products.find(p => p.id === productId) || products[0];
  
    detailContainer.innerHTML = `
      <div class="col-12 col-md-6 mb-4 mb-md-0">
        <img src="${product.image}" class="img-fluid rounded shadow-sm" alt="${product.name}">
      </div>
      <div class="col-12 col-md-6">
        <h1 class="h3">${product.name}</h1>
        <p class="text-muted fs-4 mb-3">$${product.price.toLocaleString("es-CL")}</p>
        <p class="mb-4">${product.description}</p>
        <button id="btn-add-detail" class="btn btn-success btn-lg mb-3">
          Agregar al carrito
        </button>
        <div>
          <a href="index.html" class="btn btn-outline-secondary btn-sm">Volver al catálogo</a>
        </div>
      </div>
    `;
  
    const addButton = document.querySelector("#btn-add-detail");
    addButton.addEventListener("click", () => {
      addToCart(product.id);
    });
  }
  
  // -----------------------------
  // Carrito
  // -----------------------------
  function renderCart() {
    const cartContainer = document.querySelector("#cart-items");
    const summaryContainer = document.querySelector("#cart-summary");
    if (!cartContainer || !summaryContainer) return;
  
    const cart = getCart();
  
    if (cart.length === 0) {
      cartContainer.innerHTML = `
        <div class="alert alert-info" role="alert">
          Tu carrito está vacío. Vuelve al <a href="index.html" class="alert-link">catálogo</a> para agregar productos.
        </div>
      `;
      summaryContainer.innerHTML = "";
      return;
    }
  
    // Contar cuántas unidades hay de cada producto
    const itemsMap = {};
    cart.forEach(id => {
      itemsMap[id] = (itemsMap[id] || 0) + 1;
    });
  
    let total = 0;
    cartContainer.innerHTML = "";
  
    Object.keys(itemsMap).forEach(id => {
      const product = products.find(p => p.id === Number(id));
      if (!product) return;
  
      const quantity = itemsMap[id];
      const subtotal = product.price * quantity;
      total += subtotal;
  
      const row = document.createElement("article");
      row.className = "card mb-3 shadow-sm";
  
      row.innerHTML = `
        <div class="card-body d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div class="d-flex align-items-center gap-3">
            <img src="${product.image}" alt="${product.name}" class="rounded" style="width:70px; height:70px; object-fit:cover;">
            <div>
              <h2 class="h6 mb-1">${product.name}</h2>
              <p class="mb-0 small text-muted">Precio unitario: $${product.price.toLocaleString("es-CL")}</p>
              <p class="mb-0 small text-muted">Cantidad: ${quantity}</p>
            </div>
          </div>
  
          <div class="d-flex flex-column align-items-end gap-2">
            <span class="fw-bold">Subtotal: $${subtotal.toLocaleString("es-CL")}</span>
            <button class="btn btn-sm btn-outline-danger" data-remove="${product.id}">
              Eliminar uno
            </button>
          </div>
        </div>
      `;
  
      cartContainer.appendChild(row);
    });
  
    summaryContainer.innerHTML = `
      <div class="card">
        <div class="card-body d-flex justify-content-between align-items-center">
          <span class="fw-bold">Total</span>
          <span class="fs-5 fw-bold">$${total.toLocaleString("es-CL")}</span>
        </div>
      </div>
    `;
  
    // Listener para botones "Eliminar uno"
    cartContainer.onclick = (event) => {
      const btn = event.target.closest("[data-remove]");
      if (!btn) return;
      const id = Number(btn.getAttribute("data-remove"));
      removeOneFromCart(id);
      renderCart();
    };
  }
  
  // -----------------------------
  // Inicialización
  // -----------------------------
  document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    renderProductList();
    renderProductDetail();
    renderCart();
  
    const clearBtn = document.querySelector("#btn-clear-cart");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        clearCart();
      });
    }
  });
  