<?php

namespace App\Controller;

use App\Service\MeteoService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MeteoController extends AbstractController
{
    #[Route('/meteo', name: 'app_meteo')]
public function index(Request $request, MeteoService $meteoService): Response
{
    $city = $request->query->get('city', null); // Ne pas mettre de ville par défaut
    $weather = null;
    $errorMessage = null;

    if ($city) {
        $weather = $meteoService->getWeather($city);
        if (isset($weather['error'])) { // Si une erreur est présente dans la réponse de l'API
            $errorMessage = "La ville '$city' n'a pas pu être trouvée. Vérifiez l'orthographe.";
            $weather = null; // Effacer les données météo pour éviter d'afficher des informations incorrectes
        }
    }

    return $this->render('meteo/index.html.twig', [
        'city' => $city,
        'weather' => $weather,
        'errorMessage' => $errorMessage, // Passer l'erreur au template
    ]);
}



    #[Route('/test-api', name: 'test_api')] //pour visualiser le JSON
    public function testApi(MeteoService $meteoService): Response
    {
        $weather = $meteoService->getWeather('Paris'); //avec Paris en example

        return new Response('<pre>' . print_r($weather, true) . '</pre>');
    }
}
?>