import exp from "constants";
import Book from "./Book";

class UserLoansSummary{
    book: Book;
    daysRemaining: number;

    constructor(book: Book, daysRemaining: number) {
        this.book = book;
        this.daysRemaining = daysRemaining;
    }
}

export default UserLoansSummary;