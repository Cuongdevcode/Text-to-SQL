package com.example.demo.service;

import com.example.demo.models.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
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

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Tìm sản phẩm theo câu SQL
    public List<Product> searchProductsBySQL(String sqlQuery) {
        String sqlClean = extractSqlQuery(sqlQuery);
//        if (!sqlClean.toUpperCase().startsWith("SELECT")) {
//            throw new IllegalArgumentException("Only SELECT queries are allowed.");
//        }
        System.out.println(sqlClean);
        return jdbcTemplate.query(
                sqlClean,
                (rs, rowNum) -> new Product(
                        rs.getLong("id"),
                        rs.getString("title"),
                        rs.getString("price"),
                        rs.getString("reviews"),
                        rs.getString("rating"),
                        rs.getString("availability"),
                        rs.getString("about_it"),
                        rs.getString("description")
                )
        );
    }

    // Phương thức lọc câu SQL hợp lệ
    private String extractSqlQuery(String input) {
        int thirdQuoteIndex = findNthOccurrence(input, '"', 3);
        if (thirdQuoteIndex == -1) {
            return "Invalid SQL query format";
        }
        int semicolonIndex = input.indexOf(";", thirdQuoteIndex);
        if (semicolonIndex == -1) {
            return "No semicolon found after third quote";
        }
        return input.substring(thirdQuoteIndex + 1, semicolonIndex).trim();
    }

    // Phương thức tìm chỉ mục của dấu ký tự nth trong chuỗi
    private int findNthOccurrence(String str, char c, int n) {
        int pos = -1;
        for (int i = 0; i < n; i++) {
            pos = str.indexOf(c, pos + 1);
            if (pos == -1) {
                return -1;
            }
        }
        return pos;
    }
}

