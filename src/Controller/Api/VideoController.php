<?php

namespace App\Controller\Api;

use App\Repository\VideoRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class VideoController extends AbstractController
{
    #[Route('/api/videos', name: 'app_api_videos')]
    public function getVideos(VideoRepository $videoRepository, int $page = 1, int $limit = 5): JsonResponse
    {
        $page = (isset($_GET['page'])) ? intval($_GET['page']) : 1;
        $limit = (isset($_GET['limit'])) ? intval($_GET['limit']) : 5;
        $videos = $videoRepository->paginate($page, $limit);

        $serializer = \JMS\Serializer\SerializerBuilder::create()->build();
        $videosByPage = $serializer->serialize($videos, 'json');

        $response = [
            "success" => true,
            "data" => json_decode($videosByPage)
        ];
        return new JsonResponse($response, 200);
    }
}