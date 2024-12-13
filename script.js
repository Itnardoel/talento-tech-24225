// Form submit event

const $form = document.querySelector('form')
// const $name = document.getElementById('name')
// const $email = document.getElementById('email')
// const $message = document.getElementById('message')

function checkFormValues(event) {
  event.preventDefault();

  const {name, email, message} = Object.fromEntries(new FormData(event.target))

  if (!name || !email || !message) {
    console.log("Campos del formulario sin completar")
    return
  }

  console.log("Formulario de contacto completo. Enviando mensaje...")

  // event.submit()
}

$form.addEventListener('submit', (event) => checkFormValues(event))

// API functions

const coffees = []
let totalInCart = 0

async function getCoffee() {
  try {
    const response = await fetch('https://fake-coffee-api.vercel.app/api')

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const products = await response.json()

    const $divProductos = document.querySelector('.productos')

    products.forEach((coffee) => {
      coffees.push(coffee)

      console.log(coffees)

      const $product = document.createElement('div')

      $product.classList.add('producto')

      $product.innerHTML += `
                          <img src=${coffee.image_url} alt="${coffee.name} image">
                          <h2>${coffee.name}</h2>
                          <h3>${coffee.description}</h3>
                          <p>${coffee.price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS'})}</p>
                          <button>Agregar al carrito</button>
      `

      $divProductos.appendChild($product)

      // Event to button
      const $coffeeButton = $product.querySelector('button')

      $coffeeButton.addEventListener('click', (event) => addToCart(event, coffee))

      // Event to modal
      $product.addEventListener('click', () => {
        const $modal = document.getElementById('modal')

        $modal.classList.add('show-modal')

        $modal.firstElementChild.innerHTML = `
                          <svg id="close-button-modal" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                          <img src=${coffee.image_url} alt="${coffee.name} image">
                          <h2>${coffee.name}</h2>
                          <h3>${coffee.description}</h3>
                          <p>${coffee.price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS'})}</p>
                          <button>Agregar al carrito</button>
      `
        $modal.addEventListener('click', () => $modal.classList.remove('show-modal'))

        const $closeButton = document.getElementById('close-button-modal')
        $closeButton.addEventListener('click', () => $modal.classList.remove('show-modal'))

        const $modalButton = $modal.querySelector('button')
        $modalButton.addEventListener('click', (event) => addToCart(event, coffee))

        const $modalCard = document.querySelector('.modal-card')
        $modalCard.addEventListener('click', (event) => event.stopPropagation())
      })
    })

    getCart()
  } catch (error) {
    console.error('Error en la comunicación con la API:', error)
  }
}

document.addEventListener('DOMContentLoaded', getCoffee())

function getCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || []

  // UPDATE CART COUNTER
  const cartCounter = document.getElementById('cart-counter')

  if (cart.length > 0) {
    let totalCount = 0

    cart.forEach(({stock}) => totalCount += stock)

    cartCounter.textContent = totalCount
  }

  updateModalCart(cart)
}

function addToCart(event, coffeeToAdd) {
  event.stopPropagation()

  const storagedCart = JSON.parse(localStorage.getItem("cart")) || []

  const coffeeFoundInStorage = storagedCart.find(coffee => coffee.id === coffeeToAdd.id)

  if (coffeeFoundInStorage) {
    coffeeFoundInStorage.stock ++ 
  } else {
    storagedCart.push({...coffeeToAdd, stock: 1})
  }
  
  localStorage.setItem("cart", JSON.stringify(storagedCart))

  console.log("Producto añadido al carrito")
  
  getCart()
}

function updateModalCart(cart) {
  const $cart = document.getElementById('cart')  

  if (cart.length === 0) {
    $cart.firstElementChild.innerHTML =`
                                    <svg id="close-button-cart" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                                    <p style="text-align: center; font-weight: bold;">El carrito de compras está vacío</p>
    `

    const $closeButtonCart = document.getElementById('close-button-cart')
    $closeButtonCart.addEventListener('click', () => document.getElementById('cart').classList.remove('show-cart'))

    return
  } else {
    $cart.firstElementChild.innerHTML =`
                                    <svg id="close-button-cart" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
    `

    const $closeButtonCart = document.getElementById('close-button-cart')
    $closeButtonCart.addEventListener('click', () => document.getElementById('cart').classList.remove('show-cart'))

    const $modalCart = document.querySelector('.modal-cart')
    $modalCart.addEventListener("click", (event) => event.stopPropagation())
    cart.forEach(coffee => {
      
      const $product = document.createElement('div')

      $product.classList.add('cart-item')

      $product.innerHTML = `
                          <img src=${coffee.image_url} alt="${coffee.name} image">
                          <div style="display: flex; flex-direction: column; justify-content: center; flex-basis: 170px;">
                            <h3 style="color: rgb(0 0 0 / 60%); margin-bottom: 8px">${coffee.name}</h3>
                            <div style="display: flex;">
                              <button style="padding: 4px 8px; border-radius: 6px 0 0 6px; cursor: pointer;">-</button>
                              <p style="padding: 4px 8px; border-top: 2px solid #000; border-bottom: 2px solid #000;">${coffee.stock}</p>
                              <button style="padding: 4px 8px; border-radius: 0 6px 6px 0; cursor: pointer;">+</button>
                            </div>
                          </div>
                          <p style="flex: 1; font-weight: bold; text-align: center;">${(coffee.price * coffee.stock).toLocaleString('es-AR', { style: 'currency', currency: 'ARS'})}</p>
                          <svg style="flex: 1; cursor: pointer;" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
      `

      $modalCart.appendChild($product)
    })
  }
}

// NAV Events

// MOBILE MENU OPEN EVENT
const $menuButton = document.getElementById('mobile-menu-button')

$menuButton.addEventListener('click', () => {
  const navUlClass = $menuButton.nextElementSibling.classList
  navUlClass.contains('hide') ? navUlClass.remove('hide') : navUlClass.add('hide')
})

const $mobileMenuItems = document.querySelectorAll('#mobile-menu-list > li > a')

$mobileMenuItems.forEach(element => element.addEventListener("click", () => $menuButton.nextElementSibling.classList.add('hide')))

// CART MODAL OPEN EVENT
const $cartButton = document.querySelectorAll('.cart-icon')

$cartButton.forEach(button => button.addEventListener("click", () => {
  const $cart = document.getElementById('cart')

  $cart.classList.add('show-cart')

  $cart.addEventListener("click", () => $cart.classList.remove('show-cart'))
}))