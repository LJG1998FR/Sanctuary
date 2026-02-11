<?php

namespace App\Controller\Admin;

use App\Entity\Photo;
use App\Entity\PhotoCollection;
use App\Form\PhotoType;
use App\Form\UpdatePhotoType;
use App\Helper\FileManager;
use App\Repository\PhotoRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\String\Slugger\SluggerInterface;

#[IsGranted('ROLE_ADMIN')]
#[Route('/admin/photos')]
final class PhotoAdminController extends AbstractController
{
    #[Route(name: 'admin_photo_index', methods: ['GET'])]
    public function index(PhotoRepository $photoRepository): Response
    {
        $page = (isset($_GET['page'])) ? intval($_GET['page']) : 1;
        $limit = (isset($_GET['limit'])) ? intval($_GET['limit']) : 5;
        $photosByPage = $photoRepository->paginate($page, $limit);
        return $this->render('photo/index.html.twig', [
            'photos' => $photoRepository->findAll(),
            'photosByPage' => $photosByPage,
            'page' => $page,
            'limit' => $limit,
            'nb_pages' => ceil(count($photoRepository->findAll()) / $limit)
        ]);
    }

    #[Route('/{photo_collection_id}/new', name: 'admin_photo_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager, SluggerInterface $slugger, FileManager $fileManager, PhotoRepository $photoRepository, int $photo_collection_id): Response
    {
        //$photoEntity = new Photo();
        //$form = $this->createForm(PhotoType::class);
        //$form->handleRequest($request);
        $photoCollection = $entityManager->getRepository(PhotoCollection::class)->find($photo_collection_id);
        $photoMaxPosition = $photoRepository->findMaxPosition($entityManager, $photoCollection);

        $data = $request->files;

        if($data){
            foreach ($data as $file) {
                $photo = new Photo();

                $newFilename = $fileManager->uploadFile($this->getParameter('photos_directory') . '/' . $photoCollection->getSlugger(), $file, null, $slugger);
                $photo->setFilename($newFilename);
                $photo->setPosition(++$photoMaxPosition);
                $photo->setPhotoCollection($photoCollection);
                $entityManager->persist($photo);
            }
        }
        
        $entityManager->flush();

        $this->addFlash(
            'gallery_notification',
            'Photo(s) Successfully Added'
        );

        return $this->redirectToRoute('admin_photo_collection_show', ['id' => $photoCollection->getId()], Response::HTTP_SEE_OTHER);
        

        /*return $this->render('photo/new.html.twig', [
            'photo' => $photoEntity,
            'form' => $form,
            'photo_collection' => $photoCollection
        ]);*/
    }

    #[Route('/{id}', name: 'admin_photo_show', methods: ['GET'])]
    public function show(Photo $photo): Response
    {
        return $this->render('photo/show.html.twig', [
            'photo' => $photo,
        ]);
    }

    #[Route('/{id}/edit', name: 'admin_photo_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Photo $photo, EntityManagerInterface $entityManager, SluggerInterface $slugger, FileManager $fileManager): JsonResponse
    {
        $form = $this->createForm(UpdatePhotoType::class, $photo);
        $form->handleRequest($request);
        $photoCollection = $photo->getPhotoCollection();

        /** @var UploadedFile $photoFile */
        $photoFile = $request->files->get('photos');
        $newFilename = $fileManager->uploadFile($this->getParameter('photos_directory') . '/' . $photoCollection->getSlugger(), $photoFile, $photo->getFilename(), $slugger);
        $photo->setFilename($newFilename);

        $entityManager->flush();

        $response = [
            "success" => true,
            "data" => [
                "fullpath" => $photoCollection->getSlugger() . "/" . $photo->getFilename(),
            ]
        ];
        return new JsonResponse($response, 200);
    }

    #[Route('/{photo_collection_id}/delete/{id}', name: 'admin_photo_delete', methods: ['POST'])]
    public function delete(Request $request, Photo $photo, EntityManagerInterface $entityManager, int $photo_collection_id): Response
    {
        $photoCollection = $photo->getPhotoCollection();
        if ($this->isCsrfTokenValid('delete'.$photo->getId(), $request->getPayload()->getString('_token'))) {
            $destination = $this->getParameter('kernel.project_dir').'/public/uploads/photos/' . $photoCollection->getSlugger();
            unlink($destination.'/'.$photo->getFilename());
            $entityManager->remove($photo);
            $entityManager->flush();
        }

        $this->addFlash(
            'gallery_notification',
            'Photo Successfully Deleted'
        );

        return $this->redirectToRoute('admin_photo_collection_show', ['id' => $photo_collection_id], Response::HTTP_SEE_OTHER);
    }

    #[Route('/deleteSelected', name: 'admin_photo_delete_selected', methods: ['GET', 'POST'])]
    public function deleteSelected(Request $request, EntityManagerInterface $entityManager, PhotoRepository $photoRepository): JsonResponse
    {
        $idsToDelete = json_decode(file_get_contents('php://input'), true)['idsToDelete'];

        $photoCollection = $photoRepository->find($idsToDelete[0])->getPhotoCollection();

        foreach ($idsToDelete as $key => $id) {
            $photoToDelete = $photoRepository->find($id);
            $destination = $this->getParameter('kernel.project_dir').'/public/uploads/photos/' . $photoCollection->getSlugger();
            unlink($destination.'/'.$photoToDelete->getFilename());
            $entityManager->remove($photoToDelete);
            $entityManager->flush();
        }

        $response = [
            "success" => true,
            "data" => true
        ];
        return new JsonResponse($response, 200);
    }
}
