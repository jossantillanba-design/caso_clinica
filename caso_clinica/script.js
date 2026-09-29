document.addEventListener("DOMContentLoaded", () => {
  const pagina = document.body.getAttribute("data-pagina");
  if (pagina === "formulario") {
    const horariosBase = ["09:00", "10:00", "11:00", "15:00", "16:00"];
    const selectHorario = document.getElementById("horario");
    const form = document.getElementById("centro");
    const btnLimpiar = document.getElementById("btnLimpiar");
    function cargarHorarios() {
      selectHorario.innerHTML = '<option value="">Selecciona</option>';
      let habilitados = 0;
      horariosBase.forEach((h) => {
        const opt = document.createElement("option");
        opt.value = h;
        if (h === "11:00") {
          opt.textContent = `${h} (No disponible)`;
          opt.disabled = true;
        } else {
          opt.textContent = h;
          habilitados++;
        }
        selectHorario.appendChild(opt);
      });
      if (habilitados === 0) {
        selectHorario.innerHTML = '<option value="">No existen horarios habilitados</option>';
      }
    }
    function restaurarDatos() {
      const guardado = sessionStorage.getItem("solicitudCita");
      if (guardado) {
        const datos = JSON.parse(guardado);
        document.getElementById("nombre").value = datos.nombre || "";
        document.getElementById("email").value = datos.email || "";
        document.getElementById("especialidad").value = datos.especialidad || "";
        document.getElementById("fecha").value = datos.fecha || "";
        document.getElementById("horario").value = datos.horario || "";
      }
    }
    cargarHorarios();
    restaurarDatos();
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const nombre = document.getElementById("nombre");
      const email = document.getElementById("email");
      const especialidad = document.getElementById("especialidad");
      const fecha = document.getElementById("fecha");
      const horario = document.getElementById("horario");
      [nombre, email, especialidad, fecha, horario].forEach(el => el.classList.remove("is-invalid"));
      let esValido = true;
      const valNombre = nombre.value.trim();
      if (valNombre.length < 3 || valNombre.length > 60) {
        mostrarError(nombre, "errNombre", "El nombre debe tener entre 3 y 60 caracteres.");
        esValido = false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        mostrarError(email, "errEmail", "Ingrese un correo electrónico válido.");
        esValido = false;
      }
      if (!especialidad.value) {
        mostrarError(especialidad, "errEspecialidad", "Seleccione una especialidad.");
        esValido = false;
      }
      if (!fecha.value) {
        mostrarError(fecha, "errFecha", "Seleccione una fecha.");
        esValido = false;
      } else {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const fechaIngresada = new Date(fecha.value + "T00:00:00");
        if (fechaIngresada < hoy) {
          mostrarError(fecha, "errFecha", "La fecha debe ser igual o posterior a hoy.");
          esValido = false;
        }
      }
      if (!horario.value) {
        mostrarError(horario, "errHorario", "Seleccione un horario.");
        esValido = false;
      } else if (horario.value === "11:00") {
        mostrarError(horario, "errHorario", "El horario 11:00 no está disponible.");
        esValido = false;
      }
      if (esValido) {
        const solicitud = {
          nombre: valNombre,
          email: email.value.trim(),
          especialidad: especialidad.value,
          fecha: fecha.value,
          horario: horario.value
        };
        sessionStorage.setItem("solicitudCita", JSON.stringify(solicitud));
        window.location.href = "confirmacion-cita.html";
      }
    });
    function mostrarError(input, idError, texto) {
      input.classList.add("is-invalid");
      document.getElementById(idError).textContent = texto;

    }
    btnLimpiar.addEventListener("click", () => {
      form.reset();
      [document.getElementById("nombre"), document.getElementById("email"),
       document.getElementById("especialidad"), document.getElementById("fecha"),
       document.getElementById("horario")].forEach(el => el.classList.remove("is-invalid"));
      sessionStorage.removeItem("solicitudCita");
    });
  }
  if (pagina === "confirmar") {
    const dataRaw = sessionStorage.getItem("solicitudCita");
    const sinDatos = document.getElementById("sinDatos");
    const conDatos = document.getElementById("conDatos");
    const detalle = document.getElementById("detalle");
    const btnConfirmar = document.getElementById("confirmar");
    if (!dataRaw) {
      conDatos.classList.add("d-none");
      sinDatos.classList.remove("d-none");
    } else {
      const data = JSON.parse(dataRaw);
      detalle.textContent =
`Nombres:      ${data.nombre}
Correo:       ${data.email}
Especialidad: ${data.especialidad}
Fecha:        ${data.fecha}
Horario:      ${data.horario}`;

      btnConfirmar.addEventListener("click", () => {
        alert("Cita registrada");
        sessionStorage.removeItem("solicitudCita");
        window.location.href = "index.html";
      });
    }
  }
});