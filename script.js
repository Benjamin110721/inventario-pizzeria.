let inventario = JSON.parse(localStorage.getItem("inventario")) || [];

function agregarProducto() {
  let producto = document.getElementById("producto").value;
  let cantidad = document.getElementById("cantidad").value;
  let categoria = document.getElementById("categoria").value;

  if (producto === "" || cantidad === "" || categoria === "") {
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
  let lista = document.getElementById("lista");
  let buscar = document.getElementById("buscar").value.toLowerCase();

  lista.innerHTML = "";

  inventario
    .filter(item => item.producto.toLowerCase().includes(buscar))
    .forEach(item => {
      let li = document.createElement("li");
      li.textContent = `${item.producto} | Cantidad: ${item.cantidad} | Categoría: ${item.categoria}`;
      lista.appendChild(li);
    });
}

mostrarInventario();
const recetas = {
  margarita: {
    Harina: 200,
    Queso: 150,
    Salsa: 100
  }
};

function venderPizza() {
  let tipo = document.getElementById("tipoPizza").value;
  let receta = recetas[tipo];

  for (let ingrediente in receta) {
    let item = inventario.find(i => i.producto === ingrediente);
    if (!item || item.cantidad < receta[ingrediente]) {
      document.getElementById("mensaje").textContent =
        "❌ No hay suficientes ingredientes";
      return;
    }
  }

  for (let ingrediente in receta) {
    let item = inventario.find(i => i.producto === ingrediente);
    item.cantidad -= receta[ingrediente];
  }

  localStorage.setItem("inventario", JSON.stringify(inventario));
  mostrarInventario();

  document.getElementById("mensaje").textContent =
    "✅ Pizza vendida correctamente";
}
