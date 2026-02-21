<?php

namespace App\Controller\Api;

use App\Entity\Video;
use App\Repository\VideoRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class VideoController extends AbstractController
{
    public function __construct(
        private VideoRepository $videoRepository
    ) {}
    #[Route('/api/videos', name: 'api_video')]
    public function getVideos(int $page = 1, int $limit = 5, string $field = "title", string $order = "ASC"): JsonResponse
    {
        $page = (isset($_GET['page'])) ? intval($_GET['page']) : 1;
        $limit = (isset($_GET['limit'])) ? intval($_GET['limit']) : 5;
        $field = $_GET['field'] ?? 'title';
        $order = $_GET['order'] ?? 'ASC';
        $search = $_REQUEST['search'] ?? '';

        $dqlResult = $this->videoRepository->paginate($page, $limit, $field, $order, $search);

        $serializer = \JMS\Serializer\SerializerBuilder::create()->build();
        $videosByPage = $serializer->serialize($dqlResult, 'json');

        $response = [
            "success" => true,
            "data" => json_decode($videosByPage, true)
        ];
        return new JsonResponse($response, 200);
    }
}