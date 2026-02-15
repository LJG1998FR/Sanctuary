<?php

namespace App\Repository;

use App\Entity\Video;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Video>
 */
class VideoRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Video::class);
    }

    /**
    * @return Video[] Returns an array of Video objects
    */
    public function paginate($page = 1, $limit = 10, $field = "title", $order = "ASC", $search = "")
    {
        $query = $this->createQueryBuilder('v')
            ->orderBy('v.'.$field, $order)
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit)
            ->where('v.title LIKE :search')
            ->setParameter('search', '%'.$search.'%')
            ->getQuery();

        return $query->getResult();
    }

    /**
    * @return Video[] Returns an array of Video objects
    */
    public function getItemsByFieldSearch($search = "")
    {
        $query = $this->createQueryBuilder('v')
            ->where('v.title LIKE :search')
            ->setParameter('search', '%'.$search.'%')
            ->getQuery();

        return $query->getResult();
    }

    //    /**
    //     * @return Video[] Returns an array of Video objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('v')
    //            ->andWhere('v.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('v.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Video
    //    {
    //        return $this->createQueryBuilder('v')
    //            ->andWhere('v.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
