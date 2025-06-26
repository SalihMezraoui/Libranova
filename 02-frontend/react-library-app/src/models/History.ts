class History {
    id: number;
    userEmail: string;
    checkoutDate: string;
    returnedDate: string;
    title: string;
    author: string;
    overview: string;
    image: string;

    constructor(
        id: number,
        userEmail: string,
        checkoutDate: string,
        returnedDate: string,
        title: string,
        author: string,
        overview: string,
        image: string
    ) {
        this.id = id;
        this.userEmail = userEmail;
        this.checkoutDate = checkoutDate;
        this.returnedDate = returnedDate;
        this.title = title;
        this.author = author;
        this.overview = overview;
        this.image = image;
    }
}

export default History;
