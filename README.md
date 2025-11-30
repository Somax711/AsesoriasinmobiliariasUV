# UV Asesorías & Gestión Inmobiliaria  
Sistema web profesional para catálogo y administración de propiedades inmobiliarias, desarrollado por **Karen Bustamante Ayan**.

Este proyecto es una solución **fullstack basada en Firebase**, diseñada para empresas inmobiliarias que necesitan gestionar sus propiedades de forma rápida, segura y sin depender de terceros.
---

## 🚀 Características Principales

### **Frontend Moderno**
- HTML5, CSS3, JavaScript
- TailwindCSS + Bootstrap 5
- Diseño responsivo (mobile-first)
- Carrusel de imágenes por propiedad
- Animaciones suaves y experiencia de usuario optimizada

### **Backend-as-a-Service (Firebase)**
- **Firebase Authentication:** acceso privado para administradores  
- **Cloud Firestore:** gestión completa de propiedades (CRUD)  
- **Firebase Storage:** carga y manejo de imágenes ordenadas  
- Reglas de seguridad configuradas

---

## 🏡 Funcionalidades del Sitio

- Listado dinámico de propiedades con imagen principal o carrusel
- Descripción corta con botón **“Ver más / Ver menos”**
- Filtros básicos por ubicación y datos principales
- Destacado de propiedades prioritarias
- Conversión automática UF → CLP
- Carga veloz y optimizada para móviles
- Mostrar solo 6 tarjetas iniciales + botón “Ver más”

---

## 🔐 Panel de Administración

Panel privado donde el cliente puede:

- Crear nuevas propiedades  
- Subir múltiples imágenes por propiedad  
- Ordenar imágenes por prioridad  
- Editar campos como:
  - Título  
  - Descripción  
  - Precio  
  - Tipo  
  - Ubicación  
  - Región  
  - Dormitorios / baños  
  - Metros cuadrados  
- Eliminar propiedades  
- Marcar como “Destacadas”

Este panel se encuentra protegido con **Firebase Auth** y solo autorizado para usuarios del cliente.

---

## 🧱 Estructura del Proyecto

```bash
/public
  ├── index.html
  ├── style.css
  ├── app.js
  ├── galeria_firebase.js
  └── /img

/firebase
  ├── configuración de Firebase (auth, firestore, storage)
  └── reglas de seguridad


⚙️ Tecnologías Utilizadas

HTML5

CSS3

JavaScript

TailwindCSS

Bootstrap 5

Firebase Authentication

Firestore Database

Firebase Storage

API UF (conversión diaria)

💡 Objetivo del Proyecto

Este proyecto fue desarrollado para modernizar la presencia digital de UV Asesorías & Gestión Inmobiliaria, permitiéndoles:

Publicar propiedades de manera autónoma

Gestionar fotos y datos desde un panel propio

Evitar dependencia de portales externos

Mostrar información en un sitio moderno y profesional

Mejorar la captación de clientes y consultas

👩‍💻 Desarrolladora

Karen Bustamante Ayan
Desarrolladora Fullstack | Cloud | Firebase
GitHub: https://github.com/Somax711

Email profesional: contacto@uvasesoriasinmobiliarias.com

📄 Licencia

Proyecto creado exclusivamente para UV Asesorías & Gestión Inmobiliaria.
No se permite redistribución sin autorización.
