<?php

namespace App\Controller\Admin;

use App\Entity\Tag;
use App\Form\TagType;
use App\Repository\TagRepository;
use App\Repository\VideoRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\String\Slugger\SluggerInterface;

#[IsGranted('ROLE_ADMIN')]
#[Route('admin/tags')]
final class TagAdminController extends AbstractController
{
    #[Route(name: 'admin_tag_index', methods: ['GET'])]
    public function index(TagRepository $tagRepository, int $page = 1, int $limit = 5): Response
    {
        $page = (isset($_GET['page'])) ? intval($_GET['page']) : 1;
        $limit = (isset($_GET['limit'])) ? intval($_GET['limit']) : 5;
        $tagsByPage = $tagRepository->paginate($page, $limit);
        return $this->render('tag/index.html.twig', [
            'tags' => $tagRepository->findAll(),
            'tagsByPage' => $tagsByPage,
            'page' => $page,
            'limit' => $limit,
            'limitOptions' => [5, 10, 50],
            'nb_pages' => ceil(count($tagRepository->findAll()) / $limit)
        ]);
    }

    #[Route('/new', name: 'admin_tag_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager, SluggerInterface $slugger): Response
    {
        $tag = new Tag();
        $form = $this->createForm(TagType::class, $tag);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $tags = $form->get('name')->getData();
            $tags = explode('|', $tags);
            foreach ($tags as $key => $entry) {
                $newTag = new Tag();
                $newTag->setName($entry);
                $newTag->setSlugger($slugger);
                $entityManager->persist($newTag);
            }

            $entityManager->flush();

            
            $this->addFlash(
                'tag_notification',
                'Tag(s) Successfully Added'
            );

            return $this->redirectToRoute('admin_tag_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('tag/new.html.twig', [
            'tag' => $tag,
            'form' => $form,
        ]);
    }

    #[Route('/{slugger:tag}', name: 'admin_tag_show', methods: ['GET'])]
    public function show(Tag $tag, VideoRepository $videoRepository, int $page = 1, int $limit = 5): Response
    {
        $page = (isset($_GET['page'])) ? intval($_GET['page']) : 1;
        $limit = (isset($_GET['limit'])) ? intval($_GET['limit']) : 5;
        $videosByPage = $videoRepository->paginate($page, $limit);
        
        return $this->render('tag/show.html.twig', [
            'tag' => $tag,
            'videosByPage' => $videosByPage,
            'page' => $page,
            'limit' => $limit,
            'limitOptions' => [5, 10, 50],
            'nb_pages' => ceil(count($videoRepository->findAll()) / $limit)
        ]);
    }

    #[Route('/{id}/edit', name: 'admin_tag_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Tag $tag, EntityManagerInterface $entityManager, SluggerInterface $slugger): Response
    {
        $form = $this->createForm(TagType::class, $tag);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $tag->setSlugger($slugger);
            $entityManager->flush();

            $this->addFlash(
                'tag_notification',
                'Tag Successfully Updated'
            );

            return $this->redirectToRoute('admin_tag_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('tag/edit.html.twig', [
            'tag' => $tag,
            'form' => $form,
        ]);
    }

    #[Route('/update-video-tag/{id}/{video_id}', name: 'admin_tag_update', methods: ['GET', 'POST'])]
    public function updateVideoTag(Request $request, Tag $tag, int $video_id, EntityManagerInterface $entityManager, VideoRepository $videoRepository): JsonResponse
    {

        $video = $videoRepository->find($video_id);
        if(!$video){
            $response = [
                "success" => false,
                "data" => [
                    "errorCode" => -1,
                    "errorMsg" => "No video with the id : " . $video_id . "."
                ]
            ];
            return new JsonResponse($response, 500);
        }

        $tagInVideo = $tag->isTagInVideo($video);
        if($tagInVideo === true){
            $tag->removeVideo($video);
        } else {
            $tag->addVideo($video);
        }
        $entityManager->flush();

        $response = [
            "success" => true,
            "data" => (!$tagInVideo ? "Tag Added : " : "Tag Removed : ") . $tag->getName() . " To Video : " . $video->getTitle()
        ];
        return new JsonResponse($response, 200);
    }

    #[Route('/{id}/delete', name: 'admin_tag_delete', methods: ['POST'])]
    public function delete(Request $request, Tag $tag, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$tag->getId(), $request->getPayload()->getString('_token'))) {
            $entityManager->remove($tag);
            $entityManager->flush();

            $this->addFlash(
                'tag_notification',
                'Tag Successfully Deleted'
            );
        }

        return $this->redirectToRoute('admin_tag_index', [], Response::HTTP_SEE_OTHER);
    }

    #[Route('/deleteSelected', name: 'admin_tag_delete_selected', methods: ['GET', 'POST'])]
    public function deleteSelected(EntityManagerInterface $entityManager, TagRepository $tagRepository): JsonResponse
    {
        $idsToDelete = json_decode(file_get_contents('php://input'), true)['idsToDelete'];

        foreach ($idsToDelete as $key => $id) {
            $tag = $tagRepository->find($id);
            $entityManager->remove($tag);
        }

        $entityManager->flush();

        $this->addFlash(
            'tag_notification',
            'Tags successfully deleted'
        );

        $response = [
            "success" => true,
            "data" => true
        ];
        return new JsonResponse($response, 200);
    }
}
