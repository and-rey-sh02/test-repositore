document.addEventListener('DOMContentLoaded', function() {

let productsGrid = document.getElementById('products-grid');
let productsArray = [];
let xhr = new XMLHttpRequest();
let url = "https://my-json-server.typicode.com/and-rey-sh02/test-repositore";

xhr.open('GET', url+'/products');
xhr.onload = function() {
    productsArray = JSON.parse(xhr.response);
    productsGrid.innerHTML = null;
    productsArray.forEach(p => {
        productsArray.push(p);
        let pElem = document.createElement('div');
        pElem.classList.add('product');
        pElem.innerHTML = `
            <h2 class='product-name'>${p.name}</h2>
            <img class='product-photo' src='${p.photo_url}' alt='${p.name}'>
            <p class='product-price'><b>Price: </b>${p.price}$</p>
            <p class='product-description'><b>Description: </b>${p.description}</p>
            <a href='userProfile.html?id=${p.author_id}'>Seller profile</a>
            <button id="btn_buy_${p.id}">Buy</button>
        `;
        let btn_buy = pElem.querySelector(`#btn_buy_${p.id}`);
            btn_buy.addEventListener('click', function () {
                addProductToCart(p.id);
            });
        productsGrid.append(pElem);
    });
}
xhr.send();

function addProductToCart(id) {
    xhr.open('GET',`${url}/products/${id}`);
    xhr.responseType = 'json'
    xhr.onload = function() {

    }
}


let cartProd = document.getElementById('cart-products');

let cart_button = document.querySelector("#cart-button");

function openCart() {
    cartProd.classList.toggle('hide');
}

cart_button.addEventListener('click', function() {
    openCart();
});

let cart = [];
if(localStorage.getItem('cart')) {
    cart = JSON.parse(localStorage.getItem('cart'));
    drawCartProducts();
}


function addProductToCart(id) {
    let product = productsArray.find(function(p) {
        return p.id == id;
    })
    cart.push(product);
    drawCartProducts();
    localStorage.setItem("cart", JSON.stringify(cart));

    document.getElementById('cart-button').classList.add('active');
    setTimeout(function(){
        document.getElementById('cart-button').classList.remove('active');
    },500);
}


function drawCartProducts() {
    if(cart.length === 0) return cartProd.innerHTML = 'Cart is empty';
    cartProd.innerHTML = null;
    let sum = 0;
    cart.forEach(function(p){
        cartProd.innerHTML += `
            <p><img src="${p.photo_url}"> ${p.name} |${p.price}$</p>
            <hr>
        `;
        sum += p.price;
    });
    cartProd.innerHTML += `
        <p>Total Price: ${sum}$</p>
        <button id="btn_buy_all">Buy All</button>
    `;
}

let btn_buy_all = document.querySelector("#btn_buy_all");

if (btn_buy_all) {
    btn_buy_all.addEventListener('click', function() {
        buyAll();
    });
}

function buyAll() {
    cart = [];
    cartProd.innerHTML = 'Money was withdrawn from your credit card';
    localStorage.setItem("cart", '[]');
}



});