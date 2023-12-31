package com.springboot.store.payload.report;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SalesReportWithProfit {
    private Date date;
    private double revenue;
    private double costPrice;
    private double profit;
}
