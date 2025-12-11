function recortarDescripcion(texto, max = 160) {
  if (!texto) return "";
  if (texto.length <= max) return texto;
  return texto.substring(0, texto.lastIndexOf(" ", max)) + "...";
}

function formatearNumero(numero) {
  return new Intl.NumberFormat('es-CL').format(numero);
}
function crearCarruselHTML(imagenes, propiedadId) {
  if (!imagenes || imagenes.length === 0) {
    return `<div class="property-image-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>`;
  }

 const imagenesOrdenadas = [...imagenes].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));

  return `
    <div class="carousel-container" id="carousel-${propiedadId}">
      <div class="carousel-images">
        ${imagenesOrdenadas.map((img, index) => `
          <img 
            src="${img.url}" 
            alt="Imagen ${index + 1}"
            class="carousel-image ${index === 0 ? 'active' : ''}"
            loading="lazy"
          />
        `).join('')}
      </div>
      
      ${imagenes.length > 1 ? `
        <button class="carousel-btn carousel-prev" onclick="cambiarImagen('${propiedadId}', -1)">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button class="carousel-btn carousel-next" onclick="cambiarImagen('${propiedadId}', 1)">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        <div class="carousel-indicators">
          ${imagenesOrdenadas.map((_, index) => `
            <span class="indicator ${index === 0 ? 'active' : ''}" onclick="irAImagen('${propiedadId}', ${index})"></span>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

function cambiarImagen(propiedadId, direccion) {
  const carousel = document.getElementById(`carousel-${propiedadId}`);
  const imagenes = carousel.querySelectorAll('.carousel-image');
  const indicators = carousel.querySelectorAll('.indicator');

  let indexActual = Array.from(imagenes).findIndex(img => img.classList.contains('active'));
  let nuevoIndex = indexActual + direccion;

  if (nuevoIndex >= imagenes.length) nuevoIndex = 0;
  if (nuevoIndex < 0) nuevoIndex = imagenes.length - 1;

  imagenes[indexActual].classList.remove('active');
  imagenes[nuevoIndex].classList.add('active');

  if (indicators.length > 0) {
    indicators[indexActual].classList.remove('active');
    indicators[nuevoIndex].classList.add('active');
  }
}

function irAImagen(propiedadId, index) {
  const carousel = document.getElementById(`carousel-${propiedadId}`);
  const imagenes = carousel.querySelectorAll('.carousel-image');
  const indicators = carousel.querySelectorAll('.indicator');

  const indexActual = Array.from(imagenes).findIndex(img => img.classList.contains('active'));

  imagenes[indexActual].classList.remove('active');
  imagenes[index].classList.add('active');

  if (indicators.length > 0) {
    indicators[indexActual].classList.remove('active');
    indicators[index].classList.add('active');
  }
}

   //TARJETA DE PROPIEDAD 
function crearTarjetaPropiedad(propiedad) {
  return `
    <article 
      class="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300" 
      data-property 
      data-location="${(propiedad.ubicacion || '').toLowerCase()}"
      data-type="${propiedad.tipo}"
      data-price="${propiedad.precio_clp}"
    >
      ${crearCarruselHTML(propiedad.imagenes, propiedad.id)}
      
      <div class="p-4 md:p-5">
        ${propiedad.destacado ? '<span class="inline-block px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium mb-2">Destacado</span>' : ''}
        
        <h3 class="font-semibold text-base md:text-lg mb-2 text-slate-800">${propiedad.titulo}</h3>
        
        <p class="text-xs text-slate-500 mb-3 flex items-start gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          ${propiedad.ubicacion}, ${propiedad.region || 'Chile'}
        </p>

        <div class="flex items-center gap-3 mb-3 text-xs text-slate-600">
          ${propiedad.habitaciones ? `
            <span class="flex items-center gap-1">
              ${propiedad.habitaciones} dorm.
            </span>` : ''}

          ${propiedad.banos ? `
            <span class="flex items-center gap-1">
              ${propiedad.banos} baño${propiedad.banos > 1 ? 's' : ''}
            </span>` : ''}

          ${propiedad.metros_cuadrados ? `
            <span class="flex items-center gap-1">
              ${propiedad.metros_cuadrados} m²
            </span>` : ''}
        </div>
        
      <div class="descripcion-container mb-3">
  <p 
    class="text-[0.80rem] text-slate-600 leading-relaxed descripcion-texto descripcion-clamp"
    data-descripcion-completa="${propiedad.descripcion.replace(/"/g, '&quot;')}"
  >
    ${recortarDescripcion(propiedad.descripcion)}
  </p>

  <button 
    class="text-primary text-[0.75rem] font-medium mt-1 ver-mas-btn hover:underline"
  >
    Ver más
  </button>
</div>
        <!-- PRECIO EN PESOS CHILENOS -->
        <div class="border-t border-slate-100 pt-3 mb-3">
          <p class="text-lg md:text-xl font-bold text-primary">
            $${formatearNumero(propiedad.precio_clp)}
          </p>
        </div>

        <div class="flex gap-2">
          <a href="#contacto" 
            class="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-primary text-white text-xs font-medium hover:bg-primary/90 transition">
            Contactar
          </a>
        </div>
      </div>
    </article>
  `;
}
function recortarDescripcion(texto, max = 160) {
  if (!texto) return "";
  if (texto.length <= max) return texto;

  const corte = texto.lastIndexOf(" ", max);
  return texto.substring(0, corte > 0 ? corte : max) + "...";
}



   //CARGAR PROPIEDADES

async function cargarPropiedades() {
  const container = document.getElementById('propertiesGrid');

  if (!container) {
    console.error('Contenedor de propiedades no encontrado');
    return;
  }

  try {
    container.innerHTML = `
      <div class="col-span-full flex justify-center items-center py-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p class="text-sm text-slate-500">Cargando propiedades...</p>
        </div>
      </div>
    `;

    const snapshot = await db.collection('propiedades')
      .orderBy('destacado', 'desc')
      .orderBy('fecha_creacion', 'desc')
      .get();

    if (snapshot.empty) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12">
          <p class="text-slate-500">No hay propiedades disponibles</p>
        </div>
      `;
      return;
    }
const propiedades = snapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data()
}));

// Limitar a 6 visibles
let propiedadesHTML = '';
propiedades.forEach((prop, index) => {
  if (index < 6) {
    propiedadesHTML += crearTarjetaPropiedad(prop);
  } else {
    propiedadesHTML += `
      <div class="propiedad-oculta hidden">
        ${crearTarjetaPropiedad(prop)}
      </div>
    `;
  }
});

container.innerHTML = propiedadesHTML;

// Agregar botón "Ver más"
if (propiedades.length > 6) {
  container.insertAdjacentHTML('afterend', `
    <div class="text-center mt-6">
      <button id="btnVerMas" 
        class="px-6 py-3 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition">
          Ver más propiedades
      </button>
    </div>
  `);

  // Lógica del botón
  document.getElementById("btnVerMas").addEventListener("click", function() {
    document.querySelectorAll(".propiedad-oculta").forEach(div => {
      div.classList.remove("hidden");
    });
    this.style.display = "none"; 
  });
}


  } catch (error) {
    console.error('Error al cargar propiedades:', error);
    container.innerHTML = `
      <div class="col-span-full text-center py-12">
        <p class="text-red-500 mb-2">Error al cargar las propiedades</p>
        <button onclick="cargarPropiedades()" class="text-sm text-primary hover:underline">
          Intentar nuevamente
        </button>
      </div>
    `;
  }
}

   //EVENTOS

document.addEventListener('DOMContentLoaded', () => {
  cargarPropiedades();
});

window.cambiarImagen = cambiarImagen;
window.irAImagen = irAImagen;
window.cargarPropiedades = cargarPropiedades;
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("ver-mas-btn")) {

    const btn = e.target;
    const container = btn.parentElement;
    const texto = container.querySelector(".descripcion-texto");
    const descripcionCompleta = texto.getAttribute("data-descripcion-completa");

    if (texto.classList.contains("expanded")) {
      // Contraer
      texto.classList.remove("expanded");
      texto.classList.add("descripcion-clamp");
      texto.textContent = recortarDescripcion(descripcionCompleta);
      btn.textContent = "Ver más";
    } else {
      // Expandir
      texto.classList.add("expanded");
      texto.classList.remove("descripcion-clamp");
      texto.textContent = descripcionCompleta;
      btn.textContent = "Ver menos";
    }
  }
});
