let getFav = JSON.parse(localStorage.getItem('favourites')) || [];
let fav = document.getElementById('favourites');
fav.innerHTML = "";

getFav.forEach((item) => {
    let card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
    <img src="${item.image}" alt="">
    <h2>${item.title}</h2>
    <p>$${item.price.toFixed(2)}</p>
    <h3>${item.size}</h3>
    <button onclick='removeFromFav(${JSON.stringify(item.id)})'>Remove</button>
    `;
    fav.appendChild(card);
});

window.removeFromFav = function(id) {
    let fav = JSON.parse(localStorage.getItem('favourites')) || [];
    fav = fav.filter(i => i.id !== id);
    localStorage.setItem('favourites', JSON.stringify(fav));
    location.reload();
}