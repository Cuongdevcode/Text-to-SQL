package com.example.demo.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "product")  // Tên bảng trong cơ sở dữ liệu
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ID tự động tăng (giả định)
    private Long id;

    @Column(name = "title", length = 200)
    private String title;

    @Column(name = "price", length = 11)
    private String price;

    @Column(name = "rating", length = 18)
    private String rating;

    @Column(name = "reviews", length = 14)
    private String reviews;

    @Column(name = "availability", length = 40)
    private String availability;

    @Column(name = "about_it", length = 3628)
    private String aboutIt;

    @Column(name = "description", columnDefinition = "TEXT")  // Mã hóa chuỗi dài
    private String description;

    // Getters và Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public String getReviews() {
        return reviews;
    }

    public void setReviews(String reviews) {
        this.reviews = reviews;
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }

    public String getAboutIt() {
        return aboutIt;
    }

    public void setAboutIt(String aboutIt) {
        this.aboutIt = aboutIt;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}