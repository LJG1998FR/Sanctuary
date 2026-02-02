<?php

namespace App\Repository;

use App\Entity\Photo;
use App\Entity\PhotoCollection;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Photo>
 */
class PhotoRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Photo::class);
    }

    public function findMaxPosition(EntityManagerInterface $entityManager, PhotoCollection $photoCollection): int|null
    {
        $query = $entityManager->getRepository(Photo::class)
            ->createQueryBuilder('p')
            ->select('MAX(p.position) as maxPosition')
            ->orderBy('p.position', 'DESC')
            ->where('p.photoCollection = :photoCollection')
            ->setParameter('photoCollection', $photoCollection)
            ->getQuery();

        return $query->getSingleScalarResult();
    }

    //    /**
    //     * @return Photo[] Returns an array of Photo objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('p.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Photo
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
