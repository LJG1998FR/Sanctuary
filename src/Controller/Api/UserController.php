<?php

namespace App\Controller\Api;

use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use JMS\Serializer\SerializerBuilder;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Validator\Validator\ValidatorInterface;

final class UserController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private UserPasswordHasherInterface $passwordHasher,
        private UserRepository $userRepository,
    ) {}

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

    #[IsGranted('ROLE_USER')]
    #[Route('/api/updateUser', name: 'api_update_user_profile')]
    public function updateUser(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
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

        $userToUpdate = $this->userRepository->findOneBy(['username' => $data['username']]);
        if(!$userToUpdate){
            $response = [
                "success" => false,
                 'error' => [
                    'code' => 'NO_USER',
                    'message' => "This user does not exist."
                ]
            ];
            
            return new JsonResponse($response, 422);
        }

        if(!isset($data['password'])){
            $response = [
                "success" => false,
                'error' => [
                    'code' => 'NO_PASSWORD',
                    'message' => "Missing password."
                ]
            ];
            return new JsonResponse($response, 100);
        } else if(!isset($data['confirmPassword'])){
            $response = [
                "success" => false,
                'error' => [
                    'code' => 'NO_CONFIRM_PASSWORD',
                    'message' => "Please confirm your new password."
                ]
            ];
            return new JsonResponse($response, 100);
        } else if($data['password'] !== $data['confirmPassword']){
            $response = [
                "success" => false,
                'error' => [
                    'code' => 'DIFFERENT_PASSWORDS',
                    'message' => "Both passwords are different."
                ]
            ];
            return new JsonResponse($response, 400);
        }

        $userToUpdate->setPassword($this->passwordHasher->hashPassword($userToUpdate, $data["password"]));
        $this->em->flush();

        $serializer = SerializerBuilder::create()->build();
        $userData = $serializer->serialize($userToUpdate, 'json');
        $userData = json_decode($userData, true);
        $response = [
            "success" => true,
            "data" => [
                "item" => [
                    "username" => $userData["username"]
                ]
            ]
        ];
        return new JsonResponse($response, 200);
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/api/deleteUser', name: 'api_delete_user_profile')]
    public function deleteUser(): JsonResponse
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

        $userToDelete = $this->userRepository->findOneBy(['username' => $user->getUserIdentifier()]);
        if(!$userToDelete){
            $response = [
                "success" => false,
                 'error' => [
                    'code' => 'NO_USER',
                    'message' => "This user does not exist."
                ]
            ];
            
            return new JsonResponse($response, 422);
        } else {
            $this->em->remove($userToDelete);
            $this->em->flush();

            $response = [
                "success" => true,
                "data" => true
            ];
            return new JsonResponse($response, 200);
        }
    }
}
