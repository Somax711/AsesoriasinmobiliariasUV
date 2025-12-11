// GESTION DE PANEL
let usuarioActual = null;
let propiedadEnEdicion = null;
let imagenesSeleccionadas = [];
let imagenesExistentes = [];

// LOGIN
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const loginBtn = document.getElementById('loginBtn');
  const errorDiv = document.getElementById('loginError');

  loginBtn.textContent = 'Iniciando sesión...';
  loginBtn.disabled = true;
  errorDiv.classList.add('hidden');

  try {
    await auth.signInWithEmailAndPassword(email, password);
    usuarioActual = auth.currentUser;

    await cargarDatosUsuario(usuarioActual);
    mostrarPanel();
    cargarPropiedadesUsuario();

  } catch (error) {
    console.error('Error en login:', error);
    errorDiv.classList.remove('hidden');
    errorDiv.querySelector('div').textContent = obtenerMensajeError(error.code);

    loginBtn.textContent = 'Iniciar Sesión';
    loginBtn.disabled = false;
    return;
  }

  loginBtn.textContent = 'Iniciar Sesión';
  loginBtn.disabled = false;
});

// LOGOUT
document.getElementById('logoutBtn').addEventListener('click', async () => {
  if (confirm('¿Seguro que deseas cerrar sesión?')) {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Error al cerrar sesión. Intenta nuevamente.');
    }
  }
});

// CARGAR DATOS DE USUARIO
async function cargarDatosUsuario(user) {
  try {
    const userDoc = await db.collection('usuarios').doc(user.uid).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      document.getElementById('userName').textContent = userData.nombre || 'Usuario';
      document.getElementById('userEmail').textContent = user.email;

      const initials = userData.nombre 
        ? userData.nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : 'U';
      document.getElementById('userInitials').textContent = initials;

      document.getElementById('inputNombre').value = userData.nombre || '';
      document.getElementById('inputTelefono').value = userData.telefono || '';
    }
  } catch (error) {
    console.error('Error al cargar datos del usuario:', error);
  }
}

// MOSTRAR / OCULTAR PANTALLAS
function mostrarLogin() {
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('panelScreen').classList.add('hidden');
}

function mostrarPanel() {
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('panelScreen').classList.remove('hidden');
}

// NAVEGACIÓN
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active', 'bg-primary', 'text-white'));
    link.classList.add('active', 'bg-primary', 'text-white');

    const section = link.dataset.section;
    document.querySelectorAll('.section-content').forEach(s => s.classList.add('hidden'));

    if (section === 'propiedades') {
      document.getElementById('seccionPropiedades').classList.remove('hidden');
      document.getElementById('sectionTitle').textContent = 'Mis Propiedades';
      document.getElementById('btnNuevaPropiedad').classList.remove('hidden');
    } else if (section === 'configuracion') {
      document.getElementById('seccionConfiguracion').classList.remove('hidden');
      document.getElementById('sectionTitle').textContent = 'Configuración';
      document.getElementById('btnNuevaPropiedad').classList.add('hidden');
    }
  });
});

// PROPIEDADES
async function cargarPropiedadesUsuario() {
  const container = document.getElementById('listaPropiedades');
  container.innerHTML = `
    <div class="col-span-full flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  `;

  try {
    const snapshot = await db.collection('propiedades')
      .where('usuario_id', '==', usuarioActual.uid)
      .orderBy('fecha_creacion', 'desc')
      .get();

    if (snapshot.empty) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12">
          <p class="text-gray-500 mb-4">No tienes propiedades publicadas</p>
          <button onclick="abrirModalNueva()" class="px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition">
            Publicar tu primera propiedad
          </button>
        </div>
      `;
      return;
    }

    const html = snapshot.docs.map(doc => {
      const prop = { id: doc.id, ...doc.data() };
      return crearTarjetaPropiedadAdmin(prop);
    }).join('');

    container.innerHTML = html;

  } catch (error) {
    console.error('Error al cargar propiedades:', error);
    container.innerHTML = `
      <div class="col-span-full text-center py-12">
        <p class="text-red-500 mb-4">Error al cargar las propiedades</p>
        <button onclick="cargarPropiedadesUsuario()" class="text-primary hover:underline">Reintentar</button>
      </div>
    `;
  }
}

// TARJETA DE PROPIEDAD ADMIN (SOLO CLP)
function crearTarjetaPropiedadAdmin(prop) {
  const imagenPrincipal = prop.imagenes && prop.imagenes.length > 0 
    ? prop.imagenes.find(img => img.orden === 0)?.url || prop.imagenes[0].url
    : '';

  const estadoClases = {
    disponible: 'bg-green-100 text-green-700',
    vendido: 'bg-red-100 text-red-700',
    arrendado: 'bg-blue-100 text-blue-700'
  };

  return `
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition">
      ${imagenPrincipal ? `
        <div class="h-48 bg-gray-100">
          <img src="${imagenPrincipal}" alt="${prop.titulo}" class="w-full h-full object-cover">
        </div>
      ` : `
        <div class="h-48 bg-gray-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"></svg>
        </div>
      `}

      <div class="p-5">
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-gray-900 truncate mb-1">${prop.titulo}</h3>
            <p class="text-sm text-gray-500 truncate">${prop.ubicacion}</p>
          </div>
          <span class="ml-2 px-2 py-1 rounded-full text-xs font-medium ${estadoClases[prop.estado] || 'bg-gray-100 text-gray-700'}">
            ${prop.estado}
          </span>
        </div>

        <p class="text-xl font-bold text-primary mb-3">$${formatNumber(prop.precio_clp)}</p>

        <div class="flex gap-2">
          <button onclick="editarPropiedad('${prop.id}')" class="flex-1 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition">
            Editar
          </button>
          <button onclick="eliminarPropiedad('${prop.id}')" class="px-4 py-2 border border-red-300 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  `;
}

// MODAL NUEVA PROPIEDAD
document.getElementById('btnNuevaPropiedad').addEventListener('click', abrirModalNueva);
function abrirModalNueva() {
  propiedadEnEdicion = null;
  imagenesSeleccionadas = [];
  imagenesExistentes = [];
  document.getElementById('modalTitulo').textContent = 'Nueva Propiedad';
  document.getElementById('formPropiedad').reset();
  document.getElementById('propiedadId').value = '';
  document.getElementById('previewImagenes').innerHTML = '';
  document.getElementById('modalPropiedad').classList.add('active');
}

document.getElementById('btnCerrarModal').addEventListener('click', cerrarModal);
document.getElementById('btnCancelar').addEventListener('click', cerrarModal);

function cerrarModal() {
  document.getElementById('modalPropiedad').classList.remove('active');
  propiedadEnEdicion = null;
  imagenesSeleccionadas = [];
  imagenesExistentes = [];
}

// EDITAR PROPIEDAD
async function editarPropiedad(id) {
  try {
    const doc = await db.collection('propiedades').doc(id).get();

    if (!doc.exists) {
      alert('Propiedad no encontrada');
      return;
    }
    propiedadEnEdicion = { id: doc.id, ...doc.data() };
    imagenesExistentes = propiedadEnEdicion.imagenes || [];
    imagenesSeleccionadas = [];

    const form = document.getElementById('formPropiedad');
    form.titulo.value = propiedadEnEdicion.titulo;
    form.descripcion.value = propiedadEnEdicion.descripcion;
    form.tipo.value = propiedadEnEdicion.tipo;
    form.estado.value = propiedadEnEdicion.estado;
    form.ubicacion.value = propiedadEnEdicion.ubicacion;
    form.region.value = propiedadEnEdicion.region || '';
    form.precio_clp.value = propiedadEnEdicion.precio_clp;
    form.habitaciones.value = propiedadEnEdicion.habitaciones || '';
    form.banos.value = propiedadEnEdicion.banos || '';
    form.metros_cuadrados.value = propiedadEnEdicion.metros_cuadrados || '';
    form.destacado.checked = propiedadEnEdicion.destacado || false;

    document.getElementById('propiedadId').value = doc.id;
    document.getElementById('modalTitulo').textContent = 'Editar Propiedad';

    mostrarImagenesExistentes();
    document.getElementById('modalPropiedad').classList.add('active');

  } catch (error) {
    console.error('Error al cargar propiedad:', error);
    alert('Error al cargar la propiedad');
  }
}

// ELIMINAR PROPIEDAD
async function eliminarPropiedad(id) {
  if (!confirm('¿Estás seguro de eliminar esta propiedad?')) return;

  try {
    const doc = await db.collection('propiedades').doc(id).get();
    const prop = doc.data();

    if (prop.imagenes && prop.imagenes.length > 0) {
      const deletePromises = prop.imagenes.map(img => {
        const path = img.url.split('/o/')[1].split('?')[0];
        const decodedPath = decodeURIComponent(path);
        return storage.ref(decodedPath).delete().catch(err => {
          console.error('Error al eliminar imagen:', err);
        });
      });
      await Promise.all(deletePromises);
    }

    await db.collection('propiedades').doc(id).delete();
    alert('Propiedad eliminada correctamente');
    cargarPropiedadesUsuario();

  } catch (error) {
    console.error('Error al eliminar propiedad:', error);
    alert('Error al eliminar la propiedad.');
  }
}

// IMÁGENES
document.getElementById('inputImagenes').addEventListener('change', (e) => {
  const files = Array.from(e.target.files);

  files.forEach(file => {
    if (file.size > 5 * 1024 * 1024) {
      alert(`La imagen ${file.name} supera los 5MB`);
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert(`El archivo ${file.name} no es una imagen válida`);
      return;
    }
    imagenesSeleccionadas.push(file);
  });

  mostrarPreviewImagenes();
  e.target.value = '';
});

// PREVIEW IMÁGENES
function mostrarPreviewImagenes() {
  const container = document.getElementById('previewImagenes');
  container.innerHTML = '';

  imagenesExistentes.forEach((img, index) => {
    const div = document.createElement('div');
    div.className = 'image-preview-item';
    div.innerHTML = `
      <img src="${img.url}">
      <button type="button" class="remove-btn" onclick="eliminarImagenExistente(${index})">&times;</button>
      <div class="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-2 py-0.5 rounded">Actual</div>
    `;
    container.appendChild(div);
  });

  imagenesSeleccionadas.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const div = document.createElement('div');
      div.className = 'image-preview-item';
      div.innerHTML = `
        <img src="${e.target.result}">
        <button type="button" class="remove-btn" onclick="eliminarImagenNueva(${index})">&times;</button>
        <div class="absolute bottom-1 left-1 bg-primary text-white text-xs px-2 py-0.5 rounded">Nueva</div>
      `;
      container.appendChild(div);
    };
    reader.readAsDataURL(file);
  });
}

function mostrarImagenesExistentes() {
  const container = document.getElementById('previewImagenes');
  container.innerHTML = '';

  imagenesExistentes.forEach((img, index) => {
    const div = document.createElement('div');
    div.className = 'image-preview-item';
    div.innerHTML = `
      <img src="${img.url}">
      <button type="button" class="remove-btn" onclick="eliminarImagenExistente(${index})">&times;</button>
    `;
    container.appendChild(div);
  });
}

function eliminarImagenExistente(index) {
  imagenesExistentes.splice(index, 1);
  mostrarPreviewImagenes();
}

function eliminarImagenNueva(index) {
  imagenesSeleccionadas.splice(index, 1);
  mostrarPreviewImagenes();
}

// SUBIR IMÁGENES
async function subirImagenes(propiedadId) {
  const urlsImagenes = [...imagenesExistentes];

  for (let i = 0; i < imagenesSeleccionadas.length; i++) {
    const file = imagenesSeleccionadas[i];
    const timestamp = Date.now();
    const fileName = `${propiedadId}_${timestamp}_${i}.jpg`;
    const storageRef = storage.ref(`propiedades/${usuarioActual.uid}/${fileName}`);

    try {
      const snapshot = await storageRef.put(file);
      const url = await snapshot.ref.getDownloadURL();

      urlsImagenes.push({
        url: url,
        nombre: fileName,
        orden: urlsImagenes.length
      });
    } catch (error) {
      console.error('Error al subir imagen:', error);
      throw error;
    }
  }
  return urlsImagenes;
}

// GUARDAR PROPIEDAD (solo CLP)
document.getElementById('formPropiedad').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;
  const btnGuardar = document.getElementById('btnGuardar');
  const propiedadId = document.getElementById('propiedadId').value;

  if (imagenesExistentes.length === 0 && imagenesSeleccionadas.length === 0) {
    alert('Debes agregar al menos una imagen de la propiedad');
    return;
  }

  btnGuardar.textContent = 'Guardando...';
  btnGuardar.disabled = true;
  form.classList.add('loading');

  try {
    const datos = {
      titulo: form.titulo.value.trim(),
      descripcion: form.descripcion.value.trim(),
      tipo: form.tipo.value,
      estado: form.estado.value,
      ubicacion: form.ubicacion.value.trim(),
      region: form.region.value.trim(),
      precio_clp: parseFloat(form.precio_clp.value),
      habitaciones: parseInt(form.habitaciones.value) || null,
      banos: parseInt(form.banos.value) || null,
      metros_cuadrados: parseInt(form.metros_cuadrados.value) || null,
      destacado: form.destacado.checked,
      usuario_id: usuarioActual.uid,
      fecha_actualizacion: firebase.firestore.FieldValue.serverTimestamp()
    };

    let docId;

    if (propiedadId) {
      docId = propiedadId;
      const imagenes = await subirImagenes(docId);
      datos.imagenes = imagenes;

      await db.collection('propiedades').doc(docId).update(datos);
      alert('Propiedad actualizada correctamente');

    } else {
      datos.fecha_creacion = firebase.firestore.FieldValue.serverTimestamp();
      const docRef = await db.collection('propiedades').add(datos);
      docId = docRef.id;

      const imagenes = await subirImagenes(docId);
      await db.collection('propiedades').doc(docId).update({ imagenes });

      alert('Propiedad publicada correctamente');
    }

    cerrarModal();
    cargarPropiedadesUsuario();

  } catch (error) {
    console.error('Error al guardar propiedad:', error);
    alert('Error al guardar la propiedad.');
  } finally {
    btnGuardar.textContent = 'Guardar Propiedad';
    btnGuardar.disabled = false;
    form.classList.remove('loading');
  }
});

// ACTUALIZAR PERFIL
document.getElementById('btnActualizarPerfil').addEventListener('click', async () => {
  const nombre = document.getElementById('inputNombre').value.trim();
  const telefono = document.getElementById('inputTelefono').value.trim();

  if (!nombre) {
    alert('El nombre es obligatorio');
    return;
  }

  try {
    await db.collection('usuarios').doc(usuarioActual.uid).update({
      nombre: nombre,
      telefono: telefono
    });

    alert('Perfil actualizado correctamente');
    await cargarDatosUsuario(usuarioActual);

  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    alert('Error al actualizar el perfil');
  }
});

// FILTROS
document.getElementById('btnAplicarFiltros').addEventListener('click', async () => {
  const titulo = document.getElementById('filtroTitulo').value.toLowerCase();
  const tipo = document.getElementById('filtroTipo').value;
  const estado = document.getElementById('filtroEstado').value;

  const container = document.getElementById('listaPropiedades');
  container.innerHTML = '<div class="col-span-full flex justify-center py-12"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>';

  try {
    let query = db.collection('propiedades').where('usuario_id', '==', usuarioActual.uid);

    if (tipo) query = query.where('tipo', '==', tipo);
    if (estado) query = query.where('estado', '==', estado);

    const snapshot = await query.orderBy('fecha_creacion', 'desc').get();

    let propiedades = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (titulo) {
      propiedades = propiedades.filter(p => p.titulo.toLowerCase().includes(titulo));
    }

    if (propiedades.length === 0) {
      container.innerHTML = '<div class="col-span-full text-center py-12"><p class="text-gray-500">No se encontraron propiedades</p></div>';
      return;
    }

    const html = propiedades.map(crearTarjetaPropiedadAdmin).join('');
    container.innerHTML = html;

  } catch (error) {
    console.error('Error al filtrar:', error);
    container.innerHTML = '<div class="col-span-full text-center py-12"><p class="text-red-500">Error al aplicar filtros</p></div>';
  }
});

// UTILIDADES
function formatNumber(num) {
  return new Intl.NumberFormat('es-CL').format(num);
}

function obtenerMensajeError(code) {
  const errores = {
    'auth/user-not-found': 'No existe una cuenta con ese correo',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/invalid-email': 'Correo inválido',
    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
    'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde'
  };

  return errores[code] || 'Error al iniciar sesión.';
}

// Exponer funciones globalmente
window.editarPropiedad = editarPropiedad;
window.eliminarPropiedad = eliminarPropiedad;
window.eliminarImagenExistente = eliminarImagenExistente;
window.eliminarImagenNueva = eliminarImagenNueva;
window.abrirModalNueva = abrirModalNueva;
// Exponer función de cargar propiedades para reutilización
window.cargarPropiedadesUsuario = cargarPropiedadesUsuario;
// Exponer formateador de números
window.formatNumber = formatNumber;
// Exponer función de obtener mensaje de error
window.obtenerMensajeError = obtenerMensajeError;
