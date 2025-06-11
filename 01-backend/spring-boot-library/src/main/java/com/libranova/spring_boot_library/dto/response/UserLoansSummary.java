package com.libranova.spring_boot_library.dto.response;

import com.libranova.spring_boot_library.model.Book;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserLoansSummary
{
    private Book book;

    private int daysRemaining;

}
