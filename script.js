let inventario = JSON.parse(localStorage.getItem("inventario")) || [];

const recetas = {
  margarita: {
    Harina: 200,
    Queso: 150,
    Salsa: 100
  }
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btnAgregar").addEventListener("click", agregarProducto);
  document.getElementById("btnVender").addEventListener("click", venderPizza);
  document.getElementById("btnReporte").addEventListener("click", generarReporte);
  document.getElementById("buscar").addEventListener("keyup", mostrarInventario);

  mostrarInventario();
});

function agregarProducto() {
  const producto = document.getElementById("producto").value.trim();
  const cantidad = parseInt(document.getElementById("cantidad").value);
  const categoria = document.getElementById("categoria").value.trim();

  if (!producto || !cantidad || !categoria) {
    alert("Completa todos los campos");
    return;
  }

  inventario.push({ producto, cantidad, categoria });
  localStorage.setItem("inventario", JSON.stringify(inventario));

  document.getElementById("producto").value = "";
  document.getElementById("cantidad").value = "";
  document.getElementById("categoria").value = "";

  mostrarInventario();
}

function mostrarInventario() {
  const lista = document.getElementById("lista");
  const buscar = document.getElementById("buscar").value.toLowerCase();

  lista.innerHTML = "";

  inventario
    .filter(item => item.producto.toLowerCase().includes(buscar))
    .forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.producto} | ${item.cantidad} | ${item.categoria}`;
      lista.appendChild(li);
    });
}

function venderPizza() {
  const receta = recetas["margarita"];

  for (let ing in receta) {
    const item = inventario.find(i => i.producto === ing);
    if (!item || item.cantidad < receta[ing]) {
      document.getElementById("mensaje").textContent =
        "❌ Ingredientes insuficientes";
      return;
    }
  }

  for (let ing in receta) {
    const item = inventario.find(i => i.producto === ing);
    item.cantidad -= receta[ing];
  }

  localStorage.setItem("inventario", JSON.stringify(inventario));
  mostrarInventario();

  document.getElementById("mensaje").textContent =
    "✅ Pizza vendida correctamente";
}

function generarReporte() {
  const reporte = document.getElementById("reporte");
  reporte.innerHTML = "";

  inventario.forEach(item => {
    const li = document.createElement("li");
    li.textContent =
      item.cantidad < 500
        ? `⚠ ${item.producto} bajo stock (${item.cantidad})`
        : `${item.producto}: ${item.cantidad}`;
    reporte.appendChild(li);
  });
}
