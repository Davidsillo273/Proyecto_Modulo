const API_URL = 'https://685af76589952852c2d83324.mockapi.io/UShoes/shoes';
const IMG_API_URL = 'https://api.imgbb.com/1/upload?key=3a1084e9178ce1828378dfb94eca8f34';

const form = document.getElementById('producto-form');
const nombreEl = document.getElementById('nombre');
const precioEl = document.getElementById('precio');
const categoriaEl = document.getElementById('categoria');
const imagenFileEl = document.getElementById('imagen-file');
const imagenUrlEl = document.getElementById('imagen-url');
const idEl = document.getElementById('zapato-id'); // ← Asegurate que en el HTML se llame así
const cancelBtn = document.getElementById('btn-cancel');
const submitBtn = document.getElementById('btn-submit');
const tbody = document.getElementById('productos-tbody');
const searchBtn = document.querySelector('.search-btn');
const searchInput = document.querySelector('.search-box');
const btnSubir = document.getElementById('btnSubir');

async function CargarProductos() {
  const res = await fetch(API_URL);
  const data = await res.json();
  CargarTabla(data);
}

function CargarTabla(productos) {
  tbody.innerHTML = '';
  productos.forEach(producto => {
    tbody.innerHTML += `
      <tr>
        <td>${producto.nombre}</td>
        <td>$${parseFloat(producto.precio).toFixed(2)}</td>
        <td>${producto.categoria}</td>
        <td><img src="${producto.imagenes}" alt="Foto de producto" class="img-products" /></td>
        <td>
          <button onclick="CargarParaEditar('${producto.id}')" class="btn-accions">Editar</button>
          <button onclick="BorrarProducto('${producto.id}')" class="btn-accions">Eliminar</button>
        </td>
      </tr>
    `;
  });
}

async function BorrarProducto(id) {
  const confirmacion = confirm('¿Eliminar este producto?');
  if (confirmacion) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    CargarProductos();
    alert("El registro fue eliminado");
  } else {
    alert("Se canceló la acción");
  }
}

async function CargarParaEditar(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const p = await res.json();

  nombreEl.value = p.nombre;
  precioEl.value = p.precio;
  categoriaEl.value = p.categoria;
  imagenUrlEl.value = p.imagenes;
  imagenFileEl.value = '';
  idEl.value = p.id;

  submitBtn.textContent = 'Actualizar';
  cancelBtn.hidden = false;
}

cancelBtn.addEventListener('click', () => {
  form.reset();
  idEl.value = '';
  submitBtn.textContent = 'Agregar';
  cancelBtn.hidden = true;
});

async function subirImagen(file) {
  const fd = new FormData();
  fd.append('image', file);
  const res = await fetch(IMG_API_URL, { method: 'POST', body: fd });
  const obj = await res.json();
  return obj.data.url;
}

form.addEventListener('submit', async e => {
  e.preventDefault();

  let imageUrl = imagenUrlEl.value;

  if (imagenFileEl.files.length > 0) {
    imageUrl = await subirImagen(imagenFileEl.files[0]);
  }

  const payload = {
    nombre: nombreEl.value,
    precio: precioEl.value,
    categoria: categoriaEl.value,
    imagenes: imageUrl
  };

  if(!nombreEl.value || !precioEl.value || !categoriaEl.value || !imageUrl){
    alert("Los campos no estan completos");
    return;

  } else if(precioEl.value <= 0){
    alert("El precio es incorrecto, no se puede agregar un precio menor a $1");
    return;

  }else{
    if (idEl.value) {
      await fetch(`${API_URL}/${idEl.value}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      alert("Registro agregado");
    }
  }

  form.reset();
  idEl.value = '';
  submitBtn.textContent = 'Agregar';
  cancelBtn.hidden = true;
  CargarProductos();
});

// Buscar productos por nombre
searchBtn.addEventListener('click', buscarProductos);

async function buscarProductos() {
  const filtro = searchInput.value.toLowerCase();
  const res = await fetch(API_URL);
  const data = await res.json();

  const filtrado = data.filter(p => p.nombre.toLowerCase().includes(filtro));
  CargarTabla(filtrado);
}

window.addEventListener('scroll', () => {
  btnSubir.style.display = window.scrollY > 300 ? 'flex' : 'none';
});

btnSubir.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Carga inicial
window.addEventListener('DOMContentLoaded', CargarProductos);
