package com.example.demo.controller;

import com.example.demo.models.Product;
import com.example.demo.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired
    private com.example.demo.service.ProductService ProductService;

    // Endpoint tìm kiếm sản phẩm theo từ khóa
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword) {
        List<Product> products = ProductService.searchProducts(keyword);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    // Endpoint lấy tất cả sản phẩm
    @GetMapping("/getAllProducts")
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = ProductService.getAllProducts();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    // // Endpoint lấy sản phẩm theo ID
     @GetMapping("/{id}")
     public ResponseEntity<?> getProductById(@PathVariable Long id) {
         Product products = ProductService.getById(id);
         return new ResponseEntity<>(products, HttpStatus.OK);
     }

    // // Endpoint tạo mới hoặc cập nhật sản phẩm
    // @PostMapping
    // public ResponseEntity<AmazonData> createOrUpdateProduct(@RequestBody AmazonData product) {
    //     AmazonData savedProduct = amazonDataService.saveProduct(product);
    //     return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
    // }

    // // Endpoint xóa sản phẩm
    // @DeleteMapping("/{id}")
    // public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
    //     amazonDataService.deleteProduct(id);
    //     return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    // }
}