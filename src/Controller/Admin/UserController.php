<?php

namespace App\Controller\Admin;

use App\Entity\User;
use App\Form\UserType;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_SUPER_ADMIN')]
#[Route('/admin/users')]
final class UserController extends AbstractController
{
    #[Route(name: 'admin_user_index', methods: ['GET'])]
    public function index(UserRepository $userRepository, int $page = 1, int $limit = 5): Response
    {
        $page = $_GET['page'] ?? 1;
        $limit = $_GET['limit'] ?? 5;
        $field = $_GET['field'] ?? 'username';
        $order = $_GET['order'] ?? 'ASC';
        $search = $_REQUEST['search'] ?? '';

        $usersByPage = $userRepository->paginate($page, $limit, $field, $order, $search);

        return $this->render('user/index.html.twig', [
            'videos' => $userRepository->findAll(),
            'usersByPage' => $usersByPage,
            'page' => $page,
            'limit' => $limit,
            'field' => $field,
            'order' => $order,
            'search' => $search,
            'limitOptions' => [5, 10, 50],
            'nb_pages' => ceil(count($userRepository->getItemsByFieldSearch($search)) / $limit)
        ]);
    }

    #[Route('/new', name: 'admin_user_new', methods: ['GET', 'POST'])]
    public function new(Request $request,  UserPasswordHasherInterface $userPasswordHasher, EntityManagerInterface $entityManager): Response
    {
        $user = new User();
        $form = $this->createForm(UserType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            /** @var string $plainPassword */
            $plainPassword = $form->get('password')->getData();
            $user->setPassword($userPasswordHasher->hashPassword($user, $plainPassword));

            $userType = 2;
            if(in_array("ROLE_SUPER_ADMIN", $form->get('roles')->getData())){
                $userType = 0;
            } else if(in_array("ROLE_ADMIN", $form->get('roles')->getData())){
                $userType = 1;
            }
            $user->setUserType($userType);

            $entityManager->persist($user);
            $entityManager->flush();

            $this->addFlash(
                'user_notification',
                'User successfully Added'
            );

            return $this->redirectToRoute('admin_user_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('user/new.html.twig', [
            'user' => $user,
            'form' => $form,
        ]);
    }

    #[Route('/{id}/edit', name: 'admin_user_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request,  UserPasswordHasherInterface $userPasswordHasher, User $user, EntityManagerInterface $entityManager): Response
    {
        if($this->getUser() === $user){
            return $this->redirectToRoute('admin_user_index', [], Response::HTTP_SEE_OTHER);
        }
        $form = $this->createForm(UserType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $plainPassword = $form->get('password')->getData();
            if(isset($plainPassword)){
                $user->setPassword($userPasswordHasher->hashPassword($user, $plainPassword));
            }

            $userType = 2;
            if(in_array("ROLE_SUPER_ADMIN", $form->get('roles')->getData())){
                $userType = 0;
            } else if(in_array("ROLE_ADMIN", $form->get('roles')->getData())){
                $userType = 1;
            }
            $user->setUserType($userType);

            $entityManager->flush();

            $this->addFlash(
                'user_notification',
                'User successfully edited'
            );

            return $this->redirectToRoute('admin_user_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('user/edit.html.twig', [
            'user' => $user,
            'form' => $form,
        ]);
    }

    #[Route('/{id}/delete', name: 'admin_user_delete', methods: ['POST'])]
    public function delete(Request $request, User $user, EntityManagerInterface $entityManager): Response
    {
        if($this->getUser() === $user){
            return $this->redirectToRoute('admin_user_index', [], Response::HTTP_SEE_OTHER);
        }
        if ($this->isCsrfTokenValid('delete'.$user->getId(), $request->getPayload()->getString('_token'))) {
            $entityManager->remove($user);
            $entityManager->flush();

            $this->addFlash(
                'user_notification',
                'User successfully deleted'
            );
        }

        return $this->redirectToRoute('admin_user_index', [], Response::HTTP_SEE_OTHER);
    }

    #[Route('/deleteSelected', name: 'admin_user_delete_selected', methods: ['GET', 'POST'])]
    public function deleteSelected(EntityManagerInterface $entityManager, UserRepository $userRepository): JsonResponse
    {
        $idsToDelete = json_decode(file_get_contents('php://input'), true)['idsToDelete'];

        foreach ($idsToDelete as $key => $id) {
            $user = $userRepository->find($id);
            if($this->getUser() === $user){
                continue;
            }
            $entityManager->remove($user);
            $entityManager->flush();
        }

        $this->addFlash(
            'user_notification',
            'Users successfully deleted'
        );

        $response = [
            "success" => true,
            "data" => true
        ];
        return new JsonResponse($response, 200);
    }
}
