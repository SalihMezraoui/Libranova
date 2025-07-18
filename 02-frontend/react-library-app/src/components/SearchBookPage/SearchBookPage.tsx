import { useState, useEffect } from "react";
import Book from "../../models/Book";
import { SearchBook } from "./layouts/SearchBook";
import { Pagination } from "../Widgets/Pagination";
import { BreathingLoader } from "../Widgets/BreathingLoader";

export const SearchBookPage = () => {

    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(6);
    const [totalBooks, setTotalBooks] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [searchUrl, setSearchUrl] = useState('');
    const [category, setCategory] = useState('Kategorie');

    useEffect(() => {
        const fetchBooks = async () => {
            const apiUrl: string = `${process.env.REACT_APP_API_URL}/books`;

            let url: string = `${apiUrl}?page=${currentPage - 1}&size=${booksPerPage}`;

            if (searchUrl === '') {
                url = `${apiUrl}?page=${currentPage - 1}&size=${booksPerPage}`;
            }
            else {
                let searchAndPage = searchUrl.replace('<pageNumber>', `${currentPage - 1}`);
                url = apiUrl + searchAndPage;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const jsonResponse = await response.json();

            const responseData = jsonResponse._embedded.books;

            setTotalBooks(jsonResponse.page.totalElements);
            setTotalPages(jsonResponse.page.totalPages);


            const loadedBooks: Book[] = [];

            for (const key in responseData) {
                loadedBooks.push({
                    id: responseData[key].id,
                    title: responseData[key].title,
                    author: responseData[key].author,
                    overview: responseData[key].overview,
                    totalCopies: responseData[key].totalCopies,
                    copiesInStock: responseData[key].copiesInStock,
                    category: responseData[key].category,
                    image: responseData[key].image,
                });
            }
            setBooks(loadedBooks);
            setLoading(false);

        };
        fetchBooks().catch((error: any) => {
            setLoading(false);
            setHttpError(error.message);
        })
        window.scrollTo(0, 0);
    }, [currentPage, searchUrl]);

    if (loading) {
        return (
            <BreathingLoader size={80} color="#003366" speed={1} />
        );
    }

    if (httpError) {
        return (
            <div className='container mt-5'>
                <p>{httpError}</p>
            </div>
        );
    }

    const searchHandler = () => {
        setCurrentPage(1);
        if (search === '') {
            setSearchUrl('');
        }
        else {
            setSearchUrl(`/search/findByTitleContainingIgnoreCase?title=${search}&page=<pageNumber>&size=${booksPerPage}`);
        }
        setCategory('Kategorie');
    }

    const categoryHandler = (categoryInput: string) => {
        setCurrentPage(1);
        if (
            categoryInput.toLowerCase() === 'fe' ||
            categoryInput.toLowerCase() === 'be' ||
            categoryInput.toLowerCase() === 'data' ||
            categoryInput.toLowerCase() === 'devops'
        ) {
            setCategory(categoryInput);
            setSearchUrl(`/search/findByCategory?category=${categoryInput}&page=<pageNumber>&size=${booksPerPage}`);
        } else {
            setCategory('All');
            setSearchUrl(`?page=<pageNumber>&size=${booksPerPage}`);
        }
    }

    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    let lastItem = booksPerPage * currentPage <= totalBooks ?
        booksPerPage * currentPage : totalBooks;

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    }

    return (
        <div>
            <div className='container py-5 bg-light rounded shadow-sm'>
                <div>
                    <div className='row mt-4 align-items-center'>
                        <div className='col-6'>
                            <div className='d-flex'>
                                <input className='form-control me-2 rounded-pill' type='search'
                                    placeholder='Suchen' aria-labelledby='Search'
                                    onChange={e => setSearch(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            searchHandler(); // 
                                        }
                                    }} />
                                <button className='btn btn-outline-success rounded-pill'
                                    onClick={() => searchHandler()}>
                                    Suchen
                                </button>

                            </div>
                        </div>
                        <div className='col-4'>
                            <div className='dropdown'>
                                <button className='btn btn-outline-dark rounded-pill px-4 shadow-sm dropdown-toggle' type='button'
                                    id='categoryDropdownButton' data-bs-toggle='dropdown'
                                    aria-expanded='false'>
                                    {category}
                                </button>
                                <ul className='dropdown-menu rounded-3 shadow-sm' aria-labelledby='categoryDropdownButton'>
                                    <li onClick={() => categoryHandler('All')}>
                                        <a className='dropdown-item' href='#'>
                                            Alle
                                        </a>
                                    </li>
                                    <li onClick={() => categoryHandler('FE')}>
                                        <a className='dropdown-item' href='#'>
                                            Front-End
                                        </a>
                                    </li>
                                    <li onClick={() => categoryHandler('BE')}>
                                        <a className='dropdown-item' href='#'>
                                            Back-End
                                        </a>
                                    </li>
                                    <li onClick={() => categoryHandler('Data')}>
                                        <a className='dropdown-item' href='#'>
                                            Data Science
                                        </a>
                                    </li>
                                    <li onClick={() => categoryHandler('DevOps')}>
                                        <a className='dropdown-item' href='#'>
                                            DevOps
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {totalBooks > 0 ?
                        <>
                            <div className='mt-3'>
                                <h5 className='fw-bold text-dark'>Anzahl der Ergebnisse: ({totalBooks})</h5>
                            </div>
                            <p className='text-muted'>
                                {indexOfFirstBook + 1}-{lastItem} von {totalBooks} Ergebnissen:
                            </p>
                            {books.map(book => (
                                <div key={book.id} className="mb-4">
                                    <SearchBook book={book} />
                                </div>
                            ))}
                        </>
                        :
                        <div className='m-5'>
                            <h5 className='fw-bold text-dark'>Keine Ergebnisse gefunden</h5>
                            <p className='text-muted'>Bitte versuchen Sie es mit einem anderen Suchbegriff.</p>
                            <a type="button" className='btn btn-md main-color text-white rounded-pill px-3 invert-hover' href='/'>
                                Bibliotheksdienste </a>
                        </div>
                    }
                    {totalBooks > 1 &&
                        <Pagination currentPage={currentPage} totalPages={totalPages}
                            paginate={paginate} />
                    }
                </div>
            </div>
        </div>
    );
}