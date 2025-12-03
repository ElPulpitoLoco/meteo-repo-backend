<?php

namespace App\Controller;

use App\Service\MeteoService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class MeteoController extends AbstractController
{
    // Route par défaut pour vérifier que l'API tourne sur Render
    #[Route('/', name: 'api_home')]
    public function index(): JsonResponse
    {
        return $this->json([
            'status' => 'online', 
            'message' => 'API Météo active. Utilisez /api/meteo?city=Paris'
        ]);
    }

    // La route principale que ton Frontend va appeler
    #[Route('/api/meteo', name: 'api_meteo', methods: ['GET'])]
    public function getMeteo(Request $request, MeteoService $meteoService): JsonResponse
    {
        $city = $request->query->get('city');

        // Headers CORS pour autoriser ton site GitHub Pages
        $headers = [
            'Access-Control-Allow-Origin' => '*', 
            'Access-Control-Allow-Methods' => 'GET',
            'Access-Control-Allow-Headers' => 'Content-Type',
        ];

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