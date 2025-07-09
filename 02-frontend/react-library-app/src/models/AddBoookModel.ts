class AddBookModel {
  title: string;
  author: string;
  overview: string;
  totalCopies: number;
  category: string;
  image?: string;

  constructor(
    title: string, author: string, overview: string,
    totalCopies: number, category: string
  ) {
    this.title = title;
    this.author = author;
    this.overview = overview;
    this.totalCopies = totalCopies;
    this.category = category;
  }
}

export default AddBookModel;
