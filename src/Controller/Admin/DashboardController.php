<?php

namespace App\Controller\Admin;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\ExpressionLanguage\Expression;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

final class DashboardController extends AbstractController
{
    #[Route(name: 'admin_root', path: '/')]
    public function home(): Response
    {
        return $this->redirectToRoute('dashboard');
    }
    #[IsGranted(new Expression('is_granted("ROLE_SUPER_ADMIN") or is_granted("ROLE_ADMIN")'))]
    #[Route(name: 'dashboard', path: '/admin')]
    public function index(): Response
    {
        return $this->render('home/index.html.twig', [
            
        ]);
    }
}
