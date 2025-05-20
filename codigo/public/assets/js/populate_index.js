document.addEventListener("DOMContentLoaded", async function () {
  const map = L.map("map").setView([-23.5505, -46.6333], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  /*
  const customIcon = L.icon({
    iconUrl: "./assets/images/logo.png", // Path to your custom icon image
    iconSize: [25, 41], // Default size
    iconAnchor: [12, 41], // Anchor point
    popupAnchor: [1, -34], // Popup anchor point
    shadowSize: [41, 41], // Shadow size
  });

  // Use the custom icon for markers
  const marker = L.marker([-19.9570892, -44.034969499999995], {
    icon: customIcon,
  }).addTo(map);*/

  const filterBar = document.getElementById("filter-bar");

  const response = await fetch("/tipos-lixo");
  const data = await response.json();
  data.forEach((element) => {
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
    filterBar.appendChild(div);
  });

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
});

let currentMarkers = [];

onCheckboxChange = (map) => {
  
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const selectedValues = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  const detailsDiv = document.getElementById("details-div");
  detailsDiv.innerHTML = "";

  currentMarkers.forEach(marker => map.removeLayer(marker));
  currentMarkers = [];

  if (selectedValues.length > 0) {
    for (let i = 0; i < selectedValues.length; i++) {
      const selectedValue = selectedValues[i];
      const response = fetch(`/lixo-detalhes/${selectedValue}`);
      response
        .then((res) => res.json())
        .then((data) => {
          
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
        });
    }
    const selectedCity = document.getElementById("city-select").value;
        // Remove old markers
    
    
    for (let i = 0; i < selectedValues.length; i++) {
      const response = fetch(
        `/lugares/${selectedCity}?tipos=${selectedValues[i]}`
      );
      response
        .then((res) => res.json())
        .then((data) => {
          //adicionar div personalizadas aqui
          data[0].lugares.forEach((element) => {
            const marker = L.marker([element.latitude, element.longitude]).addTo(map);
            currentMarkers.push(marker);
          });
        });
    }
  }
};

onCitySelect = (event, map) => {
  const selectedCity = event.target.value;

  const response = fetch(`/tipos-cidade`);
  response
    .then((res) => res.json())
    .then((data) => {
      const cityData = data.find((city) => city.id == selectedCity);
      if (cityData) {
        map.setView([cityData.latidude, cityData.longitude], 12);
      }
    });
};
