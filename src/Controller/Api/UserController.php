<?php

namespace App\Controller\Api;

use JMS\Serializer\SerializerBuilder;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

final class UserController extends AbstractController
{
    #[IsGranted('ROLE_USER')]
    #[Route('/api/profile', name: 'api_user_profile')]
    public function index(): JsonResponse
    {
        $user = $this->getUser();
        if(!$user){
            $response = [
                "success" => false,
                 'error' => [
                    'code' => 'INVALID_PARAMETER',
                    'message' => "No user"
                ]
            ];

            
            return new JsonResponse($response, 401);
        }

        $serializer = SerializerBuilder::create()->build();
        $userData = [
            "username" => $user->getUserIdentifier()
        ];
        $userData = $serializer->serialize($userData, 'json');
        $response = [
            "success" => true,
            "data" => [
                "item" => json_decode($userData, true)
            ]
        ];
        return new JsonResponse($response, 200);
    }
}
