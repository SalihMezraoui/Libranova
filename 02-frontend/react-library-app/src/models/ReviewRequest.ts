class ReviewRequest {

    ratingValue: number;
    bookId: number;
    comment?: string;

    constructor(ratingValue: number, bookId: number, comment?: string) {
        this.ratingValue = ratingValue;
        this.bookId = bookId;
        this.comment = comment;
    }
}
export default ReviewRequest;