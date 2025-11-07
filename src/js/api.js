const API = 'https://fakestoreapi.com';

export async function getProducts() {
  try {
    const res = await fetch(`${API}/products`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    }
    const data = await res.json();
    
    return data;
  } catch (err) {
    console.error('getProducts error:', err);
    throw err;
  }
}
