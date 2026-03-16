<?php

namespace App\Controller\Api;

use App\Repository\PhotoCollectionRepository;
use App\Repository\PhotoRepository;
use App\Repository\TagRepository;
use App\Repository\VideoRepository;
use JMS\Serializer\SerializerBuilder;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

final class SearchController extends AbstractController
{
    public function __construct(
        private PhotoCollectionRepository $photoCollectionRepository,
        private PhotoRepository $photoRepository,
        private VideoRepository $videoRepository,
        private TagRepository $tagRepository
    ) {}

    #[Route('/api/search', name: 'api_search')]
    public function index(Request $request): JsonResponse
    {
        try {
            $serializer = SerializerBuilder::create()->build();
            $params = json_decode($request->getContent(), true);
            $search = $params['search'];

            $gallerySearch = $this->photoCollectionRepository->getItemsByFieldSearch($search);
            $galleryResult = [];
            foreach ($gallerySearch as $key => $entry) {

                $galleryResult[] = [
                    "id" => $entry->getId(),
                    "title" => $entry->getTitle(),
                    "cover" => $entry->getCover(),
                    "created_at" => $entry->getCreatedAt(),
                    "slugger" => $entry->getSlugger(),
                    "photos" => $this->photoRepository->sortByPosition($entry)
                ];
            }

            $videosSearch = $this->videoRepository->getItemsByFieldSearch($search);
            $videosResult = $serializer->serialize($videosSearch, 'json');

            $tagsSearch = $this->tagRepository->getItemsByFieldSearch($search);
            $tagsResult = $serializer->serialize($tagsSearch, 'json');

            $response = [
                "success" => true,
                "data" => [
                    "gallery" => $galleryResult,
                    "videos" => json_decode($videosResult, true),
                    "tags" => json_decode($tagsResult, true)
                ]
            ];
            return new JsonResponse($response, 200);
        } catch (\Throwable $th) {
            return new JsonResponse([
                'success' => false,
                'error' => [
                    'code' => 'INVALID_PARAMETER',
                    'message' => $th->getMessage()
                ]
            ], 400);
        }

    }
}
