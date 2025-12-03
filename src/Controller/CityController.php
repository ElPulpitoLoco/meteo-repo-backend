<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class CityController extends AbstractController
{
    private HttpClientInterface $httpClient;
    private string $apiKey;
    private string $baseUrl;

    public function __construct(HttpClientInterface $httpClient, ParameterBagInterface $params)
    {
        $this->httpClient = $httpClient;
        $this->apiKey = $params->get('app.meteo_api_key');
        $this->baseUrl = $params->get('app.meteo_base_url');
    }

    #[Route('/api/city-autocomplete', name: 'api_city_autocomplete', methods: ['GET'])]
    public function autocomplete(Request $request): JsonResponse
    {
        $query = $request->query->get('q');
        
        $headers = [
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => 'GET'
        ];

        if (!$query || strlen($query) < 3) {
            return new JsonResponse([], 200, $headers);
        }

        // Attention: WeatherAPI utilise search.json
        $url = sprintf(
            "%s/search.json?key=%s&q=%s",
            $this->baseUrl,
            $this->apiKey,
            urlencode($query)
        );

        try {
            $response = $this->httpClient->request('GET', $url);
            $data = $response->toArray();

            $suggestions = [];
            foreach ($data as $city) {
                $suggestions[] = $city['name'] . ', ' . $city['country'];
            }

            return new JsonResponse($suggestions, 200, $headers);
        } catch (\Exception $e) {
            return new JsonResponse([], 200, $headers);
        }
    }
}