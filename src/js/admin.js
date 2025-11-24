//Gör så att texten bara kan vara en viss längd
function shorten(text) {
  return text.length > 100 ? text.substring(0, 100) + "..." : text;
}

//Hämtar produkter från API / GET
let products = [];

function fetchProducts() {
  fetch("https://fakestoreapi.com/products")
    .then((response) => response.json())
    .then((rawProductData) => {
      products = rawProductData;
      renderProducts();
    })
    .catch((error) => console.error("Error:", error));
}

function renderProducts() {
  let html = "";

  products.forEach((item) => {
    html += `
            <div class="product-card">
                <h1 class="title">${item.title}</h1>
                <img src="${item.image}" class="product-images">
                <p>${shorten(item.description ?? "")}</p>
                <p class="price">${(Number(item.price) * 10).toFixed(2)}kr</p>
                <button class="delete-btn" onclick="deleteProduct(${item.id})">
                    Ta bort
                </button>
            </div>
        `;
  });

  document.querySelector("#product-cards").innerHTML = html;
}

//Lägga till produkt på sidan / POST
const form = document.getElementById("product-form");
form.addEventListener("submit", addProducts);

async function addProducts(e) {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;

  const product = { title: title, price: parseInt(price) };

  const res = await fetch("https://fakestoreapi.com/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  }).then((response) => response.json());

  products.unshift(res);
  renderProducts();

  form.reset();
}

fetchProducts();

//Ta bort produkt från sidan / DELETE
async function deleteProduct(id) {
  const confirmDelete = confirm(
    "Är du säker på att du vill ta bort denna produkt?"
  );
  if (!confirmDelete) return;

  try {
    await fetch(`https://fakestoreapi.com/products/${id}`, {
      method: "DELETE",
    });

    products = products.filter((product) => product.id !== id);

    renderProducts();
  } catch (error) {
    console.error("Kunde inte ta bort produkt:", error);
  }
}
