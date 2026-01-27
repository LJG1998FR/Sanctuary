<?php

namespace App\Helper;

use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\SluggerInterface;

class FileManager {

	public function uploadFile(string $fileDirectory, UploadedFile $file, ?string $oldFilename, SluggerInterface $slugger) : string{

        // Delete old file if it exists
        if($oldFilename){
            unlink($fileDirectory.'/'.$oldFilename);
        }
        
        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $slugger->slug(strtolower($originalFilename));
        $newFilename = $safeFilename.'-'.uniqid().'.'.$file->guessExtension();

        try {
            $file->move(
                $fileDirectory,
                $newFilename
            );

        } catch (FileException $e) {
            // ... handle exception if something happens during file upload
        }

        return $newFilename;
    }

}