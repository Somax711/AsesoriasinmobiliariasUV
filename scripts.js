// Año en footer
document.getElementById('year').textContent = new Date().getFullYear();

// ===============================
// Menú móvil
// ===============================
const mobileBtn = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const iconOpen = document.getElementById('mobile-menu-icon-open');
const iconClose = document.getElementById('mobile-menu-icon-close');

if (mobileBtn && mobileMenu) {
  mobileBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');

    if (iconOpen && iconClose) {
      iconOpen.classList.toggle('hidden');
      iconClose.classList.toggle('hidden');
    }
  });

  mobileMenu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      mobileMenu.classList.add('hidden');
      if (iconOpen && iconClose) {
        iconOpen.classList.remove('hidden');
        iconClose.classList.add('hidden');
      }
    }
  });
}

// ===============================
// Animaciones con IntersectionObserver
// ===============================
const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('js-fade-show');
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.js-fade').forEach(el => {
  observer.observe(el);
});

// ===============================
// Botón WhatsApp flotante
// ===============================
const whatsappButton = document.getElementById('whatsapp-float');

if (whatsappButton) {
  whatsappButton.addEventListener('click', () => {
    const mensaje = encodeURIComponent(
      'Hola, me gustaría recibir asesoría inmobiliaria con UV Asesorías.'
    );
    window.open('https://wa.me/56936685306?text=' + mensaje, '_blank');
  });
}

// ===============================
// ✉️ FORMULARIO DE CONTACTO
// ===============================
const contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
      nombre: document.getElementById("nombre").value.trim(),
      telefono: document.getElementById("telefono").value.trim(),
      email: document.getElementById("email").value.trim(),
      tipo: document.getElementById("tipo-consulta").value.trim(),
      mensaje: document.getElementById("mensaje").value.trim()
    };

    const btn = this.querySelector("button[type='submit']");
    btn.disabled = true;
    btn.textContent = "Enviando...";

    emailjs.send("service_qh45io6", "template_awh199q", data)
      .then(() => {
        alert("Tu mensaje fue enviado con éxito.");
        contactForm.reset();
        btn.disabled = false;
        btn.textContent = "Enviar consulta";
      })
      .catch(error => {
        console.error("Error:", error);
        alert("Hubo un problema al enviar tu mensaje.");
        btn.disabled = false;
        btn.textContent = "Enviar consulta";
      });
  });
}
