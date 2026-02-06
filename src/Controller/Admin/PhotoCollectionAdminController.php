<?php

namespace App\Controller\Admin;

use App\Entity\PhotoCollection;
use App\Form\PhotoCollectionType;
use App\Form\UpdatePhotoCollectionType;
use App\Helper\FileManager;
use App\Repository\PhotoCollectionRepository;
use App\Repository\PhotoRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\String\Slugger\SluggerInterface;

#[IsGranted('ROLE_ADMIN')]
#[Route('/admin/gallery')]
final class PhotoCollectionAdminController extends AbstractController
{
    #[Route(name: 'admin_photo_collection_index', methods: ['GET'])]
    public function index(PhotoCollectionRepository $photoCollectionRepository): Response
    {
        $page = (isset($_GET['page'])) ? intval($_GET['page']) : 1;
        $limit = (isset($_GET['limit'])) ? intval($_GET['limit']) : 5;
        $collectionsByPage = $photoCollectionRepository->paginate($page, $limit);
        return $this->render('photo_collection/index.html.twig', [
            'collections' => $photoCollectionRepository->findAll(),
            'collectionsByPage' => $collectionsByPage,
            'page' => $page,
            'limit' => $limit,
            'nb_pages' => ceil(count($photoCollectionRepository->findAll()) / $limit)
        ]);
    }

    #[Route('/new-collection', name: 'admin_photo_collection_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager, SluggerInterface $slugger, FileManager $fileManager): Response
    {
        $photoCollection = new PhotoCollection();
        $form = $this->createForm(PhotoCollectionType::class, $photoCollection);
        $form->handleRequest($request);

        
        $photoCollection->setCreatedAt(new \DateTimeImmutable());
        $photoCollection->setSlugger($slugger);

        if ($form->isSubmitted() && $form->isValid()) {
            /** @var UploadedFile $cover */
            $cover = $form->get('cover')->getData();

            $newFilename = $fileManager->uploadFile($this->getParameter('covers_directory'), $cover, null, $slugger);
            $photoCollection->setCover($newFilename);          

            $entityManager->persist($photoCollection);
            $entityManager->flush();

            $this->addFlash(
                'gallery_notification',
                'Collection successfully Added!'
            );

            return $this->redirectToRoute('admin_photo_collection_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('photo_collection/new.html.twig', [
            'photo_collection' => $photoCollection,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'admin_photo_collection_show', methods: ['GET'])]
    public function show(PhotoCollection $photoCollection): Response
    {
        return $this->render('photo_collection/show.html.twig', [
            'photo_collection' => $photoCollection,
        ]);
    }

    #[Route('/{id}/edit', name: 'admin_photo_collection_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, PhotoCollection $photoCollection, EntityManagerInterface $entityManager, SluggerInterface $slugger, FileManager $fileManager): Response
    {
        $form = $this->createForm(UpdatePhotoCollectionType::class, $photoCollection);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            /** @var UploadedFile $cover */
            $cover = $form->get('cover')->getData();
            if($cover){
                $newFilename = $fileManager->uploadFile($this->getParameter('covers_directory'), $cover, $photoCollection->getCover(), $slugger);
                $photoCollection->setCover($newFilename);
            }

            $entityManager->flush();

            $this->addFlash(
                'gallery_notification',
                'Collection Successfully Edited!'
            );

            return $this->redirectToRoute('admin_photo_collection_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('photo_collection/edit.html.twig', [
            'photo_collection' => $photoCollection,
            'form' => $form,
        ]);
    }

    #[Route('/update-ranks/{id}', name: 'admin_photo_collection_map_ranks', methods: ['GET', 'POST'])]
    public function mapRanks(Request $request, PhotoCollection $photoCollection, EntityManagerInterface $entityManager, PhotoRepository $photoRepository): Response
    {
        $data = json_decode(file_get_contents('php://input'), true)['ids'];

        foreach ($data as $key => $entry) {
            $photo = $photoRepository->find($entry);
            if($photo){
                $photo->setPosition($key + 1);
            }
        }
        $entityManager->flush();

        $this->addFlash(
            'gallery_notification',
            'Photo Ranks Successfully Mapped'
        );
        return $this->redirectToRoute('admin_photo_collection_show', ['id' => $photoCollection->getId()], Response::HTTP_SEE_OTHER);
    }

    #[Route('/{id}', name: 'admin_photo_collection_delete', methods: ['POST'])]
    public function delete(Request $request, PhotoCollection $photoCollection, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$photoCollection->getId(), $request->getPayload()->getString('_token'))) {
            //remove all asssociated photos files
            $photos = $photoCollection->getPhotos();
            foreach ($photos as $photo) {
                $destination = $this->getParameter('kernel.project_dir').'/public/uploads/photos';
                unlink($destination.'/'.$photo->getFilename());
                $photoCollection->removePhoto($photo);
                $entityManager->remove($photo);
            }

            // remove entity and cover file
            $destination = $this->getParameter('kernel.project_dir').'/public/uploads/covers';
            unlink($destination.'/'.$photoCollection->getCover());
            $entityManager->remove($photoCollection);
            $entityManager->flush();
        }

        $this->addFlash(
            'gallery_notification',
            'Collection successfully Deleted'
        );

        return $this->redirectToRoute('admin_photo_collection_index', [], Response::HTTP_SEE_OTHER);
    }
}
