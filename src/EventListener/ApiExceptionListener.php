<?php

namespace App\EventListener;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\Validator\Exception\ValidationFailedException;

class ApiExceptionListener
{
    public function onKernelException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();

        // Erreurs de validation → 422
        if ($exception->getPrevious() instanceof ValidationFailedException) {
            $errors = [];
            foreach ($exception->getPrevious() as $violation) {
                $errors[$violation->getPropertyPath()] = $violation->getMessage();
            }
            $event->setResponse(new JsonResponse(
                ['errors' => $errors],
                Response::HTTP_UNPROCESSABLE_ENTITY
            ));
            return;
        }

        // Erreurs HTTP standard (404, 403...) → on garde le bon code
        if ($exception instanceof HttpExceptionInterface) {
            $event->setResponse(new JsonResponse(
                ['error' => $exception->getMessage()],
                $exception->getStatusCode()
            ));
            return;
        }

        // Erreur serveur → 500 (sans exposer les détails en prod !)
        /*$event->setResponse(new JsonResponse(
            ['error' => 'Server Error'],
            Response::HTTP_INTERNAL_SERVER_ERROR
        ));*/
    }
}