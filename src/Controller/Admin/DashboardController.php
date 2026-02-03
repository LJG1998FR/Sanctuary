<?php

namespace App\Controller\Admin;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

//#[Route('admin')]
final class DashboardController extends AbstractController
{
    #[Route(name: 'admin_gotodashboard')]
    public function gotoDashboard(): Response
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');
        return $this->redirectToRoute('dashboard');
    }
    
    #[Route(name: 'dashboard', path: '/admin')]
    public function index(): Response
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');
        return $this->render('home/index.html.twig', [
            
        ]);
    }
}
