package com.springboot.store.payload;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RecordOfProductSellDTO {
    private int productId;
    private String name;
    private double quantitySell = 0;
    private double quantityReturn = 0;
    private double totalSell = 0;
    private double totalReturn = 0;
    private double total = 0;
    private List<InvoiceInRecordOfProductSellDTO> listInvoice;
    private List<ReturnInRecordOfProductSellDTO> listReturn;
}
