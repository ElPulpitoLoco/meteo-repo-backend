<?php

namespace App\Controller;

use App\Service\MeteoService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class MeteoController extends AbstractController
{
    #[Route('/', name: 'api_home', methods: ['GET'])]
    public function index(): JsonResponse
    {
        return $this->json(
            [
                'status' => 'online',
                'message' => 'API Météo active. Utilisez /api/meteo?city=Paris'
            ],
            200,
            [
                'Access-Control-Allow-Origin' => '*',
                'Access-Control-Allow-Methods' => 'GET, OPTIONS',
                'Access-Control-Allow-Headers' => 'Content-Type',
            ]
        );
    }

    #[Route('/api/meteo', name: 'api_meteo', methods: ['GET', 'OPTIONS'])]
    public function getMeteo(Request $request, MeteoService $meteoService): JsonResponse
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

        $city = $request->query->get('city');

        if (!$city) {
            return $this->json(['error' => 'Aucune ville fournie'], 400, $headers);
        }

        $weather = $meteoService->getWeather($city);

        if (isset($weather['error'])) {
            return $this->json(['error' => "Ville introuvable"], 404, $headers);
        }

        return $this->json($weather, 200, $headers);
    }
}