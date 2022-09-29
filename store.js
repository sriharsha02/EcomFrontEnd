const cart_items = document.querySelector('#cart .cart-items');
// const displayCartItems = document.getElementById('displayCartInCartPageBtn')

// displayCartItems.addEventListener('click', displayCartTable)
  


function displayCartTable(){
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
function displayOrders(){
  console.log('inside display orders function')
  axios.get('http://localhost:3001/orders')
    .then(response => {
      if(response.status === 200){
        console.log(response)
        response.data.orders.forEach(order => {
          const cartOrdersContainer = document.getElementById('cartPageId');
          cartOrdersContainer.innerHTML += `
          <div id= 'ordersDiv'>
          <h2><li>Item : ${order.id} is placed </li> </h2>
          </div>
          `
          
        })

      }

    })
}


window.addEventListener('DOMContentLoaded', () => {
  var path = window.location.pathname;
  var pages = path.split("/").pop();
  if(pages.includes('store') ){
    const page = 1;
    const backendAPI = 'http://localhost:3001'
    axios.get(`${backendAPI}/products?page=${page}`)
      .then((res) => {
      // console.log(data);
      listProducts(res.data.products)
      showPagination(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
    axios.get(`${backendAPI}/cart`)
      .then((res) => res.data.products.forEach((p) => addProductToCart(p)))
      .catch((err) => console.log(err))
    
  }
  if(pages.includes('cart')){
    displayCartTable()
  }
  if(pages.includes('order')){
    displayOrders()
  }
  })
function listProducts(productsData){
  console.log(productsData)
  console.log("dsjfhjksdfkjsdfkjsdfkjsdkjfkjsdfkj")
  const products = document.getElementById('Products');
  products.innerHTML = ''
  productsData.forEach((product) => {
    console.log(product)
    console.log("dsjfhjsjsdkjfkjsdfkj")
    const prod = document.createElement('div')
    prod.className = "product"
    prod.id = `product${product.id}`
    prod.innerHTML =  `<div class='product-image'>
      <img
        src=${product.imageUrl}
        alt=${product.title}
      />
    </div>
    <div class="product-info">
      <div class-"product-top-row">
        <h3 class="product-name">${product.title}</h3>
        <p>&#9733;&#9733;&#9733;&#9733;</p>
      </div>
      <div class = "product-bottom-row">
        <p class="product-price">${product.price}</p>
        <button class="add-to-cart" onclick='addToCart(${product.id})'>Add to Cart</button>
      </div>
    </div>`;
    products.appendChild(prod)
  })

}

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
  if(e.target.id =='displayCartInCartPageBtn'){
    // displayCartTable()
    axios.post('http://localhost:3001/create-order').then(data => {
        if(data.data.error){
            throw new Error('Unable to buy product');
        }
        window.location.href = "./orders.html";
    })
    .catch(err => {
        console.log(err);
        // showNotification(err, true);
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
  const cartProductsContainer = document.getElementById('cartPageId');
  cartProductsContainer.innerHTML = "";
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
function addProductToCart({
  id,
  title,
  imageUrl,
  price,
  cartitem: {quantity},
}){
  const itemId = `cartitem - ${itemId}`
  const item = document.getElementById(itemId)
  if(item){
    item.querySelector(".cartitem-qty").value = quantity;

  }else{
    const newItem = document.createElement("div")
    newItem.className = "cartItem"
    newItem.id = itemId
    newItem.innerHTML += `<img src = ${imageUrl}`
    newItem.innerHTML += `<p class = 'cartitem-name'>${title}</p>`
    newItem.innerHTML += `<input class= 'cartitem-qty' type= 'number' value= ${quantity}>`
    newItem.innerHTML += `<p class= 'cartitem-price'>${price}</p>`

    const removeBtn = document.createElement('button')
    removeBtn.innerText = "Remove"
    removeBtn.addEventListener('click', () => {
      const total = totalPrice.innerText;
      let qty = newItem.querySelector(".cartitem-qty").value
      totalPrice.innerText = parseInt(total)- parseInt(price)*parseInt(qty)
      newItem.remove()
    })
    newItem.appendChild(removeBtn)
    cartItems.appendChild(newItem)

  }
  const total  = totalPrice.innerText;
  totalPrice.innerText = parseInt(total) + parseInt(price)
}
function showPagination({
  currentPage,
  hasNextPage,
  nextPage,
  hasPreviousPage,
  previousPage,
  lastPage
}){
  const showPagination = document.getElementById('Pagination');
  showPagination.innerHTML = '';
  if(hasPreviousPage){
    const btn2 = document.createElement('button')
    btn2.innerHTML = previousPage
    btn2.addEventListener('click', () => getProducts(previousPage))
    showPagination.appendChild(btn2)
  }
    const btn1 = document.createElement('button')
    btn1.innerHTML = `<h3>${currentPage}</h3>`
    btn1.addEventListener('click', () => getProducts(currentPage))
    showPagination.appendChild(btn1)
  if(hasNextPage){
    const btn3 = document.createElement('button')
    btn3.innerHTML = nextPage
    btn3.addEventListener('click', () =>getProducts(nextPage))
    showPagination.appendChild(btn3)
  }

}
function getProducts(page){
  axios.get(`http://localhost:3001/products?page=${page}`)
    .then(({data : {products, ...pageData}}) => {
      listProducts(products)
      showPagination(pageData)
    })
}
function emptyCart(){
  cart_items.innerHTML = '';
}