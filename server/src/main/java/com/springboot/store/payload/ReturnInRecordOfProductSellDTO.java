package com.springboot.store.payload;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReturnInRecordOfProductSellDTO {

    private Date date;
    private String customerName;
    private double quantity;
    private double total;
}
