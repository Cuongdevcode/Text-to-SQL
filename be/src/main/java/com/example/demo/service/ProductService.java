package com.example.demo.service;

import com.example.demo.models.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private com.example.demo.repository.ProductRepository ProductRepository;

    public List<Product> searchProducts(String keyword) {
        return ProductRepository.findByTitleContainingIgnoreCase(keyword);
    }
    // Phương thức lấy tất cả sản phẩm
    public List<Product> getAllProducts() {
        return ProductRepository.findAll();
    }

    public Product getById(Long id){
        return ProductRepository.findById(id).get();
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

