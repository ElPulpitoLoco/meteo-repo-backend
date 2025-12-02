// 🌍 Carte interactive avec leaflet.js *********************************************
document.addEventListener("DOMContentLoaded", function () {
    // Vérifier si l'élément #map existe pour éviter les erreurs
    let mapElement = document.getElementById("map");
    if (!mapElement) return;

    // Récupérer les coordonnées depuis les attributs de l'élément HTML
    let lat = parseFloat(mapElement.getAttribute("data-lat"));
    let lon = parseFloat(mapElement.getAttribute("data-lon"));
    let city = mapElement.getAttribute("data-city") || "Ville inconnue"; // Récupère la ville

    if (isNaN(lat) || isNaN(lon)) {
        console.error("Coordonnées invalides pour la carte.");
        return;
    }

    // Initialiser la carte Leaflet
    let map = L.map("map").setView([lat, lon], 10); // Zoom 10

    // Ajouter le fond de carte OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Ajouter un marqueur sur la position de la ville
    L.marker([lat, lon])
        .addTo(map)
        .bindPopup(`📍 ${city}`)
        .openPopup();
});