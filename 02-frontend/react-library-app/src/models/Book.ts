class Book {
    id: number;
    title: string;
    author?: string;
    overview?: string;
    overviewDe?: string;
    totalCopies?: number;
    copiesInStock?: number;
    category?: string;
    image?: string;
    deleted?: boolean;

    constructor(id: number, title: string, author: string, overview: string, overviewDe: string,
        totalCopies: number, copiesInStock: number, category: string,
        image: string, deleted: boolean) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.overview = overview;
        this.overviewDe = overviewDe;
        this.totalCopies = totalCopies;
        this.copiesInStock = copiesInStock;
        this.category = category;
        this.image = image;
        this.deleted = deleted;
    }
}

export default Book;
