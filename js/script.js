let peliculas = []; // Guardamos el JSON de películas

// ==============================
// Cargar las películas al inicio
// ==============================
async function cargarPeliculas() {
  try {
    const response = await fetch("https://japceibal.github.io/japflix_api/movies-data.json");
    peliculas = await response.json();
    console.log("Películas cargadas:", peliculas.length);
  } catch (error) {
    console.error("Error al traer películas:", error);
  }
}

// ============================================
// Función para generar estrellas 
// ============================================
function generarEstrellas(voteAverage) {
  const maxStars = 5;
  const estrellas = Math.round(voteAverage / 2); // escala 0-10 -> 0-5
  let html = '<span class="stars">';
  for (let i = 1; i <= maxStars; i++) {
    if (i <= estrellas) {
      html += '<span class="fa fa-star checked"></span>'; // estrella llena
    } else {
      html += '<span class="fa fa-star"></span>'; // estrella vacía
    }
  }
  html += '</span>';
  return html;
}

// ====================================
// Filtrar y mostrar resultados
// ====================================
function buscarPeliculas() {
  const input = document.getElementById("inputBuscar").value.toLowerCase().trim();
  const lista = document.getElementById("lista");
  lista.innerHTML = ""; // limpiar resultados anteriores

  if (input === "") {
    lista.innerHTML = `<li class="list-group-item">Escribe algo para buscar.</li>`;
    return;
  }

  const resultados = peliculas.filter(p => 
    p.title.toLowerCase().includes(input) ||
    p.tagline.toLowerCase().includes(input) ||
    p.overview.toLowerCase().includes(input) ||
    p.genres.join(", ").toLowerCase().includes(input)
  );

  if (resultados.length === 0) {
    lista.innerHTML = `<li class="list-group-item">No se encontraron resultados.</li>`;
    return;
  }

  resultados.forEach(p => {
    const item = document.createElement("li");
    item.classList.add("list-group-item", "bg-dark", "text-light");
      item.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <strong>${p.title}</strong> <br>
          <em>${p.tagline}</em>
        </div>
        <div>
          ${generarEstrellas(p.vote_average)}
        </div>
      </div>
    `;
  

    // ==============================
    // Evento click para mostrar detalles en Offcanvas
    // ==============================
    item.addEventListener("click", () => {
      // Datos principales
      document.getElementById('detalleTitulo').textContent = p.title;
      document.getElementById('detalleOverview').textContent = p.overview;
      document.getElementById('detalleGeneros').textContent = p.genres.join(", ");
      // mostrar solo nombres de los géneros
      document.getElementById('detalleGeneros').textContent = p.genres.map(g => g.name).join(", ");
      // Datos extra en dropdown dentro del mismo recuadro
      const dropdown = document.getElementById('dropdownContent');
      dropdown.innerHTML = `
        <li><span class="dropdown-item">Año de lanzamiento: ${p.release_date ? p.release_date.slice(0,4) : 'N/A'}</span></li>
        <li><span class="dropdown-item">Duración: ${p.runtime ? p.runtime + ' min' : 'N/A'}</span></li>
        <li><span class="dropdown-item">Presupuesto: ${p.budget ? '$' + p.budget.toLocaleString() : 'N/A'}</span></li>
        <li><span class="dropdown-item">Ganancias: ${p.revenue ? '$' + p.revenue.toLocaleString() : 'N/A'}</span></li>
      `;

      // Mostrar offcanvas
      const offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasDetalle'));
      offcanvas.show();
    });

    lista.appendChild(item);
  });
}

// ===================
// Eventos principales
// ===================
window.addEventListener("DOMContentLoaded", cargarPeliculas);
document.getElementById("btnBuscar").addEventListener("click", buscarPeliculas);