<?php

namespace App\Controller\Api;

use App\Repository\VideoRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class VideoController extends AbstractController
{
    #[Route('/api/videos', name: 'app_api_video')]
    public function getVideos(VideoRepository $videoRepository): JsonResponse
    {
        $page = (isset($_GET['page'])) ? intval($_GET['page']) : 1;
        $limit = (isset($_GET['limit'])) ? intval($_GET['limit']) : 5;
        $videosByPage = $videoRepository->paginate($page, $limit);

        return $this->json($videosByPage);
    }
}