// la fonction de l'horloge en direct*********************************************
function updateClock() {
    let clockElement = document.getElementById("live-clock");

    // Si l'élément live-clock n'existe pas, on arrête la fonction
    if (!clockElement) return;

    // Récupérer le fuseau horaire de la ville
    let timezone = clockElement.getAttribute("data-timezone");

    // Créer un objet Date avec l'heure locale de la ville
    let options = { timeZone: timezone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    let formatter = new Intl.DateTimeFormat('fr-FR', options);

    // Mettre à jour l'affichage
    clockElement.textContent = formatter.format(new Date());
}
setInterval(updateClock, 1000);// Mettre à jour l'horloge chaque seconde
updateClock();// Initialiser l'horloge immédiatement



//fct pour l'autocompletion avec AJAX *******************************************
document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("city-search");
    const suggestionsContainer = document.getElementById("suggestions-container");

    if (!searchInput || !suggestionsContainer) {
        console.error('Élément de recherche ou suggestions introuvable');
        return;
    }

    searchInput.addEventListener("input", function() {
        const query = searchInput.value.trim();

        if (query.length >= 2) {
            fetch(`/autocomplete?q=${query}`)
                .then(response => response.json())
                .then(data => {
                    suggestionsContainer.innerHTML = "";

                    if (data.length > 0) {
                        data.forEach(suggestion => {

                            const { city, country } = suggestion; // Extraction de la ville et du pays
                            const displayText = `${city}, ${country}`;


                            const div = document.createElement("div");
                            div.classList.add("suggestion-item");
                            div.textContent = suggestion;
                            div.addEventListener("click", function() {
                                searchInput.value = suggestion;
                                suggestionsContainer.innerHTML = "";
                            });
                            suggestionsContainer.appendChild(div);
                        });

                        // Afficher le conteneur des suggestions
                        suggestionsContainer.style.display = "block";
                    } else {
                        suggestionsContainer.innerHTML = "<div class='no-suggestions'>Aucune suggestion trouvée</div>";
                    }
                })
                .catch(error => console.error("Erreur lors de l'autocomplétion :", error));
        } else {
            suggestionsContainer.innerHTML = "";
            suggestionsContainer.style.display = "none";
        }
    });

    // Cacher les suggestions si on clique ailleurs
    document.addEventListener("click", function(event) {
        if (!searchInput.contains(event.target) && !suggestionsContainer.contains(event.target)) {
            suggestionsContainer.style.display = "none";
        }
    });
});



