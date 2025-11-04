const especialidadSeleccionada = localStorage.getItem("especialidadSeleccionada");
const URL = "../db/data.json";
const doctoresContainer = document.getElementById("doctores");
const profesional = document.getElementById("profesional");

// ==============================
// MOSTRAR ESPECIALIDAD EN TÍTULO
// ==============================
function nombreProfesional() {
  profesional.innerHTML = `
    <h3>Elija el profesional para <span style="color:#007bff;">${especialidadSeleccionada}</span></h3>
  `;
}

// Mostrar el título apenas se carga la página
nombreProfesional();

// ==============================
// OBTENER DATOS CON FETCH + TRY/CATCH/FINALLY
// ==============================
function obtenerDatos() {
  try {
    fetch(URL)
      .then(response => response.json())
      .then(data => {
        // ✅ Guardar base completa de doctores
        localStorage.setItem("doctoresData", JSON.stringify(data));

        // ✅ Filtrar por especialidad elegida
        const especialidad = data.find(item => item.especialidad === especialidadSeleccionada);

        if (especialidad) {
          renderDoctores(especialidad.doctores);

          // ✅ Mensaje visual de éxito
          Toastify({
            text: "Datos cargados correctamente",
            gravity: "top",
            position: "right",
            backgroundColor: "#046424ff",
            duration: 1500
          }).showToast();
        } else {
          doctoresContainer.innerHTML = "<p>No se encontraron doctores para la especialidad seleccionada.</p>";

          Swal.fire({
            icon: "warning",
            title: "Especialidad no encontrada",
            text: "No hay profesionales disponibles en esta categoría.",
          });
        }
      })
      .catch(() => {
        // ⚠️ Error al obtener datos
        Toastify({
          text: "Error al cargar los datos",
          gravity: "top",
          position: "right",
          backgroundColor: "#aa0606ff",
          duration: 2000
        }).showToast();
      })
      .finally(() => {
        // ✅ Toastify: mensaje breve que se ejecuta siempre
        Toastify({
          text: "Proceso de carga finalizado",
          duration: 1500,
          gravity: "bottom",
          position: "right",
          backgroundColor: "#7d7e80ff",
        }).showToast();
      });
  } catch (error) {
    console.error("Error general:", error);
  }
}

// ==============================
// MOSTRAR DOCTORES
// ==============================
function renderDoctores(listaDoctores) {
  doctoresContainer.innerHTML = "";

  listaDoctores.forEach(doctor => {
    const card = document.createElement("div");
    card.classList.add("card-doctor");

    card.innerHTML = `
      <h3>${doctor.nombre}</h3>
      <p>Ver disponibilidad de turnos</p>
    `;

    // ✅ Guardamos doctor seleccionado (nombre + días)
    card.addEventListener("click", () => {
      localStorage.setItem(
        "doctorSeleccionado",
        JSON.stringify({
          nombre: doctor.nombre,
          dias: doctor.dias
        })
      );
      window.location.href = "fechayhora.html";
    });

    doctoresContainer.appendChild(card);
  });
}

// Ejecutar al cargar la página
obtenerDatos();
