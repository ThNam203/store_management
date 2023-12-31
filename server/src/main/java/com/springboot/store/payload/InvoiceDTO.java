package com.springboot.store.payload;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.util.Date;
import java.util.Set;

@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceDTO {
    private int id;
    private double cash;
    private double changed;
    private double subTotal;
    private double discountValue;
    private double total;
    private String paymentMethod;
    private String note;
    private String discountCode;
    private Set<InvoiceDetailDTO> invoiceDetails;
    private Integer customerId;
    private Integer staffId;
    private Date createdAt;
}
