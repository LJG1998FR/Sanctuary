<?php

namespace App\Controller\Api;

use App\Entity\Tag;
use App\Repository\TagRepository;
use JMS\Serializer\SerializerBuilder;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_USER')]
final class TagController extends AbstractController
{
    private const ALLOWED_ORDERS = ['ASC', 'DESC'];
    private const MAX_LIMIT = 100;
    private const DEFAULT_LIMIT = 5;
    public function __construct(
        private TagRepository $tagRepository
    ) {
    }
    
    #[Route('/api/tags', name: 'api_tag')]
    public function getItems(Request $request): JsonResponse
    {
        $serializer = SerializerBuilder::create()->build();
        try {
            // Params validation

            $params = json_decode($request->getContent(), true);
            $page = $this->validate('page', $params['page'] ?? 1);
            $limit = $this->validate('limit', $params['limit'] ?? self::DEFAULT_LIMIT);
            $order = $this->validate('order', $params['order'] ?? 'ASC');
            $search = $this->validate('search', $params['search'] ?? '');

            $dqlResult = $this->tagRepository->paginate($page, $limit, 'name', $order, $search);
            $videosByPage = $serializer->serialize($dqlResult, 'json');

            $response = [
                "success" => true,
                "data" => [
                    "items" => json_decode($videosByPage, true),
                    "page" => $page,
                    "limit" => $limit,
                    "order" => $order,
                    "search" => $search,
                    "limitOptions" => [5, 10, 50],
                    "nb_pages" => ceil(count($this->tagRepository->getItemsByFieldSearch($search)) / $limit)
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

    #[Route('/api/tags/{slugger:tag}', name: 'api_tag_show')]
    public function getItem(Tag $tag): JsonResponse
    {

        $serializer = SerializerBuilder::create()->build();
        $tag = $serializer->serialize($tag, 'json');

        $response = [
            "success" => true,
            "data" => [
                "item" => json_decode($tag, true)
            ]
        ];
        return new JsonResponse($response, 200);
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/api/randomtag', name: 'api_tag_random')]
    public function getRandomItem(): JsonResponse
    {

        $serializer = SerializerBuilder::create()->build();
        $random = $this->tagRepository->findRandom();
        $tag = $serializer->serialize($random, 'json');

        $response = [
            "success" => true,
            "data" => [
                "item" => json_decode($tag, true)
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
