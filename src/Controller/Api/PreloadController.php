<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class PreloadController extends AbstractController
{
    #[Route('/api/preloadAssets', name: 'api_preload_assets')]
    public function preload(): JsonResponse
    {
        $folders = [$this->getParameter('covers_directory'), $this->getParameter('defaults_directory'), $this->getParameter('photos_directory'), $this->getParameter('thumbnails_directory')];
        
        $data = [];
		foreach ($folders as $folder) {
			$files = $this->getAllFiles($folder);
			sort($files);
			foreach ($files as $key => $file) {
				$data[] = $file;
			}
		}

		if($data == null){
			$response = [
				"success" => false,
				"data" => [
					"errorCode" => -1,
					"errorMessage" => "No data"
				]
			];
            return new JsonResponse($response, 200);
		}

		$response = [
			"success" => true,
			"data" => $data,
		];
        return new JsonResponse($response, 200);
    }


    //helper function to recursively loop through the public folders
    public function getAllFiles($dir){
		$result = [];
		$cdir = scandir($dir);
		unset($cdir[array_search('.', $cdir, true)]);
		unset($cdir[array_search('..', $cdir, true)]);
		$i=count($cdir);
		if($i < 1){
			return;
		}

		foreach ($cdir as $key => $value) {
			if (is_dir($dir.'/'.$value) === true) {
				$result = array_merge($result, $this->getAllFiles($dir . '/' . $value) ?? []);
			}else{
				$index = stripos($dir, 'public');
				$root = substr($dir, $index + strlen('public'));
				$result[] = $root . '/' . $value;
			}
			
		}
		return $result;
	}
}
