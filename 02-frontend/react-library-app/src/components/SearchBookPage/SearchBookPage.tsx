import { useState, useEffect } from "react";
import Book from "../../models/Book";
import { SearchBook } from "./layouts/SearchBook";
import { Pagination } from "../Widgets/Pagination";
import { BreathingLoader } from "../Widgets/BreathingLoader";
import { useTranslation } from "react-i18next";

export const SearchBookPage = () => {

    const { t } = useTranslation();
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(6);
    const [totalBooks, setTotalBooks] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [searchUrl, setSearchUrl] = useState('');
    const [category, setCategory] = useState('Category');

    useEffect(() => {
        const fetchBooks = async () => {
            const start = performance.now();

            let url: string;

            if (searchUrl === '') {
                url = `${process.env.REACT_APP_API_URL}/books/search/findByDeletedFalse?page=${currentPage - 1}&size=${booksPerPage}`;
            } else {
                url = `${process.env.REACT_APP_API_URL}/books${searchUrl.replace('<pageNumber>', `${currentPage - 1}`)}`;
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
            const end = performance.now();
            console.log(`⏱️ Reaktionszeit (Such-/Filteraktion): ${(end - start).toFixed(2)} ms`);
        };

        fetchBooks().catch((error: any) => {
            setLoading(false);
            setHttpError(error.message);
        });

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

        // BOTH title and category are active
        if (
            search.trim() !== '' &&
            category !== 'Category' &&
            category !== 'All'
        ) {
            setSearchUrl(`/search/findByTitleContainingIgnoreCaseAndCategoryAndDeletedFalse?title=${search}&category=${category}&page=<pageNumber>&size=${booksPerPage}`);
        }
        // ONLY title
        else if (search.trim() !== '') {
            setSearchUrl(`/search/findByTitleContainingIgnoreCaseAndDeletedFalse?title=${search}&page=<pageNumber>&size=${booksPerPage}`);
        }
        // ONLY category
        else if (category !== 'Category' && category !== 'All') {
            setSearchUrl(`/search/findByCategoryAndDeletedFalse?category=${category}&page=<pageNumber>&size=${booksPerPage}`);
        }
        // NEITHER
        else {
            setSearchUrl('');
        }
    };


    const categoryHandler = (categoryInput: string) => {
        setCurrentPage(1);
        setCategory(categoryInput);

        // BOTH category + search
        if (
            search.trim() !== '' &&
            categoryInput !== 'Category' &&
            categoryInput !== 'All'
        ) {
            setSearchUrl(`/search/findByTitleContainingIgnoreCaseAndCategoryAndDeletedFalse?title=${search}&category=${categoryInput}&page=<pageNumber>&size=${booksPerPage}`);
        }
        // ONLY category
        else if (
            categoryInput.toLowerCase() === 'fe' ||
            categoryInput.toLowerCase() === 'be' ||
            categoryInput.toLowerCase() === 'data' ||
            categoryInput.toLowerCase() === 'devops'
        ) {
            setSearchUrl(`/search/findByCategoryAndDeletedFalse?category=${categoryInput}&page=<pageNumber>&size=${booksPerPage}`);
        }
        // fallback
        else {
            setSearchUrl('');
        }
    };


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
                                    placeholder={t('search_page.search_placeholder')}
                                    aria-labelledby='Search'
                                    onChange={e => setSearch(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            searchHandler(); // 
                                        }
                                    }} />
                                <button className='btn btn-outline-success rounded-pill'
                                    onClick={() => searchHandler()}>
                                    {t('search_page.search_button')}
                                </button>

                            </div>
                        </div>
                        <div className='col-4'>
                            <div className='dropdown'>
                                <button className='btn btn-outline-dark rounded-pill px-4 shadow-sm dropdown-toggle' type='button'
                                    id='categoryDropdownButton' data-bs-toggle='dropdown'
                                    aria-expanded='false'>
                                    {category === 'FE' && t("search_page.categories.fe")}
                                    {category === 'BE' && t("search_page.categories.be")}
                                    {category === 'Data' && t("search_page.categories.data")}
                                    {category === 'DevOps' && t("search_page.categories.devops")}
                                    {category === 'All' && t("search_page.categories.all")}
                                    {category === 'Category' && t("search_page.categories.category")}
                                </button>

                                <ul className='dropdown-menu rounded-3 shadow-sm' aria-labelledby='categoryDropdownButton'>
                                    <li onClick={() => categoryHandler('All')}>
                                        <a className='dropdown-item' href='#'>
                                            {t('search_page.categories.all')}
                                        </a>
                                    </li>
                                    <li onClick={() => categoryHandler('FE')}>
                                        <a className='dropdown-item' href='#'>
                                            {t('search_page.categories.fe')}
                                        </a>
                                    </li>
                                    <li onClick={() => categoryHandler('BE')}>
                                        <a className='dropdown-item' href='#'>
                                            {t('search_page.categories.be')}
                                        </a>
                                    </li>
                                    <li onClick={() => categoryHandler('Data')}>
                                        <a className='dropdown-item' href='#'>
                                            {t('search_page.categories.data')}
                                        </a>
                                    </li>
                                    <li onClick={() => categoryHandler('DevOps')}>
                                        <a className='dropdown-item' href='#'>
                                            {t('search_page.categories.devops')}
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {totalBooks > 0 ?
                        <>
                            <div className='mt-3'>
                                <h5 className='fw-bold text-dark'>{t('search_page.total_results')} ({totalBooks})</h5>
                            </div>
                            <p className='text-muted'>
                                {t('search_page.showing_results', {
                                    from: indexOfFirstBook + 1,
                                    to: lastItem,
                                    total: totalBooks
                                })}
                            </p>

                            {books.map(book => (
                                <div key={book.id} className="mb-4">
                                    <SearchBook book={book} />
                                </div>
                            ))}
                        </>
                        :
                        <div className='m-5'>
                            <h5 className='fw-bold text-dark'>{t('search_page.no_results_title')}</h5>
                            <p className='text-muted'>{t('search_page.no_results_desc')}</p>
                            <a type="button" className='btn btn-md main-color text-white rounded-pill px-3 invert-hover' href='/'>
                                {t('search_page.library_services')} </a>
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