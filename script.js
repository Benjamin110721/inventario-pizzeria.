let inventario = JSON.parse(localStorage.getItem("inventario")) || [];
let ventas = JSON.parse(localStorage.getItem("ventas")) || [];

const recetas = {
  Jamón: {
    Harina: 200,
    Queso: 150,
    Salsa: 100
  },
  Extravagante: {
    Harina: 250,
    Queso: 180,
    Salsa: 120
  },
  Hawaiana: {
    Harina: 200,
    Queso: 150,
    Salsa: 100
  },
  CaseraEspecial: {
    Harina: 220,
    Queso: 160,
    Salsa: 110
  }
};

inventario = inventario.map(item => {
  if (!item.unidad) item.unidad = "unidad";
  return item;
});
localStorage.setItem("inventario", JSON.stringify(inventario));

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btnAgregar")?.addEventListener("click", agregarProducto);
  document.getElementById("btnVender")?.addEventListener("click", venderPizza);
  document.getElementById("btnReporte")?.addEventListener("click", generarReporte);
  document.getElementById("buscar")?.addEventListener("keyup", mostrarInventario);

  mostrarInventario();
  mostrarInventarioPagina();
  mostrarVentasPagina();
});

function agregarProducto() {
  const producto = document.getElementById("producto").value.trim();
  const cantidad = parseFloat(document.getElementById("cantidad").value);
  const categoria = document.getElementById("categoria").value.trim();
  const unidad = document.getElementById("unidad")?.value || "unidad";

  if (!producto || !cantidad || !categoria) {
    alert("Completa todos los campos");
    return;
  }

  inventario.push({ producto, cantidad, categoria, unidad });
  localStorage.setItem("inventario", JSON.stringify(inventario));

  document.getElementById("producto").value = "";
  document.getElementById("cantidad").value = "";
  document.getElementById("categoria").value = "";

  mostrarInventario();
}

function mostrarInventario() {
  const lista = document.getElementById("lista");
  if (!lista) return;

  const buscar = document.getElementById("buscar").value.toLowerCase();
  lista.innerHTML = "";

  inventario
    .filter(item => item.producto.toLowerCase().includes(buscar))
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
  if (!confirm(`¿Eliminar ${inventario[index].producto}?`)) return;

  inventario.splice(index, 1);
  localStorage.setItem("inventario", JSON.stringify(inventario));
  mostrarInventario();
}

function venderPizza() {
  const tipoPizza = document.getElementById("tipoPizza")?.value;
  const receta = recetas[tipoPizza];

  if (!receta) {
    alert("Receta no encontrada");
    return;
  }

  // Validar ingredientes
  for (let ing in receta) {
    const item = inventario.find(i => i.producto === ing);
    if (!item || item.cantidad < receta[ing]) {
      alert("Ingredientes insuficientes");
      return;
    }
  }

  // Descontar ingredientes
  for (let ing in receta) {
    const item = inventario.find(i => i.producto === ing);
    item.cantidad -= receta[ing];
  }

  // Registrar venta
  ventas.push({
    pizza: tipoPizza,
    fecha: new Date().toLocaleString()
  });

  localStorage.setItem("inventario", JSON.stringify(inventario));
  localStorage.setItem("ventas", JSON.stringify(ventas));

  mostrarInventario();
  alert("✅ Pizza vendida correctamente");
}
function generarReporte() {
  const reporte = document.getElementById("reporte");
  if (!reporte) return;

  reporte.innerHTML = "";

  inventario.forEach(item => {
    const li = document.createElement("li");
    li.textContent =
      item.cantidad < 500
        ? `⚠ ${item.producto} bajo stock (${item.cantidad} ${item.unidad})`
        : `${item.producto}: ${item.cantidad} ${item.unidad}`;
    reporte.appendChild(li);
  });
}

function mostrarInventarioPagina() {
  const lista = document.getElementById("listaInventarioPagina");
  if (!lista) return;

  lista.innerHTML = "";
  inventario.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.producto} | ${item.cantidad} ${item.unidad} | ${item.categoria}`;
    lista.appendChild(li);
  });
}

function mostrarVentasPagina() {
  const lista = document.getElementById("listaVentasPagina");
  if (!lista) return;

  lista.innerHTML = "";
  ventas.forEach(v => {
    const li = document.createElement("li");
    li.textContent = `🍕 ${v.pizza} - ${v.fecha}`;
    lista.appendChild(li);
  });
}
