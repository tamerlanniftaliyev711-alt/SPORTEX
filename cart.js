let getCart = JSON.parse(localStorage.getItem('cart')) || [];
let cart = document.getElementById('cart');
cart.innerHTML = "";

getCart.forEach((item) => {
    let card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
    <img src= "${item.image}" alt ="">
    <h2>${item.title}</h2>
    <p>$${item.price.toFixed(2)}</p>
    <h3>${item.size}</h3>
    <button onclick = 'removeFromCart(${JSON.stringify(item.id)})'>Remove</button>
    `;
    cart.appendChild(card);
});

window.removeFromCart = function(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item  = cart.find(i => i.id === id);
    cart = cart.filter(i => i.id !== id);
    localStorage.setItem('cart' , JSON.stringify(cart));
    location.reload();
    
}