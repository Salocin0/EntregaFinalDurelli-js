//array de productos en carrito
let carrito = [];
//array de productos en tienda
let productos = [];
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
  actualizarCarrito();
  agregarProductosAlDOM(productos);
  divTablaCarrito.style.display = "none";
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
async function agregarProductosAlDOM(arrayProductosPromise) {
  try {
    const arrayProductos = await arrayProductosPromise;

    if (!Array.isArray(arrayProductos)) {
      console.error("arrayProductos is not an array:", arrayProductos);
      return;
    }

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
  } catch (error) {
    console.error("Error:", error);
  }
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
async function agregarProductosACarrito(productoId, event) {
  const productos = await cargarProductosDesdeLocalStorage();
  console.log(productos);
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
  guardarCarritoLocal(carrito);
}
//funcion para eliminar un producto completo del carrito
function eliminarProductoDeCarrito(productoId, event) {
  console.log(productos)
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
  Toastify({
    text: mensaje,
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "bottom",
    position: "right",
    stopOnFocus: true,
    style: {
      background:"#00b09b",
    },
  }).showToast();
}
//funcion para borrar el carrito
function borrarCarrito(mensaje, event) {
  carrito.forEach((producto) => {
    eliminarProductoDeCarrito(producto.id, event);
  });
  mostrarToast("carrito vaciado");
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
    habilitado: 1,
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
function finalizarCompra() {
  carrito = [];
  actualizarCarrito();
  mostrarToast("Compra realizada");
}
//funcion para guardar el contenido de carrito en el local storage
function guardarCarritoLocal(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}
//funcion para guardar el contenido de productos en el local storage
function guardarProductosLocal(productos) {
  localStorage.setItem("productos", JSON.stringify(productos));
}
//funcion para cargar el contenido de productos desde el local storage
async function cargarProductosDesdeLocalStorage() {
  const productosGuardados = localStorage.getItem("productos");
  if (productosGuardados) {
    productos = JSON.parse(productosGuardados);
    return productos
  } else {
    productos = await cargarProductosJson();
    localStorage.setItem("productos", JSON.stringify(productos));
    return productos;
  }
}
//funcion para cargar el contenido de carrito desde el local storage
function cargarCarritoDesdeLocalStorage() {
  const carritoGuardado = localStorage.getItem("carrito");
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
  }
}
//funcion para cargar el contenido de productos desde el json
async function cargarProductosJson() {
  return fetch('./js/productos.json')
    .then(response => {return response.json();
    }).catch(error => {
      console.error('Error:', error);
    });
}