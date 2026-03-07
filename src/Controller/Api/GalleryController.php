<?php

namespace App\Controller\Api;

use App\Entity\PhotoCollection;
use App\Repository\PhotoCollectionRepository;
use App\Repository\PhotoRepository;
use JMS\Serializer\SerializerBuilder;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

final class GalleryController extends AbstractController
{    
    private const ALLOWED_FIELDS = ['title', 'createdAt'];
    private const ALLOWED_ORDERS = ['ASC', 'DESC'];
    private const MAX_LIMIT = 100;
    private const DEFAULT_LIMIT = 5;
    public function __construct(
        private PhotoCollectionRepository $photoCollectionRepository,
        private PhotoRepository $photoRepository
    ) {}
    #[Route('/api/gallery', name: 'api_gallery')]
    public function getItems(Request $request): JsonResponse
    {
        $serializer = SerializerBuilder::create()->build();
        try {
            // Params validation
            $page = $this->validate('page', $request->query->getInt('page', 1));
            $limit = $this->validate('limit', $request->query->getInt('limit', self::DEFAULT_LIMIT));
            $field = $this->validate('field', $request->query->getString('field', 'title'));
            $order = $this->validate('order', $request->query->getString('order', 'ASC'));
            $search = $this->validate('search', $request->query->getString('search', ''));

            $dqlResult = $this->photoCollectionRepository->paginate($page, $limit, $field, $order, $search);
            $res = [];
            foreach ($dqlResult as $key => $entry) {

                $res[] = [
                    "id" => $entry->getId(),
                    "title" => $entry->getTitle(),
                    "cover" => $entry->getCover(),
                    "created_at" => $entry->getCreatedAt(),
                    "slugger" => $entry->getSlugger(),
                    "photos" => $this->photoRepository->sortByPosition($entry)
                ];
            }
            $collections = $serializer->serialize($res, 'json');

            $response = [
                "success" => true,
                "data" => [
                    "items" => json_decode($collections, true),
                    "page" => $page,
                    "limit" => $limit,
                    "field" => $field,
                    "order" => $order,
                    "search" => $search,
                    "limitOptions" => [5, 10, 50],
                    "nb_pages" => ceil(count($this->photoCollectionRepository->getItemsByFieldSearch($search)) / $limit)
                ]
            ];
            return new JsonResponse($response, 200);

        } catch (\InvalidArgumentException $e) {

            return new JsonResponse([
                'success' => false,
                'error' => [
                    'code' => 'INVALID_PARAMETER',
                    'message' => $e->getMessage()
                ]
            ], 400);

        }
    }

    #[Route('/api/gallery/{id}', name: 'api_gallery_show')]
    public function getItem(PhotoCollection $photoCollection): JsonResponse
    {
        $serializer = SerializerBuilder::create()->build();
        $result = [ 
            "id" => $photoCollection->getId(),
            "title" => $photoCollection->getTitle(),
            "cover" => $photoCollection->getCover(),
            "created_at" => $photoCollection->getCreatedAt(),
            "slugger" => $photoCollection->getSlugger(),
            "photos" => $this->photoRepository->sortByPosition($photoCollection)
        ];
        $photoCollection = $serializer->serialize($result, 'json');

        $response = [
            "success" => true,
            "data" => [
                "item" => json_decode($photoCollection, true)
            ]
        ];
        return new JsonResponse($response, 200);
    }

    #[Route('/api/randomcollection', name: 'api_gallery_random')]
    public function getRandomItem(): JsonResponse
    {

        $serializer = SerializerBuilder::create()->build();
        $random = $this->photoCollectionRepository->findRandom();
        $collection = $serializer->serialize($random, 'json');

        $response = [
            "success" => true,
            "data" => [
                "item" => json_decode($collection, true)
            ]
        ];
        return new JsonResponse($response, 200);
    }

    
    public function validate($label, $value) : mixed {
        switch ($label) {
            case 'page':
                if ($value < 1) {
                    throw new \InvalidArgumentException('The page number must be strictly positive. (>= 1)');
                }
                break;
            case 'limit':
                if ($value < 1) {
                    throw new \InvalidArgumentException('The limit must be strictly positive. (>= 1)');
                }
                if ($value > self::MAX_LIMIT) {
                    throw new \InvalidArgumentException(
                        sprintf('The limit cannot be more than %d', self::MAX_LIMIT)
                    );
                }
                break;
            case 'field':
                if (!in_array($value, self::ALLOWED_FIELDS, true)) {
                    throw new \InvalidArgumentException(
                        sprintf('Unauthorized field. Valid fields : %s', implode(', ', self::ALLOWED_FIELDS))
                    );
                }
                break;
            case 'order':
                $order = strtoupper($value);
                if (!in_array($order, self::ALLOWED_ORDERS, true)) {
                    throw new \InvalidArgumentException(
                        sprintf('Unauthorized order. Valid orders: %s', implode(', ', self::ALLOWED_ORDERS))
                    );
                }
                break;
            case 'search':
                $search = trim($value);
                if (strlen($search) > 255) {
                    throw new \InvalidArgumentException('Search term must be under 255 characters.');
                }
                break;

        }
        return $value;
    }
}