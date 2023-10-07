// Array de productos en la tienda por defecto
let productosPorDefecto = [
  {
    id: 1,
    nombre: "Laptop HP",
    precio: 799.99,
    descripcion: "Portátil de alta gama con pantalla HD y procesador rápido.",
    stock: 20,
    habilitado: 1,
  },
  {
    id: 2,
    nombre: "Teléfono Samsung Galaxy",
    precio: 499.0,
    descripcion:
      "Smartphone Android con cámara de alta resolución y pantalla AMOLED.",
    stock: 15,
    habilitado: 1,
  },
  {
    id: 3,
    nombre: "Smart TV LG",
    precio: 599.99,
    descripcion:
      "Televisor inteligente con pantalla 4K y aplicaciones integradas.",
    stock: 10,
    habilitado: 1,
  },
  {
    id: 4,
    nombre: "Cámara Canon EOS",
    precio: 899.0,
    descripcion:
      "Cámara DSLR con lente intercambiable y grabación de video en Full HD.",
    stock: 8,
    habilitado: 1,
  },
  {
    id: 5,
    nombre: "Auriculares Sony",
    precio: 149.99,
    descripcion:
      "Auriculares inalámbricos con cancelación de ruido y sonido de alta calidad.",
    stock: 25,
    habilitado: 1,
  },
  {
    id: 6,
    nombre: "Tableta Samsung Galaxy Tab",
    precio: 299.99,
    descripcion:
      "Tableta Android con pantalla táctil y batería de larga duración.",
    stock: 12,
    habilitado: 1,
  },
  {
    id: 7,
    nombre: "Refrigeradora Whirlpool",
    precio: 899.0,
    descripcion:
      "Refrigeradora de acero inoxidable con dispensador de agua y hielo.",
    stock: 6,
    habilitado: 1,
  },
  {
    id: 8,
    nombre: "Impresora Epson",
    precio: 129.95,
    descripcion:
      "Impresora láser a color con conectividad Wi-Fi y escaneo rápido.",
    stock: 18,
    habilitado: 1,
  },
  {
    id: 9,
    nombre: "Consola de Juegos Xbox",
    precio: 399.99,
    descripcion:
      "Consola de juegos con capacidad 4K y amplia biblioteca de juegos.",
    stock: 14,
    habilitado: 1,
  },
  {
    id: 10,
    nombre: "Bicicleta de Montaña",
    precio: 499.0,
    descripcion:
      "Bicicleta todoterreno con cuadro de aluminio y suspensiones delanteras.",
    stock: 9,
    habilitado: 1,
  },
];

//array de productos en carrito
let carrito = [];
//array de productos en tienda
let productos= [];
//variables de forms
let formularioVisible = false;
let carritoVisible = false;
//variables DOM
const tbody = document.getElementById("bodyTable");
const mostrarFormularioBtn = document.getElementById("mostrarFormulario");
const formularioContainer = document.getElementById("formulario");
const mostrarTablaCarritoBtn = document.getElementById("mostrarFormCarrito");
const divTablaCarrito = document.getElementById("carrito");
const numeroCarrito = document.getElementById("numeroCarrito");
const buscador = document.getElementById("buscar");
const btnporcentaje = document.getElementById("btnporcentaje");
const inputporcentaje = document.getElementById("inputporcentaje");
const precioMinimo = document.getElementById("precioMinimo");
const precioMaximo = document.getElementById("precioMaximo");
const btnprecio = document.getElementById("btnprecio");
const tbodycart = document.getElementById("bodyTablecart");

const formAgregarProducto = `
    <form class="container py-3 pb-5" onsubmit="agregarProductosATienda(event)">
      <div class="mb-3">
        <label for="nombre" class="form-label">Nombre:</label>
        <input type="text" id="nombre" name="nombre" class="form-control">
      </div>
      <div class="mb-3">
        <label for="precio" class="form-label">Precio:</label>
        <input type="number" step="0.01" id="precio" name="precio" class="form-control">
      </div>
      <div class="mb-3">
        <label for="stock" class="form-label">Stock:</label>
        <input type="number" id="stock" name="stock" class="form-control">
      </div>
      <div class="mb-3">
        <label for="descripcion" class="form-label">Descripcion:</label>
        <textarea id="descripcion" name="descripcion" class="form-control" rows="4"></textarea>
      </div>
      <div>
        <button type="submit" class="btn btn-primary align-right">Crear</button>
      </div>
    </form>
`;

//eventos
window.addEventListener("load", () => {
  productos = cargarProductosDesdeLocalStorage();
  cargarCarritoDesdeLocalStorage();
  actualizarCarrito()
  agregarProductosAlDOM(productos);
});
buscador.addEventListener("input", () => {
  filtrarProductos(buscador.value, precioMinimo.value, precioMaximo.value);
});
btnporcentaje.addEventListener("click", () => {
  aplicarPorcentaje(inputporcentaje.value);
});
btnprecio.addEventListener("click", () => {
  filtrarProductos(buscador.value, precioMinimo.value, precioMaximo.value);
});
mostrarTablaCarritoBtn.addEventListener("click", () => {
  if (carritoVisible) {
    divTablaCarrito.innerHTML = "";
    divTablaCarrito.style.display = "none";
    carritoVisible = false;
  } else if (carrito.length > 0) {
    cargarProductosEnCarrito();
    carritoVisible = true;
    const divTablaCarritoContainer =
      divTablaCarrito.querySelector("#tableCart");
    divTablaCarritoContainer.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  } else {
    divTablaCarrito.innerHTML =
      '<h5 class="text-center pt-1">No hay productos en el carrito</h5>';
    divTablaCarrito.style.display = "block";
    carritoVisible = true;
    const mensajeNoProductos = divTablaCarrito.querySelector("h5");
    mensajeNoProductos.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }
});
window.addEventListener("click", (e) => {
  if (
    !mostrarTablaCarritoBtn.contains(e.target) &&
    e.target !== divTablaCarrito
  ) {
    cerrarFormCarrito();
  }
});
mostrarFormularioBtn.addEventListener("click", () => {
  if (formularioVisible) {
    formularioContainer.innerHTML = "";
    formularioContainer.style.display = "none";
    formularioVisible = false;
  } else {
    formularioContainer.innerHTML = formAgregarProducto;
    formularioContainer.style.display = "block";
    formularioVisible = true;
    const formElement = formularioContainer.querySelector("form");
    formElement.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }
});
window.addEventListener("click", (e) => {
  if (
    !mostrarFormularioBtn.contains(e.target) &&
    e.target !== formularioContainer
  ) {
    cerrarFormProducto();
  }
});

// Función para agregar productos al DOM
function agregarProductosAlDOM(arrayProductos) {
  console.log(arrayProductos)
  arrayProductos.forEach((producto) => {
    if (producto.habilitado === 1) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${producto.nombre}</td>
        <td>$${producto.precio}</td>
        <td>${producto.descripcion}</td>
        <td>${producto.stock}</td>
        <td>
          <button class="btn btn-primary" onclick="agregarProductosACarrito(${producto.id})">
            <i class="bi bi-plus-circle"></i>
          </button>
          <button class="btn btn-danger" onclick="eliminarProducto(${producto.id})">
            <i class="bi bi-trash"></i>
          </button>
        </td>
        `;
      tbody.appendChild(row);
    }
  });
}
//funcion para vaciar la tabla
function vaciarTabla() {
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
}
//funcion para vaciar el carrito
function vaciarCarrito() {
  while (tbodycart?.firstChild) {
    tbodycart.removeChild(tbodycart.firstChild);
  }
}
//funcion para agregar productos al carrito
function agregarProductosACarrito(productoId, event) {
  console.log(productos,carrito)
  const productoEncontrado = productos.find(
    (producto) => producto.id === productoId
  );
  productoEncontrado.stock--;
  if (productoEncontrado.stock === 0) {
    eliminarProducto(productoId);
  }
  const productoExistente = carrito.find(
    (producto) => producto.id === productoEncontrado.id
  );
  if (productoExistente) {
    productoExistente.cantidad++;
    productoExistente.total =
      productoExistente.cantidad * productoExistente.precio;
  } else {
    const nuevoProducto = {
      id: productoEncontrado.id,
      nombre: productoEncontrado.nombre,
      precio: productoEncontrado.precio,
      cantidad: 1,
      total: productoEncontrado.precio,
    };
    carrito.push(nuevoProducto);
  }
  mostrarToast("Producto agregado al carrito");
  actualizarTabla();
  cantidadEnCarrito(carrito.length);
  actualizarCarrito();
  event?.stopPropagation();
}
//funcion para quitar productos del carrito
function quitarProductosACarrito(productoId, event) {
  const productoEncontrado = productos.find(
    (producto) => producto.id === productoId
  );
  if (productoEncontrado.stock === 0) {
    productoEncontrado.habilitado = 1;
  }
  productoEncontrado.stock = productoEncontrado.stock + 1;

  const productoExistente = carrito.find(
    (producto) => producto.id === productoEncontrado.id
  );
  if (productoExistente) {
    productoExistente.cantidad--;
    productoExistente.total =
      productoExistente.cantidad * productoExistente.precio;
    if (productoExistente.cantidad === 0) {
      carrito = carrito.filter(
        (producto) => producto.id !== productoExistente.id
      );
    }
  }
  mostrarToast("Producto eliminado de carrito");
  actualizarTabla();
  actualizarCarrito();
  event?.stopPropagation();
}
//funcion para eliminar productos
function eliminarProducto(productoId) {
  productoExistente = productos.find((producto) => producto.id === productoId);
  productoExistente.habilitado = 0;
  actualizarTabla();
  mostrarToast("Producto eliminado");
}
//funcion para actualizar el carrito
function actualizarCarrito() {
  vaciarCarrito();
  cargarProductosEnCarrito();
  cantidadEnCarrito(carrito.length);
  guardarCarritoLocal(carrito)
}
//funcion para eliminar un producto completo del carrito
function eliminarProductoDeCarrito(productoId, event) {
  productoExistente = productos.find((producto) => producto.id === productoId);
  productoCart = carrito.find((producto) => producto.id === productoId);
  productoExistente.habilitado = 1;
  productoExistente.stock = productoCart.cantidad + productoExistente.stock;
  carrito = carrito.filter((producto) => producto.id !== productoCart.id);
  actualizarTabla();
  actualizarCarrito();
  event?.stopPropagation();
  mostrarToast("Producto eliminado del carrito");
}
//funcion para filtrar tabla de productos
function filtrarProductos(filtro, Min, Max) {
  let productosfiltrados = [];
  if (Max === "") {
    const precios = productos.map((producto) => producto.precio);
    Max = Math.max(...precios);
  }
  if (Min === "") {
    Min = 0;
  }

  productosfiltrados = productos.filter(
    (producto) =>
      producto.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      producto.descripcion.toLowerCase().includes(filtro.toLowerCase())
  );
  productosfiltrados = productosfiltrados.filter(
    (producto) =>
      producto.precio >= Number(Min) && producto.precio <= Number(Max)
  );
  guardarProductosLocal(productosfiltrados);
  vaciarTabla();
  agregarProductosAlDOM(productosfiltrados);
}
//funcion para aplicar porcentaje a los productos
function aplicarPorcentaje(porcentaje) {
  productos = productos.map((producto) => {
    const precioNuevo = (producto.precio * (1 + porcentaje / 100)).toFixed(2);
    return { ...producto, precio: precioNuevo };
  });

  actualizarTabla();
  mostrarToast("Porcentaje aplicado");
}
//funcion para actualizar la tabla
function actualizarTabla() {
  filtrarProductos(buscador.value, precioMinimo.value, precioMaximo.value);
}
//funcion para mostrar un toast personalizado
function mostrarToast(mensaje) {
  var toast = document.createElement("div");
  toast.className = "toast align-items-center text-white bg-success border-0";
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");

  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ${mensaje}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  document.body.appendChild(toast);

  var toastElement = new bootstrap.Toast(toast);
  toastElement.show();
}
//funcion para borrar el carrito
function borrarCarrito(mensaje, event) {
  carrito.forEach(producto => {
    eliminarProductoDeCarrito(producto.id,event)
  })
  mostrarToast("carrito vaciado")
}
//funcion para cargar los productos en el carrito
function cargarProductosEnCarrito() {
  let tablaCarrito =
    '<table class="table" id="tableCart">' +
    "<thead>" +
    "<tr>" +
    '<th scope="col">Nombre</th>' +
    '<th scope="col">Precio</th>' +
    '<th scope="col">Cantidad</th>' +
    '<th scope="col">Total</th>' +
    '<th scope="col">Acciones</th>' +
    "</tr>" +
    "</thead>" +
    '<tbody id="bodyTablecart">';

  carrito.forEach((producto) => {
    tablaCarrito += `<tr>
        <td>${producto.nombre}</td>
        <td>${Number(producto.precio).toFixed(2)}</td>
        <td>${producto.cantidad}</td>
        <td>${Number(producto.precio * producto.cantidad).toFixed(2)}</td>
        <td>
        <button class="btn btn-primary" data-product-id="${
          producto.id
        }" onclick="quitarProductosACarrito(${producto.id},event)">
            <i class="bi bi-dash-circle"></i>
          </button>
          <button class="btn btn-primary" data-product-id="${
            producto.id
          }" onclick="agregarProductosACarrito(${producto.id},event)">
            <i class="bi bi-plus-circle"></i>
          </button>
          <button class="btn btn-danger" data-product-id="${
            producto.id
          }" onclick="eliminarProductoDeCarrito(${producto.id},event)">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>`;
  });

  tablaCarrito += `</tbody></table>
    <h4 class="text-end">Total: ${Number(totalCarrito()).toFixed(2)}</h4>
    <div class="d-flex justify-content-between"> <!-- Envuelve los botones en un div con clases de alineación -->
      <button class="btn btn-danger float-start" onclick="borrarCarrito(event)">Vaciar carrito</button>
      <button class="btn btn-success float-end" onclick="finalizarCompra()">Finalizar compra</button>
    </div>`;

  divTablaCarrito.innerHTML = tablaCarrito;
  divTablaCarrito.style.display = "block";
}
//funcion para calcular el total del carrito
function totalCarrito() {
  let total = 0;
  for (const producto of carrito) {
    total += producto.total;
  }
  return total.toFixed(2);
}
//funcion para actualizar el numero de productos en el carrito
function cantidadEnCarrito(nuevaCantidad) {
  if (nuevaCantidad >= 0) {
    numeroCarrito.style.display = "inline-block";
    numeroCarrito.textContent = nuevaCantidad;
  } else {
    numeroCarrito.style.display = "none";
  }
}
//esta funcion agrega un producto nuevo al array de productos
function agregarProductosATienda(event) {
  event.preventDefault();
  const nombre = document.getElementById("nombre").value;
  const precio = document.getElementById("precio").value;
  const stock = document.getElementById("stock").value;
  const descripcion = document.getElementById("descripcion").value;

  productos.push({
    id: productos.length + 1,
    nombre: nombre,
    precio: Number(precio),
    stock: Number(stock),
    descripcion: descripcion,
    habilitado: 1
  });

  actualizarTabla();
  cerrarFormProducto();
  mostrarToast("Producto agregado");
}
//funcion para cerrar el formulario de productos
function cerrarFormProducto() {
  formularioContainer.innerHTML = "";
  formularioContainer.style.display = "none";
  formularioVisible = false;
}
//funcion para cerrar el formulario de carrito
function cerrarFormCarrito() {
  divTablaCarrito.innerHTML = "";
  divTablaCarrito.style.display = "none";
  carritoVisible = false;
}
//funcion para finalizar la compra
function finalizarCompra(){
  carrito = [];
  actualizarCarrito();
  mostrarToast("Compra realizada")
}
//funcion para guardar el contenido de carrito en el local storage
function guardarCarritoLocal(carrito) {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}
//funcion para guardar el contenido de productos en el local storage
function guardarProductosLocal(productos) {
  localStorage.setItem('productos', JSON.stringify(productos));
}
//funcion para cargar el contenido de productos desde el local storage
function cargarProductosDesdeLocalStorage() {
  const productosGuardados = localStorage.getItem('productos');
  if (productosGuardados) {
    return JSON.parse(productosGuardados);
  } else {
    localStorage.setItem('productos', JSON.stringify(productosPorDefecto));
    return productosPorDefecto;
  }
}
function cargarCarritoDesdeLocalStorage() {
  const carritoGuardado = localStorage.getItem('carrito');
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
  }
}

