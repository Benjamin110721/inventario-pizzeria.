// ===============================
// DATOS
// ===============================
let inventario = JSON.parse(localStorage.getItem("inventario")) || [];
let ventas = JSON.parse(localStorage.getItem("ventas")) || [];

// 🔹 RECETAS CORREGIDAS
const recetas = {
  jamon: [
    { producto: "Harina", cantidad: 0.2, unidad: "kg" },
    { producto: "Queso", cantidad: 0.15, unidad: "kg" },
    { producto: "Salsa", cantidad: 150, unidad: "ml" }
  ],
  extravagante: [
    { producto: "Harina", cantidad: 0.2, unidad: "kg" },
    { producto: "Queso", cantidad: 0.2, unidad: "kg" },
    { producto: "Salsa", cantidad: 200, unidad: "ml" }
  ],
  hawaiana: [
    { producto: "Harina", cantidad: 0.2, unidad: "kg" },
    { producto: "Queso", cantidad: 0.15, unidad: "kg" },
    { producto: "Salsa", cantidad: 150, unidad: "ml" }
  ],
  caseraespecial: [
    { producto: "Harina", cantidad: 0.25, unidad: "kg" },
    { producto: "Queso", cantidad: 0.2, unidad: "kg" },
    { producto: "Salsa", cantidad: 180, unidad: "ml" }
  ]
};

// ===============================
// EVENTOS
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  btnAgregar.onclick = agregarProducto;
  btnVender.onclick = venderPizza;
  btnReporte.onclick = generarReporte;
  buscar.onkeyup = mostrarInventario;
  mostrarInventario();
});

// ===============================
// FUNCIONES
// ===============================
function guardarInventario() {
  localStorage.setItem("inventario", JSON.stringify(inventario));
}

function agregarProducto() {
  const producto = productoInput.value.trim();
  const cantidad = parseFloat(cantidadInput.value);
  const categoria = categoriaInput.value.trim();
  const unidad = unidadSelect.value;

  if (!producto || !cantidad || !categoria) {
    alert("Completa todos los campos");
    return;
  }

  inventario.push({ producto, cantidad, categoria, unidad });
  guardarInventario();
  mostrarInventario();
}

function mostrarInventario() {
  lista.innerHTML = "";
  const texto = buscar.value.toLowerCase();

  inventario
    .filter(i => i.producto.toLowerCase().includes(texto))
    .forEach((item, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${item.producto} | ${item.cantidad} ${item.unidad} | ${item.categoria}
        <button onclick="eliminarProducto(${index})">🗑</button>
      `;
      lista.appendChild(li);
    });
}

function eliminarProducto(index) {
  if (!confirm("¿Eliminar producto?")) return;
  inventario.splice(index, 1);
  guardarInventario();
  mostrarInventario();
}

function venderPizza() {
  const tipo = tipoPizza.value;
  const receta = recetas[tipo];

  if (!receta) {
    alert("Receta no encontrada");
    return;
  }

  for (let r of receta) {
    const prod = inventario.find(
      i => i.producto === r.producto && i.unidad === r.unidad
    );
    if (!prod || prod.cantidad < r.cantidad) {
      mensaje.textContent = "❌ Ingredientes insuficientes";
      return;
    }
  }

  receta.forEach(r => {
    const prod = inventario.find(
      i => i.producto === r.producto && i.unidad === r.unidad
    );
    prod.cantidad -= r.cantidad;
  });

  ventas.push({
    pizza: tipo,
    fecha: new Date().toLocaleString()
  });

  localStorage.setItem("ventas", JSON.stringify(ventas));
  guardarInventario();
  mostrarInventario();
  mensaje.textContent = "✅ Pizza vendida";
}

function generarReporte() {
  reporte.innerHTML = "";
  inventario.forEach(i => {
    const li = document.createElement("li");
    li.textContent =
      i.cantidad < 1
        ? `⚠ ${i.producto} bajo stock`
        : `${i.producto}: ${i.cantidad} ${i.unidad}`;
    reporte.appendChild(li);
  });
}

// ===============================
// ATAJOS INPUTS
// ===============================
const productoInput = document.getElementById("producto");
const cantidadInput = document.getElementById("cantidad");
const categoriaInput = document.getElementById("categoria");
const unidadSelect = document.getElementById("unidad");
const lista = document.getElementById("lista");
const buscar = document.getElementById("buscar");
const mensaje = document.getElementById("mensaje");
const reporte = document.getElementById("reporte");
const btnAgregar = document.getElementById("btnAgregar");
const btnVender = document.getElementById("btnVender");
const btnReporte = document.getElementById("btnReporte");
const tipoPizza = document.getElementById("tipoPizza");

