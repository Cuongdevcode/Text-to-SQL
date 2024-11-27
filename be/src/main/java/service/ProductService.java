package service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import models.Product;
import repository.ProductRepository;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository ProductRepository;

    public List<Product> searchProducts(String keyword) {
        return ProductRepository.findByTitleContainingIgnoreCase(keyword);
    }
    // Phương thức lấy tất cả sản phẩm
    public List<Product> getAllProducts() {
        return ProductRepository.findAll();
    }

    // // Phương thức lấy sản phẩm theo ID
    // public Product getProductById(Long id) {
    //     return amazonDataRepository.findById(id).orElse(null);
    // }

    // // Phương thức lưu sản phẩm
    // public AmazonData saveProduct(AmazonData product) {
    //     return amazonDataRepository.save(product);
    // }

    // // Phương thức xóa sản phẩm theo ID
    // public void deleteProduct(Long id) {
    //     amazonDataRepository.deleteById(id);
    // }
}

