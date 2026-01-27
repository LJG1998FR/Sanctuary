<?php

namespace App\Controller\Admin;

use App\Entity\Video;
use App\Form\UpdateVideoType;
use App\Form\VideoType;
use App\Repository\VideoRepository;
use App\Helper\FileManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;

#[Route('admin/videos')]
final class VideoAdminController extends AbstractController
{
    #[Route(name: 'admin_video_index', methods: ['GET'])]
    public function index(VideoRepository $videoRepository): Response
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');
        return $this->render('video/index.html.twig', [
            'videos' => $videoRepository->findAll(),
        ]);
    }

    #[Route('/new', name: 'admin_video_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager, SluggerInterface $slugger, FileManager $fileManager): Response
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');
        $video = new Video();
        $form = $this->createForm(VideoType::class, $video);
        $form->handleRequest($request);

        $video->setCreatedAt(new \DateTimeImmutable());
        $video->setSlugger($slugger);

        if ($form->isSubmitted() && $form->isValid()) {

            /** @var UploadedFile $videoFile */
            /** @var UploadedFile $thumbnailFile */
            $videoFile = $form->get('filename')->getData();
            $thumbnailFile = $form->get('thumbnailname')->getData();

            $video->setSlugger($slugger);
            $newFilename = $fileManager->uploadFile($this->getParameter('videos_directory'), $videoFile, $video->getFilename(), $slugger);
            $video->setFilename($newFilename);

            if($thumbnailFile) {
                $newThumbnailFilename = $fileManager->uploadFile($this->getParameter('thumbnails_directory'), $thumbnailFile, $video->getThumbnailname(), $slugger);
                $video->setThumbnailname($newThumbnailFilename);
            }

            $entityManager->persist($video);
            $entityManager->flush();

            return $this->redirectToRoute('admin_video_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('video/new.html.twig', [
            'video' => $video,
            'form' => $form,
            'page_name' => 'Add A Video'
        ]);
    }

    #[Route('/{id}', name: 'admin_video_show', methods: ['GET'])]
    public function show(Video $video): Response
    {
        $this->denyAccessUnlessGranted('ROLE_USER');
        return $this->render('video/show.html.twig', [
            'video' => $video,
        ]);
    }

    #[Route('/{id}/edit', name: 'admin_video_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Video $video, EntityManagerInterface $entityManager, SluggerInterface $slugger, FileManager $fileManager): Response
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');
        $form = $this->createForm(UpdateVideoType::class, $video);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $video->setSlugger($slugger);

            /** @var UploadedFile $videoFile */
            /** @var UploadedFile $thumbnailFile */
            $videoFile = $form->get('filename')->getData();
            $thumbnailFile = $form->get('thumbnailname')->getData();

            if($videoFile) {
                $newFilename = $fileManager->uploadFile($this->getParameter('videos_directory'), $videoFile, $video->getFilename(), $slugger);
                $video->setFilename($newFilename);
            }

            if($thumbnailFile) {
                $newThumbnailFilename = $fileManager->uploadFile($this->getParameter('thumbnails_directory'), $thumbnailFile, $video->getThumbnailname(), $slugger);
                $video->setThumbnailname($newThumbnailFilename);
            }

            $entityManager->persist($video);
            $entityManager->flush();

            return $this->redirectToRoute('admin_video_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('video/edit.html.twig', [
            'video' => $video,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'admin_video_delete', methods: ['POST'])]
    public function delete(Request $request, Video $video, EntityManagerInterface $entityManager): Response
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');
        if ($this->isCsrfTokenValid('delete'.$video->getId(), $request->getPayload()->getString('_token'))) {
            $destination = $this->getParameter('kernel.project_dir').'/public/uploads/videos';
            unlink($destination.'/'.$video->getFilename());
            $entityManager->remove($video);
            $entityManager->flush();
        }

        return $this->redirectToRoute('admin_video_index', [], Response::HTTP_SEE_OTHER);
    }
}
