package com.springboot.store.mapper;

import com.springboot.store.entity.ReturnInvoice;
import com.springboot.store.payload.ReturnInvoiceDTO;

import java.util.stream.Collectors;

public class ReturnInvoiceMapper {
    public static ReturnInvoiceDTO toReturnInvoiceDTO(ReturnInvoice returnInvoice) {
        return ReturnInvoiceDTO.builder()
                .id(returnInvoice.getId())
                .total(returnInvoice.getTotal())
                .returnFee(returnInvoice.getReturnFee())
                .discountValue(returnInvoice.getDiscountValue())
                .paymentMethod(returnInvoice.getPaymentMethod())
                .note(returnInvoice.getNote())
                .createdAt(returnInvoice.getCreatedAt())
                .staffId(returnInvoice.getStaff() == null ? null: returnInvoice.getStaff().getId())
                .invoiceId(returnInvoice.getInvoice() == null ? null : returnInvoice.getInvoice().getId())
                .returnDetails(returnInvoice.getReturnDetails() == null ? null : returnInvoice.getReturnDetails()
                        .stream()
                        .map(ReturnDetailMapper::toReturnDetailDTO)
                        .collect(Collectors.toList()))
                .build();
    }
    public static ReturnInvoice toReturnInvoice(ReturnInvoiceDTO returnInvoiceDTO) {
        return ReturnInvoice.builder()
                .id(returnInvoiceDTO.getId())
                .total(returnInvoiceDTO.getTotal())
                .returnFee(returnInvoiceDTO.getReturnFee())
                .discountValue(returnInvoiceDTO.getDiscountValue())
                .paymentMethod(returnInvoiceDTO.getPaymentMethod())
                .note(returnInvoiceDTO.getNote())
                .createdAt(returnInvoiceDTO.getCreatedAt())
                .build();
    }
}
