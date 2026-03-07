<?php

namespace App\Controller\Admin;

use App\Entity\User;
use App\Form\MyProfileType;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

final class MyProfileController extends AbstractController
{
    #[Route('/admin/profile', name: 'admin_profile')]
    public function index(Request $request,  UserPasswordHasherInterface $userPasswordHasher, UserRepository $userRepository, EntityManagerInterface $entityManager): Response
    {
        $user = $userRepository->findOneBy(["username" => $this->getUser()->getUserIdentifier()]);
        $form = $this->createForm(MyProfileType::class, $user);
        $form->handleRequest($request);

        $response = [
            "success" => true,
            "data" => true
        ];
        $flashMsgType = 'user_notification'; 
        $flashMsg = 'Changes Saved.';

        if ($form->isSubmitted() && $form->isValid()) {
            $password = $form->get('password')->getData();
            $confirmPassword = $form->get('confirmPassword')->getData();

            if (isset($password) && !isset($confirmPassword)) {
                $response = [
                    "success" => false,
                    "error" => [
                        "code" => -1,
                        "msg" => "Please enter a confirm password."
                    ]
                ];
                $flashMsgType = 'user_error_msg'; 
                $flashMsg = 'Please enter a confirm password.';
            } else if($password !== $confirmPassword) {
                $response = [
                    "success" => false,
                    "error" => [
                        "code" => -2,
                        "msg" => "Both passwords are different."
                    ]
                ];
                $flashMsgType = 'user_error_msg'; 
                $flashMsg = 'Both passwords are different.';
            } else {
                if(isset($password)){
                    $user->setPassword($userPasswordHasher->hashPassword($user, $password));
                }
                $flashMsgType = 'user_notification'; 
                $flashMsg = 'Changes Saved.';

                $response = [
                    "success" => true,
                    "data" => true
                ];
            }

            $entityManager->flush();

            $this->addFlash(
                $flashMsgType,
                $flashMsg
            );
        }

        return $this->render('profile/index.html.twig', [
            'form' => $form
        ], new Response(null, $response["success"] === false ? 422 : 200));
    }
}
