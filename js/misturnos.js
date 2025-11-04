// ============================
// FUNCIONES AUXILIARES
// ============================
function formatearFecha(fecha) {
  const año = fecha.substring(0, 4);
  const mes = fecha.substring(5, 7);
  const dia = fecha.substring(8, 10);
  return dia + "/" + mes + "/" + año;
}

// ============================
// MOSTRAR TURNOS GUARDADOS
// ============================
const lista = document.getElementById("lista-turnos");
const btnBorrarTodo = document.getElementById("btn-borrar-todo");

let turnos = JSON.parse(localStorage.getItem("turnosGuardados")) || [];

if (turnos.length === 0) {
  lista.innerHTML = "<p>No hay turnos confirmados.</p>";
  btnBorrarTodo.style.display = "none";
} else {
  renderTurnos();
}

// ============================
// MOSTRAR TURNOS
// ============================
function renderTurnos() {
  lista.innerHTML = "";

  turnos.forEach((turno, indice) => {
    const div = document.createElement("div");
    div.classList.add("turno-confirmado");

    div.innerHTML = `
      <h3>${turno.doctor}</h3>
      <p><strong>Fecha:</strong> ${formatearFecha(turno.fecha)}</p>
      <p><strong>Hora:</strong> ${turno.hora}</p>
      <p><strong>Paciente:</strong> ${turno.paciente}</p>
      <p><strong>Obra Social:</strong> ${turno.obraSocial}</p>
      <button class="btn-eliminar" data-indice="${indice}">Cancelar turno</button>
    `;

    lista.appendChild(div);
  });

  // Botones individuales de eliminar
  const botonesEliminar = document.querySelectorAll(".btn-eliminar");
  botonesEliminar.forEach((boton) => {
    boton.addEventListener("click", () => {
      const indice = boton.getAttribute("data-indice");
      confirmarCancelacion(indice);
    });
  });
}

// ============================
// CONFIRMAR CANCELACIÓN
// ============================
function confirmarCancelacion(indice) {
  const turno = turnos[indice];

  Swal.fire({
    title: "¿Desea cancelar este turno?",
    html: `
      <b>Doctor:</b> ${turno.doctor}<br>
      <b>Fecha:</b> ${formatearFecha(turno.fecha)}<br>
      <b>Hora:</b> ${turno.hora}
    `,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, cancelar",
    cancelButtonText: "No",
  }).then((r) => {
    if (r.isConfirmed) {
      cancelarTurno(indice);
    }
  });
}

// ============================
// CANCELAR UN TURNO
// ============================
function cancelarTurno(indice) {
  const turno = turnos[indice];

  // Eliminar de turnosGuardados
  turnos.splice(indice, 1);
  localStorage.setItem("turnosGuardados", JSON.stringify(turnos));

  // Actualizar turnosOcupados
  let turnosOcupados = JSON.parse(localStorage.getItem("turnosOcupados")) || [];
  turnosOcupados = turnosOcupados.filter(
    (t) =>
      !(
        t.doctor === turno.doctor &&
        t.fecha === turno.fecha &&
        t.hora === turno.hora
      )
  );
  localStorage.setItem("turnosOcupados", JSON.stringify(turnosOcupados));

  Swal.fire({
    icon: "success",
    title: "Turno cancelado",
    text: "El turno fue cancelado correctamente.",
    timer: 2000,
    showConfirmButton: false,
  });

  renderTurnos();
  if (turnos.length === 0) {
    lista.innerHTML = "<p>No hay turnos confirmados.</p>";
    btnBorrarTodo.style.display = "none";
  }
}

// ============================
// BORRAR TODOS LOS TURNOS
// ============================
btnBorrarTodo.addEventListener("click", () => {
  Swal.fire({
    title: "¿Cancelar todos los turnos?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, borrar todo",
    cancelButtonText: "Cancelar",
  }).then((r) => {
    if (r.isConfirmed) {
      localStorage.removeItem("turnosGuardados");
      localStorage.removeItem("turnosOcupados");
      turnos = [];
      lista.innerHTML = "<p>No hay turnos confirmados.</p>";
      btnBorrarTodo.style.display = "none";

      Swal.fire({
        icon: "success",
        title: "Todos los turnos cancelados",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  });
});

