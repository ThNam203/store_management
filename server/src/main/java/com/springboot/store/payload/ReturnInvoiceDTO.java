package com.springboot.store.payload;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReturnInvoiceDTO {
    private int id;
    private int total;
    private int returnFee;
    private double discountValue;
    private String paymentMethod;
    private String note;
    private Date createdAt;
    private Integer staffId;
    private Integer invoiceId;
    private List<ReturnDetailDTO> returnDetails;
}
