<?php

namespace App\Controller\Api;

use App\Entity\Video;
use App\Repository\VideoRepository;
use JMS\Serializer\SerializerBuilder;
use JMS\Serializer\Serializer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

final class VideoController extends AbstractController
{
    private const ALLOWED_FIELDS = ['title', 'createdAt'];
    private const ALLOWED_ORDERS = ['ASC', 'DESC'];
    private const MAX_LIMIT = 100;
    private const DEFAULT_LIMIT = 5;
    public function __construct(
        private VideoRepository $videoRepository
    ) {
    }
    #[IsGranted('ROLE_USER')]
    #[Route('/api/videos', name: 'api_video')]
    public function getItems(Request $request): JsonResponse
    {
        $serializer = SerializerBuilder::create()->build();
        try {
            // Params validation

            $params = json_decode($request->getContent(), true);
            $page = $this->validate('page', $params['page'] ?? 1);
            $limit = $this->validate('limit', $params['limit'] ?? self::DEFAULT_LIMIT);
            $field = $this->validate('field', $params['field'] ?? 'title');
            $order = $this->validate('order', $params['order'] ?? 'ASC');
            $search = $this->validate('search', $params['search'] ?? '');

            $dqlResult = $this->videoRepository->paginate($page, $limit, $field, $order, $search);
            $videosByPage = $serializer->serialize($dqlResult, 'json');

            $response = [
                "success" => true,
                "data" => [
                    "items" => json_decode($videosByPage, true),
                    "page" => $page,
                    "limit" => $limit,
                    "field" => $field,
                    "order" => $order,
                    "search" => $search,
                    "limitOptions" => [5, 10, 50],
                    "nb_pages" => ceil(count($this->videoRepository->getItemsByFieldSearch($search)) / $limit)
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

    #[IsGranted('ROLE_USER')]
    #[Route('/api/videos/{slugger:video}', name: 'api_video_show')]
    public function getItem(Video $video): JsonResponse
    {

        $serializer = SerializerBuilder::create()->build();
        $video = $serializer->serialize($video, 'json');

        $response = [
            "success" => true,
            "data" => [
                "item" => json_decode($video, true)
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