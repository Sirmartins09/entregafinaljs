const URL = "../db/data.json";
const turnos = document.getElementById("turnos");

// ==============================
// OBTENER DATOS
// ==============================
function obtenerDatos() {
  fetch(URL)
    .then(response => response.json())
    .then(data => {
      
      Toastify({
        text: "Datos cargados correctamente",
        gravity: "top",
        position: "right",
        backgroundColor: "#046424ff",
        duration: 1500
      }).showToast();

      renderTurnos(data);
    })
    .catch(() => {
    
      Toastify({
        text: "Error al cargar los datos",
        gravity: "top",
        position: "right",
        backgroundColor: "#aa0606ff",
        duration: 2000
      }).showToast();
    })
    .finally(() => {
      
      Toastify({
        text: "Proceso de carga finalizado",
        duration: 1500,
        gravity: "bottom",
        position: "right",
        backgroundColor: "#7b7d80ff",
      }).showToast();
    });
}

// ==============================
// MOSTRAR TURNOS
// ==============================
function renderTurnos(turnosArray) {
  turnos.innerHTML = "";

  turnosArray.forEach(especialidad => {
    const card = document.createElement("div");
    card.classList.add("card-especialidad");

    card.innerHTML = `
      <h2>${especialidad.especialidad}</h2>
      <p>Ver doctores disponibles</p>
    `;

    card.addEventListener("click", () => {
      localStorage.setItem("especialidadSeleccionada", especialidad.especialidad);
      window.location.href = "../pages/doctores.html";
    });

    turnos.appendChild(card);
  });
}


obtenerDatos();
