import GetData from './server.js';

const productsContainer = document.getElementById("products");

const category = new URLSearchParams(window.location.search).get('category');

const data = await GetData(category);

data.forEach((products) => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    productCard.innerHTML = `
    <img src= "${products.image}" alt ="">
    <h2>${products.title}</h2>
    <p>$${products.price.toFixed(2)}</p>
    <h3>${products.size}</h3>
    <div id ="favcart">
    <button id ="addtocart" type= "button" onclick = 'addToCart(${JSON.stringify(products)})'>
        Add To Cart
    </button>
    <button id ="addtofav" type="button" onclick='addToFav(${JSON.stringify(products.id)})'>
    <img src= "./love.png" alt ="">
    </button>
    </div>
    
    `
    productsContainer.appendChild(productCard);
});

window.addToCart = function (products) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(products);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${products.title} has been added to your cart.`)
}

window.addToFav = function (id) {
    let fav = JSON.parse(localStorage.getItem('favourites')) || [];
    const product = data.find(p => p.id === id);
    fav.push(product);
    localStorage.setItem('favourites', JSON.stringify(fav));
    alert(`${product.title} has been added to your favourites.`);
}

const searchProducts = document.getElementById("search")
const submitBtn = document.getElementById("submitBtn")

submitBtn.addEventListener('click', () => {
    const text = searchProducts.value.toLowerCase().trim();

    const filtered = data.filter(p =>
        p.title.toLowerCase().includes(text)
    )
    document.querySelectorAll(".product-card").forEach((card , i) => {
        card.style.display = filtered.includes(data[i]) ? "" : "none"
    }) 
})

searchProducts.addEventListener('keydown', (e) => {
    if (e.key === "Enter") {
        submitBtn.click()
    }
})