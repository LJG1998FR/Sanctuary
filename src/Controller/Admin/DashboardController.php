<?php

namespace App\Controller\Admin;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class DashboardController extends AbstractController
{
    #[Route(name: 'admin_gotodashboard')]
    public function gotoDashboard(): Response
    {
        return $this->redirectToRoute('dashboard');
    }
    
    #[Route(name: 'dashboard', path: '/admin')]
    public function index(): Response
    {
        return $this->render('home/index.html.twig', [
            
        ]);
    }
}
