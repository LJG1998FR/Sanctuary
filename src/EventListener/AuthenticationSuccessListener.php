<?php

namespace App\EventListener;

use Doctrine\ORM\EntityManagerInterface;
//use Gesdinet\JWTRefreshTokenBundle\Entity\RefreshToken;
use App\Entity\RefreshToken;
use Gesdinet\JWTRefreshTokenBundle\Generator\RefreshTokenGeneratorInterface;
use Gesdinet\JWTRefreshTokenBundle\Model\RefreshTokenManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Symfony\Component\Security\Core\User\UserInterface;

class AuthenticationSuccessListener
{
    public function __construct(
        private RefreshTokenGeneratorInterface $refreshTokenGenerator,
        private RefreshTokenManagerInterface $refreshTokenManager,
        private EntityManagerInterface $em,
        private int $refreshTokenTtl,
    ) {}

    public function onAuthenticationSuccessResponse(AuthenticationSuccessEvent $event)
    {

        try {
            $data = $event->getData();
            $user = $event->getUser();

            if (!$user instanceof UserInterface) {
                return;
            }

            $this->revokeOldTokens($user->getUserIdentifier());

            $refreshToken = $this->refreshTokenGenerator->createForUserWithTtl(
                $user,
                $this->refreshTokenTtl
            );

            $this->refreshTokenManager->save($refreshToken);

            $data['refresh_token'] = $refreshToken->getRefreshToken();
            $data['refresh_token_expiration'] = $refreshToken->getValid()->format('c');

            $event->setData($data);
        } catch (\Throwable $e) {
            throw new \RuntimeException('AuthenticationSuccessListener failed: ' . $e->getMessage(), 0, $e);
        }
       
    }

    private function revokeOldTokens(string $username): void
    {
        $oldTokens = $this->em->getRepository(RefreshToken::class)
            ->findBy(['username' => $username]);

        foreach ($oldTokens as $token) {
            $this->em->remove($token);
        }
        $this->em->flush();
    }
}