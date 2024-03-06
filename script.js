document.addEventListener('DOMContentLoaded', function() {

let productsGrid = document.getElementById('products-grid');
let productsArray = [];
let xhr = new XMLHttpRequest();
let url = "https://market2-b5db.restdb.io/rest";

xhr.open('GET', url+'/products');
xhr.setRequestHeader("content-type", "application/json");
xhr.setRequestHeader("x-apikey", "65e78a0ad34bb021b08cb4a5");
xhr.setRequestHeader("cache-control", "no-cache");

xhr.responseType = 'json';
xhr.onload = function() {
    productsArray = xhr.response;
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
            <button id="btn_buy_${p._id}">Buy</button>
        `;
        
        let btn_buy = pElem.querySelector(`#btn_buy_${p._id}`);
            btn_buy.addEventListener('click', function () {
                addProductToCart(p._id);
            });
        productsGrid.append(pElem);
    });
}

xhr.send();

let cartProd = document.getElementById('cart-products');

let cart = [];
if(localStorage.getItem('cart')) {
    cart = JSON.parse(localStorage.getItem('cart'));
    drawCartProducts();
}

function addProductToCart(id) {
    let product = productsArray.find(function(p) {
        return p._id == id;
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
        sum += +p.price;
    });
    cartProd.innerHTML += `
        <p>Total Price: ${sum}$</p>
        <button id="btn_buy_all">Buy All</button>
    `;
}

let orderBlock = document.getElementById('order-block');
let modal = document.getElementById('myModal');
let span = document.getElementsByClassName('close')[0];

span.onclick = function() {
    modal.style.display = 'none';
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  }

  let btn_buy_all = document.querySelector("#btn_buy_all");

  if (btn_buy_all) {
      btn_buy_all.addEventListener('click', function() {
          buyAll();
      });
  }
  
  function buyAll() {
      modal.style.display = "block";
      let sum = 0;
      orderBlock.innerHTML = null;
  
      cart.forEach(function(p){
          orderBlock.innerHTML += `
              <div class="item">
                  <img width="100px" src="${p.photo_url}"> 
                  <h2>${p.name} | ${p.price}$</h2>
              </div>
          `;
          sum += +p.price;
      });
      document.getElementById('price').innerHTML = sum + '$';
  
  }

let cart_button = document.querySelector("#cart-button");

function openCart() {
    cartProd.classList.toggle('hide');
}

cart_button.addEventListener('click', function() {
    openCart();
});

document.getElementById('order-form').addEventListener('submit', function(e) {
    e.preventDefault();//
    let data = JSON.stringify({
        "name": e.target['name'].value,
        "address": e.target['address'].value,
        "phone": e.target['phone'].value,
        "post_number": e.target['post_number'].value,
        "status": "New",
        "products": localStorage.getItem('cart')
      });

      var xhr = new XMLHttpRequest();
      xhr.open("POST", url + "/orders");
      xhr.setRequestHeader("content-type", "application/json");
      xhr.setRequestHeader("x-apikey", "65e78a0ad34bb021b08cb4a5");
      xhr.setRequestHeader("cache-control", "no-cache");
      xhr.send(data);

      modal.style.display = "none";
      cart = [];
      cartProd.innerHTML = 'Money was withdrawn from your credit card';
      localStorage.setItem("cart", '[]');
})


});