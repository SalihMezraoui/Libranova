class Review {
    id: number;
    userEmail: string;
    createdAt: string; 
    ratingValue: number;
    bookId: number;
    comment?: string;

    constructor(
        id: number,
        userEmail: string,
        createdAt: string,
        ratingValue: number,
        bookId: number,
        comment: string
    ) {
        this.id = id;
        this.userEmail = userEmail;
        this.createdAt = createdAt;
        this.ratingValue = ratingValue;
        this.bookId = bookId;
        this.comment = comment;
    }

    
}

export default Review;