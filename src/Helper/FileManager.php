<?php

namespace App\Helper;

use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\SluggerInterface;

class FileManager {

    private $assetsPrefix;
    public function __construct(string $assetsPrefix)
    {
        $this->assetsPrefix = $assetsPrefix;
    }

	public function uploadFile(string $fileDirectory, UploadedFile $file, ?string $oldFilename, SluggerInterface $slugger) : string{

        // Delete old file if it exists
        if($oldFilename){
            unlink($fileDirectory.'/'.$oldFilename);
        }

        $newFilename = uniqid($this->assetsPrefix).'.'.$file->guessExtension();
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