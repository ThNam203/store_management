package com.springboot.store.service;

import com.springboot.store.entity.Product;
import com.springboot.store.payload.ProductDTO;

import java.util.List;

public interface ProductService {
    ProductDTO getProductById(int id);
    List<ProductDTO> getAllProducts();
    ProductDTO createProduct(ProductDTO productDTO);
    ProductDTO updateProduct(int id,ProductDTO productDTO);
    void deleteProduct(int id);
}
