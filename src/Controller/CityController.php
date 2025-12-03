<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\HttpClient\HttpClientInterface;

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

    #[Route('/api/city-autocomplete', name: 'api_city_autocomplete', methods: ['GET', 'OPTIONS'])]
    public function autocomplete(Request $request): JsonResponse
    {
        $headers = [
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => 'GET, OPTIONS',
            'Access-Control-Allow-Headers' => 'Content-Type',
        ];

        // Préflight CORS
        if ($request->getMethod() === 'OPTIONS') {
            return new JsonResponse(null, 204, $headers);
        }

        $query = $request->query->get('q');

        if (!$query || strlen($query) < 3) {
            return new JsonResponse([], 200, $headers);
        }

        $url = sprintf(
            '%s/search.json?key=%s&q=%s',
            rtrim($this->baseUrl, '/'),
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