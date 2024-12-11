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
                          <svg id="close-button" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                          <img src=${coffee.image_url} alt="${coffee.name} image">
                          <h2>${coffee.name}</h2>
                          <h3>${coffee.description}</h3>
                          <p>${coffee.price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS'})}</p>
                          <button>Agregar al carrito</button>
      `
        $modal.addEventListener('click', () => $modal.classList.remove('show-modal'))

        const $closeButton = document.getElementById('close-button')
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

  const cartCounter = document.getElementById('cart-counter')

  if (cart.length > 0) {
    let totalCount = 0

    cart.forEach(({stock}) => totalCount += stock)

    cartCounter.textContent = totalCount
  }
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

// NAV Events

const $menuButton = document.getElementById('mobile-menu-button')

$menuButton.addEventListener('click', () => {
  if ($menuButton.nextElementSibling.classList.contains('hide')) {
    $menuButton.nextElementSibling.classList.remove('hide')
  } else {
    $menuButton.nextElementSibling.classList.add('hide')
  }
})

const $mobileMenu = document.getElementById('mobile-menu-list')

// $mobileMenu. // TODO OCULTAR EL MENU AL TOCAR CUALQUIER ITEM