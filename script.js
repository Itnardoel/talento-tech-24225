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

async function getCoffee() {

  try {
    const response = await fetch("https://fake-coffee-api.vercel.app/api")

    if (!response.ok) {
      throw new Error (`HTTP error! Status: ${response.status}`)
    }
    const products = await response.json()
  
    const $divProductos = document.querySelector('.productos')
  
    products.forEach(({id, name, description, price, image_url}) => {
      $divProductos.innerHTML += `
                <div class="producto">
                  <img src=${image_url} alt="${name} image">
                  <h2>${name}</h2>
                  <h3>${description}</h3>
                  <p>${price.toLocaleString('es-AR', { style: "currency", currency: 'ARS'})}</p>
                  <button onClick="addToCart(${id})">Agregar al carrito</button>
                </div>
      `
    }) 

    // getCart()
  } catch (error) {
    console.error("Error en la comunicación con la API:", error)
  }
}

document.addEventListener('DOMContentLoaded', getCoffee())

function getCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || []

  const cartCounter = document.getElementById('cart-counter')

  cartCounter.textContent = cart.length
}

function addToCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || []

  cart.push(id);

  localStorage.setItem("cart", JSON.stringify(cart))

  console.log("Producto añadido al carrito")
  
  // getCart()
}