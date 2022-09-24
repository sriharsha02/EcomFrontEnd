const cart_items = document.querySelector('#cart .cart-items');
const displayCartItems = document.getElementById('displayCartInCartPageBtn')

displayCartItems.addEventListener('click', displayCartTable)
  


function displayCartTable(productList){
  console.log('Inside displayCartTable function')
  axios.get('http://localhost:3001/cart')
    .then(response => {
      if(response.status === 200){
        // console.log(response)
        // console.log('Printing only products',response.data.products)
        response.data.products.forEach(product => {
          console.log('inside response foreach', product)
          const cartProductsContainer = document.getElementById('cartPageId');
          cartProductsContainer.innerHTML += `
          <div id= 'cartProductsDiv'>
          <h2><li>Item : ${product.title} - Quantity: ${product.cartItem.quantity} - Rs: ${product.price}</li></h2>
          </div>
          `
          
        })

      }
    })
    .catch(err => {
      console.log(err)
    })
}


window.addEventListener('DOMContentLoaded', () => {
  axios.get('http://localhost:3001/products').then((data) => {
    // console.log(data);
    if(data.request.status === 200){
      const products = data.data;
      console.log(products)
      const parentSection = document.getElementById('Products');
      products.forEach(product => {
        const productHtml = `
        <div id='productsdiv'>
          <h1>${product.title}</h1>
          <img src=${product.imageUrl}></img>
          <button id='products' onclick='addToCart(${product.id})'>Add To Cart</button>
        </div>`
        parentSection.innerHTML += productHtml;
      });
    }
  })
})

document.addEventListener('click',(e)=>{

  if (e.target.className=='shop-item-button'){
      const prodId = Number(e.target.parentNode.parentNode.id.split('-')[1]);
      axios.post('http://localhost:3001/cart', { productId: prodId}).then(data => {
          if(data.data.error){
              throw new Error('Unable to add product');
          }
          showNotification(data.data.message, false);
      })
      .catch(err => {
          console.log(err);
          showNotification(err, true);
      });

  }
  if (e.target.className=='cart-btn-bottom' || e.target.className=='cart-bottom' || e.target.className=='cart-holder'){
      axios.get('http://localhost:3001/cart').then(cartProducts => {
          // console.log('Cart Products Data',cartProducts.data.products)
          // console.log('in cart-holder-event listener')
          // showProductsInCart(cartProducts.data);
          // console.log('Cart Products',cartProducts.data.products)
          // showProductsInCart(cartProducts.data.products);
          showProductsInCart(cartProducts.data.products);
          
          document.querySelector('#cart').style = "display:block;"

      })
  }
  if (e.target.className=='cancel'){
      document.querySelector('#cart').style = "display:none;"
  }
  if (e.target.className=='purchase-btn'){
      if (parseInt(document.querySelector('.cart-number').innerText) === 0){
          alert('You have Nothing in Cart , Add some products to purchase !');
          return
      }
      alert('This Feature is yet to be completed ')
  }
})

function showProductsInCart(listofproducts){
  console.log('The Produts are: ', listofproducts) 
  cart_items.innerHTML = "";
  listofproducts.forEach(product => {
    console.log(product)
      const id = `shirtsId-${product.id}`;
      console.log('id in listof products ' , id)
      const name = document.querySelector(`#${id} h3`).innerText;
      const img_src = document.querySelector(`#${id} img`).src;
      const price = product.price;
      document.querySelector('.cart-number').innerText = parseInt(document.querySelector('.cart-number').innerText)+1
      const cart_item = document.createElement('div');
      cart_item.classList.add('cart-row');
      cart_item.setAttribute('id',`in-cart-${id}`);
      cart_item.innerHTML = `
      <span class='cart-item cart-column'>
      <img class='cart-img' src="${img_src}" alt="">
          <span>${name}</span>
      </span>
      <span class='cart-price cart-column'>${price}</span>
      <form onsubmit='deleteCartItem(event, ${product.id})' class='cart-quantity cart-column'>
          <input type="text" value="1">
          <button>REMOVE</button>
      </form>`
      cart_items.appendChild(cart_item)
  })
}
function deleteCartItem(e, prodId){
  e.preventDefault();
  axios.post('http://localhost:3001/cart', {productId: prodId})
      .then(() => removeElementFromCartDom(prodId))
}

function removeElementFromCartDom(prodId){
      document.getElementById(`in-cart-album-${prodId}`).remove();
      showNotification('Succesfuly removed product')
}
function addToCart(productId){
  console.log(productId)

  axios.post('http://localhost:3001/cart', {id: productId})
    .then((response) => {
      if(response.status === 200){
        notifyUsers(response.data.message)

      }
    })
    .catch((error) => {
      console.log(error)
      notifyUsers(error.data.message)
    })
}

function notifyUsers(message){
  const container = document.getElementById('container');
    const notification = document.createElement('div')
    notification.classList.add('notification')
    notification.innerHTML = `<h4>${message}</h4>`
    container.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 2000)
}
