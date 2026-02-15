<?php

namespace App\Repository;

use App\Entity\Tag;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Tag>
 */
class TagRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Tag::class);
    }

    /**
    * @return Tag[] Returns an array of Tag objects
    */
    public function paginate($page = 1, $limit = 10, $field = "name", $order = "ASC", $search = "")
    {
        $query = $this->createQueryBuilder('t')
            ->orderBy('t.'.$field, $order)
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit)
            ->where('t.name LIKE :search')
            ->setParameter('search', '%'.$search.'%')
            ->getQuery();

        return $query->getResult();
    }

    /**
    * @return Tag[] Returns an array of Tag objects
    */
    public function getItemsByFieldSearch($search = "")
    {
        $query = $this->createQueryBuilder('t')
            ->where('t.name LIKE :search')
            ->setParameter('search', '%'.$search.'%')
            ->getQuery();

        return $query->getResult();
    }

    //    /**
    //     * @return Tag[] Returns an array of Tag objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('t')
    //            ->andWhere('t.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('t.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Tag
    //    {
    //        return $this->createQueryBuilder('t')
    //            ->andWhere('t.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
