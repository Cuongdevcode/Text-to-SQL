package repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import models.Product;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Tìm kiếm sản phẩm theo tiêu đề
    List<Product> findByTitleContainingIgnoreCase(String keyword);
}

