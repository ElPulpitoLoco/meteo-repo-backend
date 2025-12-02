document.addEventListener("DOMContentLoaded", function () {
    if (typeof hourlyData === "undefined") {
        console.error("Les données météo ne sont pas disponibles !");
        return;
    }

    let hours = hourlyData.map(hour => hour.time.split(" ")[1]); // Extraire HH:mm
    let temperatures = hourlyData.map(hour => hour.temp_c);
    let windSpeeds = hourlyData.map(hour => hour.wind_kph);
    let precipitation = hourlyData.map(hour => hour.precip_mm);
    let humidity = hourlyData.map(hour => hour.humidity);
    let cloudCoverage = hourlyData.map(hour => hour.cloud);

    let ctx = document.getElementById("hourlyWeatherChart").getContext("2d");

    new Chart(ctx, {
        type: "line",
        data: {
            labels: hours,
            datasets: [
                {
                    label: "Température (°C)",
                    data: temperatures,
                    borderColor: "blue",
                    backgroundColor: "rgba(0, 0, 255, 0.2)",
                    fill: true,
                    yAxisID: "yTemp"
                },
                {
                    label: "Vent (km/h)",
                    data: windSpeeds,
                    borderColor: "red",
                    backgroundColor: "rgba(255, 0, 0, 0.2)",
                    fill: false,
                    yAxisID: "yWind"
                },
                {
                    label: "Précipitations (mm)",
                    data: precipitation,
                    type: "bar",
                    backgroundColor: "rgba(0, 128, 255, 0.5)",
                    yAxisID: "yPrecip"
                },
                {
                    label: "Humidité (%)",
                    data: humidity,
                    borderColor: "green",
                    backgroundColor: "rgba(0, 255, 0, 0.2)",
                    fill: false,
                    yAxisID: "yHumidity"
                },
                {
                    label: "Nuages (%)",
                    data: cloudCoverage,
                    borderColor: "gray",
                    backgroundColor: "rgba(128, 128, 128, 0.2)",
                    fill: false,
                    yAxisID: "yCloud"
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: { 
                    title: { display: true, text: "Heure" } 
                },
                yTemp: { 
                    title: { display: true, text: "Température (°C)" }, 
                    position: "left",
                    ticks: {
                        stepSize: 2,  // Afficher une graduation tous les 2°C
                        maxTicksLimit: 6  // Limiter le nombre de ticks affichés
                    }
                },
                yWind: { 
                    title: { display: true, text: "Vent (km/h)" }, 
                    position: "right", 
                    grid: { drawOnChartArea: false },
                    ticks: {
                        stepSize: 5,  // Afficher une graduation tous les 5 km/h
                        maxTicksLimit: 5
                    }
                },
                yPrecip: { 
                    title: { display: true, text: "Précipitations (mm)" }, 
                    position: "right", 
                    grid: { drawOnChartArea: false },
                    ticks: {
                        stepSize: 1,  // Graduation tous les 1 mm de pluie
                        maxTicksLimit: 5
                    }
                },
                yHumidity: { 
                    title: { display: true, text: "Humidité (%)" }, 
                    position: "left", 
                    grid: { drawOnChartArea: false },
                    ticks: {
                        stepSize: 10,  // Graduation tous les 10%
                        maxTicksLimit: 5
                    }
                },
                yCloud: { 
                    title: { display: true, text: "Nuages (%)" }, 
                    position: "right", 
                    grid: { drawOnChartArea: false },
                    ticks: {
                        stepSize: 20,  // Graduation tous les 20%
                        maxTicksLimit: 5
                    }
                }
            }
        }
        
    });
});


//Explication & Résumé
//✔ On extrait les heures (HH:mm) et températures depuis weather.forecast.forecastday[0].hour.
//✔ On utilise Chart.js pour créer un graphique linéaire.
//✔ On affiche un dégradé bleu sous la courbe pour une meilleure visualisation.