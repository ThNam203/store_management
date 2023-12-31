package com.springboot.store.mapper;

import com.springboot.store.entity.Invoice;
import com.springboot.store.payload.InvoiceDTO;

import java.util.stream.Collectors;

public class InvoiceMapper {
    public static InvoiceDTO toInvoiceDTO(Invoice invoice) {
        return InvoiceDTO.builder()
                .id(invoice.getId())
                .cash(invoice.getCash())
                .changed(invoice.getChanged())
                .subTotal(invoice.getSubTotal())
                .discountValue(invoice.getDiscountValue())
                .total(invoice.getTotal())
                .paymentMethod(invoice.getPaymentMethod())
                .note(invoice.getNote())
                .createdAt(invoice.getCreatedAt())
                .customerId(invoice.getCustomer() == null ? null : invoice.getCustomer().getId())
                .staffId(invoice.getStaff() == null ? null : invoice.getStaff().getId())
                .invoiceDetails(invoice.getInvoiceDetails() == null ? null
                        : invoice.getInvoiceDetails()
                        .stream()
                        .map(InvoiceDetailMapper::toInvoiceDetailDTO)
                        .collect(Collectors.toSet()))
                .discountCode(invoice.getDiscountCode() == null ? null : invoice.getDiscountCode().getValue())
                .build();
    }

    public static Invoice toInvoice(InvoiceDTO invoiceDTO) {
        return Invoice.builder()
                .cash(invoiceDTO.getCash())
                .changed(invoiceDTO.getChanged())
                .subTotal(invoiceDTO.getSubTotal())
                .discountValue(invoiceDTO.getDiscountValue())
                .total(invoiceDTO.getTotal())
                .paymentMethod(invoiceDTO.getPaymentMethod())
                .note(invoiceDTO.getNote())
                .createdAt(invoiceDTO.getCreatedAt())
                .build();
    }
}
