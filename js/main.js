const formulario = document.getElementById("form-confirmar");
const selectObraSocial = document.getElementById("tieneObraSocial");
const campoObraSocial = document.getElementById("campoObraSocial");

// Mostrar u ocultar el campo de "Cuál obra social"
selectObraSocial.addEventListener("change", () => {
  if (selectObraSocial.value === "si") {
    campoObraSocial.style.display = "block";
  } else {
    campoObraSocial.style.display = "none";
  }
});

formulario.onsubmit = (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  const telefono = document.getElementById("telefono").value;
  const obraSocial = document.getElementById("obraSocial").value;

  // ======== VALIDACIONES ========

  // Campos vacíos
  if (!nombre || !email || !telefono) {
    Swal.fire({
      icon: "warning",
      title: "Campos incompletos",
      text: "Por favor, complete todos los campos obligatorios.",
    });
    return;
  }

  // Nombre no debe contener números
  for (let i = 0; i < nombre.length; i++) {
    if (nombre[i] >= "0" && nombre[i] <= "9") {
      Swal.fire({
        icon: "error",
        title: "Nombre inválido",
        text: "El nombre no puede contener números.",
      });
      return;
    }
  }

  // Teléfono solo números
  for (let i = 0; i < telefono.length; i++) {
    let char = telefono[i];
    if ((char >= "a" && char <= "z") || (char >= "A" && char <= "Z")) {
      Swal.fire({
        icon: "error",
        title: "Teléfono inválido",
        text: "El teléfono solo puede contener números.",
      });
      return;
    }
  }

  // ======== SWITCH DE OBRA SOCIAL ========
  switch (selectObraSocial.value) {
    case "si":
      if (!obraSocial) {
        Swal.fire({
          icon: "warning",
          title: "Falta información",
          text: "Por favor, indique el nombre de su obra social.",
        });
        return;
      }

      const datosConOS = { nombre, email, telefono, obraSocial, coseguro: 0 };
      localStorage.setItem("datosPaciente", JSON.stringify(datosConOS));

      Swal.fire({
        icon: "success",
        title: "Datos guardados",
        text: "Turno confirmado con obra social.",
        confirmButtonText: "Continuar",
      }).then(() => {
        window.location.href = "pages/datos.html";
      });
      return;

    case "no":
      Swal.fire({
        title: "Sin obra social",
        text: "Deberá abonar un valor de consulta de $5000 al momento de la atención. ¿Desea continuar?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, continuar",
        cancelButtonText: "No, volver",
      }).then((result) => {
        if (result.isConfirmed) {
          const datosSinOS = {
            nombre,
            email,
            telefono,
            obraSocial: "Sin obra social",
            coseguro: 5000,
          };
          localStorage.setItem("datosPaciente", JSON.stringify(datosSinOS));

          Swal.fire({
            icon: "success",
            title: "Datos guardados correctamente",
            text: "Será redirigido a la página de especialidades.",
            timer: 2500,
            showConfirmButton: false,
          });

          setTimeout(() => {
            window.location.href = "pages/datos.html";
          }, 2500);
        }
      });
      return;

    default:
      Swal.fire({
        icon: "warning",
        title: "Seleccione una opción",
        text: "Por favor, indique si tiene obra social o no.",
      });
      return;
  }
};
