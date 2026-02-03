let inventario = JSON.parse(localStorage.getItem("inventario")) || [];
const recetas = {
  jamon: {
    Harina: 200,
    Queso: 150,
    Salsa: 100
  },
  extravagante: {
    Harina: 250,
    Queso: 180,
    Salsa: 120
  },
  hawaiana: {
    Harina: 220,
    Queso: 160,
    Salsa: 110
  },
  caseraespecial: {
    Harina: 300,
    Queso: 200,
    Salsa: 150
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

  if (!producto || isNaN(cantidad) || !categoria) {
    alert("Completa todos los campos correctamente");
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

  inventario.forEach((item, index) => {
    if (!item.producto.toLowerCase().includes(buscar)) return;

    const li = document.createElement("li");
    li.innerHTML = `
      ${item.producto} | ${item.cantidad} | ${item.categoria}
      <button onclick="eliminarProducto(${index})">🗑</button>
    `;
    lista.appendChild(li);
  });
}
function eliminarProducto(index) {
  const confirmar = confirm(
    `¿Eliminar "${inventario[index].producto}" del inventario?`
  );

  if (!confirmar) return;

  inventario.splice(index, 1);
  localStorage.setItem("inventario", JSON.stringify(inventario));
  mostrarInventario();
}
function venderPizza() {
  const tipo = document.getElementById("tipoPizza").value;
  const receta = recetas[tipo];

  if (!receta) {
    alert("Receta no encontrada");
    return;
  }

  // Verificar ingredientes
  for (let ing in receta) {
    const item = inventario.find(i => i.producto === ing);
    if (!item || item.cantidad < receta[ing]) {
      document.getElementById("mensaje").textContent =
        "❌ Ingredientes insuficientes";
      return;
    }
  }

  // Descontar ingredientes
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
