let currentMarkers = [];

document.addEventListener("DOMContentLoaded", async function () {
  const map = initializeMap();
  await populateTrashTypes(map);
  await populateCities(map);
});

function initializeMap() {
  const map = L.map("map").setView([-23.5505, -46.6333], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  return map;
}

async function populateTrashTypes(map) {
  const filterBar = document.getElementById("filter-bar");
  const response = await fetch("/tipos-lixo");
  const data = await response.json();
  data.forEach((element) => {
    const div = createTrashTypeCheckbox(element, map);
    filterBar.appendChild(div);
  });
}

function createTrashTypeCheckbox(element, map) {
  const div = document.createElement("div");
  div.className = "checkbox-container";
  const smallDiv = document.createElement("div");
  smallDiv.style.display = "flex";
  smallDiv.style.alignItems = "center";
  smallDiv.style.justifyContent = "center";
  smallDiv.style.gap = "5px";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.value = element.id;
  checkbox.id = `checkbox-${element.nome}`;
  checkbox.onclick = () => onCheckboxChange(map);

  const label = document.createElement("label");
  label.className = "checkbox-label";
  label.htmlFor = `checkbox-${element.nome}`;
  label.textContent = element.nome;

  smallDiv.appendChild(checkbox);
  smallDiv.appendChild(label);

  const colorCircle = document.createElement("div");
  colorCircle.style.backgroundColor = element.cor;
  colorCircle.className = "color-circle";

  div.appendChild(smallDiv);
  div.appendChild(colorCircle);
  return div;
}

async function populateCities(map) {
  const responseCity = await fetch("/tipos-cidade");
  const dataCity = await responseCity.json();
  const select = document.getElementById("city-select");
  dataCity.forEach((element) => {
    const option = document.createElement("option");
    option.value = element.id;
    option.textContent = element.nome;
    select.appendChild(option);
  });
  select.addEventListener("change", (event) => onCitySelect(event, map));
}

async function onCheckboxChange(map) {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const selectedValues = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  const detailsDiv = document.getElementById("details-div");
  detailsDiv.innerHTML = "";

  clearMarkers(map);

  if (selectedValues.length > 0) {
    await Promise.all(selectedValues.map(async (selectedValue) => {
      await showTrashDetails(selectedValue, detailsDiv);
    }));

    const selectedCity = document.getElementById("city-select").value;
    //will change. the function will optimized to not make a new request for each selected value and only make one request for all selected values
    // const response = await fetch(`/lugares/${selectedCity}?tipos=${selectedValues}`);
    await Promise.all(selectedValues.map(async (selectedValue) => {
      await addMarkersForTrashType(selectedCity, selectedValue, map);
    }));
  }
}

async function showTrashDetails(selectedValue, detailsDiv) {
  const response = await fetch(`/lixo-detalhes/${selectedValue}`);
  const data = await response.json();
  const div = document.createElement("div");
  div.className = "lixo-details";
  const h2 = document.createElement("h2");
  h2.textContent = data.nome;
  h2.style.color = data.cor;
  const p = document.createElement("p");
  p.textContent = data.descricao;
  div.appendChild(h2);
  div.appendChild(p);
  detailsDiv.appendChild(div);
}

//optmize search | at the moment is making a new request for each selected value even if past values are the same
async function addMarkersForTrashType(selectedCity, selectedValue, map) {
  const response = await fetch(`/lugares/${selectedCity}?tipos=${selectedValue}`);
  const data = await response.json();
  if (data[0] && data[0].lugares) {
    data[0].lugares.forEach((element) => {
      const marker = L.marker([element.latitude, element.longitude]).addTo(map);
      currentMarkers.push(marker);
    });
  }
}

function clearMarkers(map) {
  currentMarkers.forEach(marker => map.removeLayer(marker));
  currentMarkers = [];
}

async function onCitySelect(event, map) {
  const selectedCity = event.target.value;
  clearMarkers(map);
  const response = await fetch(`/tipos-cidade`);
  const data = await response.json();
  const cityData = data.find((city) => city.id == selectedCity);
  if (cityData) {
    map.setView([cityData.latidude, cityData.longitude], 12);
  }
}
