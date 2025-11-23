const categoryMap = {
    men: "Män",
    women: "Kvinnor",
    jewelery: "Smycken",
    electronics: "Elektronik"
  };
  
  // DOM-referenser
  const sectionTitle = document.getElementById("category-title");
  const productsContainer = document.getElementById("products-container");
  
  // Hämta kategori från URL-param
  function getCategoryFromQuery() {
    const params = new URLSearchParams(window.location.search);
    return params.get("category");
  }
  
  // Rendera produkter
  function renderProducts(products) {
    productsContainer.innerHTML = "";
  
    products.forEach(product => {
      const box = document.createElement("div");
      box.className = "box product-box";
  
      box.innerHTML = `
        <img src="${product.image}" alt="${product.title}" />
        <div class="product-row">
          <div class="text-column">
            <h3>${product.title}</h3>
            <p class="price">${product.price} kr</p>
          </div>
          <i class="bi bi-cart-plus"></i>
        </div>
      `;
      productsContainer.appendChild(box);
    });
  }
  
  // Ladda produkter
  async function loadProducts(categoryKey) {
    if (!categoryKey) return;
  
    sectionTitle.textContent = categoryMap[categoryKey] || "";
  
    // FakeStoreAPI-kategorier
    const apiMap = {
      men: "men's clothing",
      women: "women's clothing",
      jewelery: "jewelery",
      electronics: "electronics"
    };
  
    const apiCategory = apiMap[categoryKey];
    const res = await fetch(`https://fakestoreapi.com/products/category/${apiCategory}`);
    const data = await res.json();
    renderProducts(data);
  }
  
  // load
  loadProducts(getCategoryFromQuery());
  