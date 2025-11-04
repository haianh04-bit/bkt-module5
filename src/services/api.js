const API_URL = "http://localhost:3001";

export async function getProducts() {
  const res = await fetch(`${API_URL}/products`);
  return res.json();
}

export async function getCategories() {
  const res = await fetch(`${API_URL}/categories`);
  return res.json();
}

export async function addProduct(product) {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  return res.json();
}
