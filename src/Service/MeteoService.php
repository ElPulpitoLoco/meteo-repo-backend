<?php
namespace App\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;

class MeteoService
{
    private HttpClientInterface $httpClient;
    private string $apiKey;
    private string $baseUrl;

    public function __construct(HttpClientInterface $httpClient, string $apiKey, string $baseUrl)
    {
        $this->httpClient = $httpClient;
        $this->apiKey = $apiKey;
        $this->baseUrl = rtrim($baseUrl, '/'); // Supprime le slash final pour éviter les erreurs d'URL
    }

    public function getWeather(string $city): array
    {
        $city = strtoupper($city); // Convertit en majuscules
        
        // Utilisation de `forecast.json` au lieu de `current.json` pour inclure les prévisions
        $url = sprintf(
            "%s/forecast.json?key=%s&q=%s&days=4&lang=fr",
            $this->baseUrl,
            $this->apiKey,
            urlencode($city)
        );

        try {
            $response = $this->httpClient->request('GET', $url);
            return $response->toArray();
        } catch (\Exception $e) {
            return ['error' => "Erreur API : " . $e->getMessage()];
        }
    }
}
?>