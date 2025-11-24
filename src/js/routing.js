import { productArray, addToCart, renderCart } from "./butik.js";

// DOM-referenser
const sectionTitle = document.getElementById("category-title");
const productsContainer = document.getElementById("products-container");

// Mappning av URL-nyckel → { svenska titel, JSON-kategori }
const categoryMap = {
  men: { title: "Män", json: "men's clothing" },
  women: { title: "Kvinnor", json: "women's clothing" },
  jewelery: { title: "Smycken", json: "jewelery" },
  electronics: { title: "Elektronik", json: "electronics" }
};

// Hämta kategori från URL
function getCategoryFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get("category");
}

// Rendera produkter med samma layout som index.html
function renderProductsFiltered(products) {
  productsContainer.innerHTML = ""; 

  products.forEach(p => {
    const el = document.createElement("div");
    el.classList.add("product-box");

    el.innerHTML = `
      <div class="box">
        <img src="${p.image}" alt="${p.title}" />
      </div>
      <div class="product-row">
        <div class="text-column">
          <h3>${p.title}</h3>
          <p class="price">${(Number(p.price) * 10).toFixed(2)}kr</p>
        </div>
        <i class="bi bi-cart-plus js-add-to-cart" data-productid="${p.id}"></i>

      </div>
    `;

    productsContainer.appendChild(el);
  });

  // Koppla "Lägg till i kundvagn"-knappar
  const buttonsArray = document.querySelectorAll(".js-add-to-cart");
  buttonsArray.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.productid);
      addToCart(id);
      renderCart(); 
    });
  });
}

// Ladda och filtrera produkter
function loadProducts(categoryKey) {
  const category = categoryMap[categoryKey];
  if (!category) return;

  sectionTitle.textContent = category.title;

  const filteredProducts = productArray.filter(
    p => p.category === category.json
  );

  renderProductsFiltered(filteredProducts);
}

// Vänta tills productArray är laddad i butik.js
const waitForProducts = setInterval(() => {
  if (productArray.length > 0) {
    clearInterval(waitForProducts);
    loadProducts(getCategoryFromQuery());
  }
}, 50);
