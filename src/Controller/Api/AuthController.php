<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Gesdinet\JWTRefreshTokenBundle\Model\RefreshTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api', name: 'api_auth_')]
class AuthController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private UserPasswordHasherInterface $passwordHasher,
        private ValidatorInterface $validator,
        private UserRepository $userRepository,
    ) {}

    #[Route('/register', name: 'register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if(!isset($data['username'])){
            return $this->json(
                ['error' => 'Username missing.'],
                100
            );
        } else if(!isset($data['password'])){
            return $this->json(
                ['error' => 'Password missing.'],
                100
            );
        } else if(!isset($data['confirmPassword'])){
            return $this->json(
                ['error' => 'Please confirm your password.'],
                100
            );
        } else if($data['password'] !== $data['confirmPassword']){
            return $this->json(
                ['error' => 'Both passwords are different.'],
                Response::HTTP_BAD_REQUEST
            );
        }

        if ($this->userRepository->findOneBy(['username' => $data['username']])) {
            return $this->json(
                ['error' => 'Username is already taken.'],
                Response::HTTP_CONFLICT
            );
        }

        $user = new User();
        $user->setUsername($data['username']);
        $user->setPassword($data['password']);

        $errors = $this->validator->validate($user, null, ['Default', 'registration']);

        if (count($errors) > 0) {
            $formatted = [];
            foreach ($errors as $error) {
                $formatted[$error->getPropertyPath()] = $error->getMessage();
            }
            return $this->json(['errors' => $formatted], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $user->setPassword(
            $this->passwordHasher->hashPassword($user, $user->getPassword())
        );

        $this->em->persist($user);
        $this->em->flush();

        return $this->json(
            ['message' => 'User account successfully added.'],
            Response::HTTP_CREATED
        );
    }

    #[Route('/logout', name: 'logout', methods: ['POST'])]
    public function logout(Request $request, RefreshTokenManagerInterface $refreshTokenManager): JsonResponse {
        $data = $request->request->all();
        $tokenString = $data['refresh_token'] ?? null;

        if (!$tokenString) {
            return $this->json(['error' => 'Missing refresh token'], Response::HTTP_BAD_REQUEST);
        }

        $refreshToken = $refreshTokenManager->get($tokenString);

        if (!$refreshToken) {
            return $this->json(['error' => 'Invalid token'], Response::HTTP_NOT_FOUND);
        }

        $refreshTokenManager->delete($refreshToken);

        return $this->json(['message' => 'Logout successful'], Response::HTTP_OK);
    }
}