package com.springboot.store.payload;

import com.springboot.store.entity.Staff;
import lombok.*;

import java.util.Date;

@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenseFormDTO {
    private int id;
    private String receiverType;
    private Date date;
    private String expenseType;
    private int value;
    private String creatorName;
    private int idReceiver;
    private String receiverName;
    private String note;
    private String description;
    private int linkedFormId;
}
