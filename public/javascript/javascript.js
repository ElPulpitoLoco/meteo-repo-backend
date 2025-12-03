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
document.addEventListener("DOMContentLoaded", function() { // Récupere les elements du DOM
    const searchInput = document.getElementById("city-search");
    const suggestionsContainer = document.getElementById("suggestions-container");

    if (!searchInput || !suggestionsContainer) { // Vérifie si ces éléments existent
        console.error('Élément de recherche ou suggestions introuvable');
        return;
    }

    searchInput.addEventListener("input", function() { // ecouteur d'evenement sur la saisie dans l'input de recherche
        const query = searchInput.value.trim(); // recup et nettoie le contenu de l'input

        if (query.length >= 3) { // si la chaine entrer à au moins 3 caracteres...
            fetch(`/autocomplete?q=${query}`) // envoi la requete au serveur 
                .then(response => response.json()) //convertion de la réponse en JSON
                .then(data => {
                    suggestionsContainer.innerHTML = ""; // reinitialise l'espace contenant les suggestions

                    if (data.length > 0) { // verif que l'on a reçu des suggestions
                        data.forEach(suggestion => { // parcours de chaque suggestions trouvés

                            const { city, country } = suggestion; // Extraction de la ville et du pays
                            const displayText = `${city}, ${country}`;


                            const div = document.createElement("div"); //crée un element pour chaque suggestion
                            div.classList.add("suggestion-item");
                            div.textContent = suggestion;
                            div.addEventListener("click", function() { // quand on click sur une suggestion l'input se rempli et on ferme la liste
                                searchInput.value = suggestion;
                                suggestionsContainer.innerHTML = "";
                            });
                            suggestionsContainer.appendChild(div); // ajout suggestion au controller
                        });

                        suggestionsContainer.style.display = "block"; // Afficher le conteneur des suggestions
                    } else {
                        suggestionsContainer.innerHTML = "<div class='no-suggestions'>Aucune suggestion trouvée</div>";
                    }
                })
                .catch(error => console.error("Erreur lors de l'autocomplétion :", error));
        } else { // si la chaine de recherche trop courte, vide cache des suggestions
            suggestionsContainer.innerHTML = "";
            suggestionsContainer.style.display = "none";
        }
    });

    // Cacher les suggestions si on clique ailleurs
    document.addEventListener("click", function(event) { // verif que l'element cliqué n'appartien pas l'input ou a la liste de suggestion
        if (!searchInput.contains(event.target) && !suggestionsContainer.contains(event.target)) {
            suggestionsContainer.style.display = "none";
        }
    });
});



