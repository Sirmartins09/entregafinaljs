
// ==============================
// VARIABLES
// ==============================
const doctorSeleccionado = JSON.parse(localStorage.getItem("doctorSeleccionado"));
const paciente = JSON.parse(localStorage.getItem("datosPaciente"));
const horariosEl = document.getElementById("horarios");

// Si no hay doctor seleccionado, aviso y vuelvo
if (!doctorSeleccionado || !doctorSeleccionado.dias) {
  Swal.fire({
    icon: "info",
    title: "Seleccionar profesional",
    text: "Primero tenés que elegir un doctor.",
    confirmButtonText: "Volver",
  }).then(() => {
    window.location.href = "./doctores.html";
  });
}

// ==============================
// TURNOS OCUPADOS (para evitar repetir horarios)
// ==============================
let turnosOcupados = JSON.parse(localStorage.getItem("turnosOcupados")) || [];
let diasDisponibles = [];

// ==============================
// FUNCIONES AUXILIARES
// ==============================
function esMismoTurno(a, doctor, fecha, hora) {
  return a.doctor === doctor && a.fecha === fecha && a.hora === hora;
}

function estaOcupado(doctor, fecha, hora) {
  for (let i = 0; i < turnosOcupados.length; i++) {
    if (esMismoTurno(turnosOcupados[i], doctor, fecha, hora)) return true;
  }
  return false;
}


function filtrarDias(diasOriginales, nombreDoctor) {
  const resultado = [];

  for (let diaI = 0; diaI < diasOriginales.length; diaI++) {
    const dia = diasOriginales[diaI];
    const horariosLibres = [];

    for (let horaI = 0; horaI < dia.horarios.length; horaI++) {
      const hora = dia.horarios[horaI];
      if (!estaOcupado(nombreDoctor, dia.fecha, hora)) {
        horariosLibres.push(hora);
      }
    }

   
    if (horariosLibres.length > 0) {
      resultado.push({ fecha: dia.fecha, horarios: horariosLibres });
    }
  }

  return resultado;
}

// ==============================
// CALENDARIO
// ==============================
diasDisponibles = filtrarDias(doctorSeleccionado.dias, doctorSeleccionado.nombre);
let fechasDisponibles = diasDisponibles.map(d => d.fecha);

const calendar = new VanillaCalendar("#calendario", {
  settings: {
    lang: "es",
    selection: { day: "single" },
    range: { min: "2025-11-01", max: "2025-12-31" },
  },
  actions: {
    clickDay(event, self) {
      const fechaSeleccionada = self.selectedDates[0];
      mostrarHorarios(fechaSeleccionada);

      
      setTimeout(() => {
        marcarDiasDisponibles();

       
        const seleccionado = document.querySelector(
          `.vanilla-calendar-day__btn[data-calendar-date="${fechaSeleccionada}"]`
        );
        if (seleccionado) {
          seleccionado.style.backgroundColor = "#28a745"; // verde
          seleccionado.style.border = "2px solid #155724";
          seleccionado.style.color = "#fff";
        }
      }, 100);
    },

  
    changeToMonth() {
      setTimeout(marcarDiasDisponibles, 150);
    },
  },
});

calendar.init();
setTimeout(marcarDiasDisponibles, 300);

// ==============================
// MARCAR DÍAS DISPONIBLES EN EL CALENDARIO
// ==============================
function marcarDiasDisponibles() {
  const celdas = document.querySelectorAll(".vanilla-calendar-day__btn");

  celdas.forEach(celda => {
    const fecha = celda.dataset.calendarDay || celda.dataset.calendarDate;

    if (fechasDisponibles.includes(fecha)) {
      celda.style.backgroundColor = "#007bff";
      celda.style.color = "#fff";
      celda.style.borderRadius = "90%";
      celda.style.fontWeight = "bold";
      celda.style.pointerEvents = "auto";
      celda.style.opacity = "1";
    } else {
      celda.style.opacity = "0.3";
      celda.style.pointerEvents = "none";
    }
  });
}

// ==============================
// MOSTRAR HORARIOS Y CONFIRMAR TURNO
// ==============================
function mostrarHorarios(fechaSeleccionada) {
  horariosEl.innerHTML = "<h2>Horarios disponibles</h2>";

  const dia = diasDisponibles.find(d => d.fecha === fechaSeleccionada);

  if (!dia) {
    horariosEl.innerHTML += "<p>No hay horarios disponibles.</p>";
    return;
  }

  const contenedor = document.createElement("div");
  contenedor.classList.add("lista-horarios");
  horariosEl.appendChild(contenedor);

  dia.horarios.forEach(hora => {
    const boton = document.createElement("button");
    boton.textContent = hora;
    boton.classList.add("btn-hora");

    boton.addEventListener("click", () => {
   
      if (!paciente) {
        Swal.fire({
          icon: "info",
          title: "Faltan tus datos",
          text: "Completá el formulario del paciente antes de continuar.",
          confirmButtonText: "Ir al formulario",
        }).then(() => {
          window.location.href = "./index.html";
        });
        return;
      }

 
      let textoAtencion = "";
      if (paciente.obraSocial && paciente.obraSocial !== "Sin obra social") {
        textoAtencion = `
          <b>Obra Social:</b> ${paciente.obraSocial}<br>
          <b>Coseguro:</b> Sin costo adicional
        `;
      } else {
        textoAtencion = `
          <b>Tipo de atención:</b> Particular<br>
          <b>Importe a abonar:</b> $5000
        `;
      }

      
      // ALERTA DE CONFIRMACIÓN
      Swal.fire({
        title: "¿Desea confirmar el turno?",
        html: `
          <b>Paciente:</b> ${paciente.nombre}<br>
          <b>Email:</b> ${paciente.email}<br>
          <b>Teléfono:</b> ${paciente.telefono}<br><br>
          <b>Doctor:</b> ${doctorSeleccionado.nombre}<br>
          <b>Fecha:</b> ${formatearFecha(fechaSeleccionada)}<br>
          <b>Hora:</b> ${hora}<br><br>
          ${textoAtencion}
        `,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Confirmar turno",
        cancelButtonText: "Cancelar",
      }).then((r) => {
        if (r.isConfirmed) {
          const turnoConfirmado = {
            doctor: doctorSeleccionado.nombre,
            fecha: fechaSeleccionada,
            hora: hora,
            paciente: paciente.nombre,
            obraSocial: paciente.obraSocial || "Particular",
          };

          //  1. Guardar el turno en la lista general
          let turnosGuardados = JSON.parse(localStorage.getItem("turnosGuardados")) || [];
          turnosGuardados.push(turnoConfirmado);
          localStorage.setItem("turnosGuardados", JSON.stringify(turnosGuardados));

          //  2. Guardar turno como ocupado
          if (!estaOcupado(doctorSeleccionado.nombre, fechaSeleccionada, hora)) {
            turnosOcupados.push({
              doctor: doctorSeleccionado.nombre,
              fecha: fechaSeleccionada,
              hora: hora,
            });
            localStorage.setItem("turnosOcupados", JSON.stringify(turnosOcupados));
          }

          // 3. Actualizar los días y horarios disponibles
          diasDisponibles = filtrarDias(doctorSeleccionado.dias, doctorSeleccionado.nombre);
          fechasDisponibles = diasDisponibles.map(d => d.fecha);
          marcarDiasDisponibles();
          mostrarHorarios(fechaSeleccionada);

        
          Swal.fire({
            icon: "success",
            title: "Turno confirmado",
            text: `Tu turno fue registrado correctamente para el ${fechaSeleccionada} a las ${hora}.`,
            timer: 3000,
            showConfirmButton: false,
          });

          setTimeout(() => {
            window.location.href = "../index.html";
          }, 3000);
        }
      });
    });

    contenedor.appendChild(boton);
  });

  // ==============================
// FORMATEAR FECHA A dd/mm/aaaa
// ==============================
function formatearFecha(fecha) {
  const año = fecha.substring(0, 4);
  const mes = fecha.substring(5, 7);
  const dia = fecha.substring(8, 10);
  return dia + "/" + mes + "/" + año;
}

}


