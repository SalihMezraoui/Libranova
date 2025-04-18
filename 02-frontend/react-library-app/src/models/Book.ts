class Book {
    id: number;
    title: string;
    author?: string;
    overview?: string;
    totalCopies?: number;
    copiesInStock?: number;
    category?: string;
    image?: string;

    constructor(id: number, title: string, author: string, overview: string, 
        totalCopies: number, copiesInStock: number, category: string,
        image: string) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.overview = overview;
        this.totalCopies = totalCopies;
        this.copiesInStock = copiesInStock;
        this.category = category;
        this.image = image;
    }
}

export default Book;
