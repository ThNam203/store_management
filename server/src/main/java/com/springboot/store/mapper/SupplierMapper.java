package com.springboot.store.mapper;

import com.springboot.store.entity.Supplier;
import com.springboot.store.payload.SupplierDTO;

public class SupplierMapper {
    public static Supplier toSupplier(SupplierDTO supplierDTO) {
        return Supplier.builder()
                .name(supplierDTO.getName())
                .address(supplierDTO.getAddress())
                .phoneNumber(supplierDTO.getPhoneNumber())
                .email(supplierDTO.getEmail())
                .description(supplierDTO.getDescription())
                .companyName(supplierDTO.getCompanyName())
                .status(supplierDTO.getStatus())
                .createdAt(supplierDTO.getCreatedAt())
                .build();
    }
    public static SupplierDTO toSupplierDTO(Supplier supplier) {
        return SupplierDTO.builder()
                .id(supplier.getId())
                .name(supplier.getName())
                .address(supplier.getAddress())
                .phoneNumber(supplier.getPhoneNumber())
                .email(supplier.getEmail())
                .description(supplier.getDescription())
                .companyName(supplier.getCompanyName())
                .status(supplier.getStatus())
                .createdAt(supplier.getCreatedAt())
                .creatorId(supplier.getCreator() != null ? supplier.getCreator().getId() : null)
                .supplierGroupName(supplier.getSupplierGroup() != null ? supplier.getSupplierGroup().getName() : null)
                .image(supplier.getImage() != null ? supplier.getImage().getUrl() : null)
                .build();
    }
}