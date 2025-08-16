class History {
    id: number;
    userEmail: string;
    checkoutAt: string;
    returnedAt: string;
    title: string;
    author: string;
    overview: string;
    image: string;

    constructor(
        id: number,
        userEmail: string,
        checkoutAt: string,
        returnedAt: string,
        title: string,
        author: string,
        overview: string,
        image: string
    ) {
        this.id = id;
        this.userEmail = userEmail;
        this.checkoutAt = checkoutAt;
        this.returnedAt = returnedAt;
        this.title = title;
        this.author = author;
        this.overview = overview;
        this.image = image;
    }
}

export default History;
