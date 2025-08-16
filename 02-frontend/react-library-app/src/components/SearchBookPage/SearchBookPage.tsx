import { useState, useEffect } from "react";
import Book from "../../models/Book";
import { SearchBook } from "./layouts/SearchBook";
import { Pagination } from "../Widgets/Pagination";
import { BreathingLoader } from "../Widgets/BreathingLoader";
import { useTranslation } from "react-i18next";

export const SearchBookPage = () => {

    // Initialize translation hook
    const { t } = useTranslation();

    // Data states
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Pagination & search states
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(6);
    const [totalBooks, setTotalBooks] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [searchUrl, setSearchUrl] = useState('');
    const [category, setCategory] = useState('Category');

    useEffect(() => {
        const loadBooks = async () => {
            const startTime = performance.now();

            try {
                const isSearch = searchUrl.trim().length > 0;
                const pageParam = currentPage - 1;
                const baseUrl = `${process.env.REACT_APP_API_URL}/books`;
                const apiUrl = isSearch
                    ? `${baseUrl}${searchUrl.replace('<pageNumber>', String(pageParam))}`
                    : `${baseUrl}/search/findByDeletedFalse?page=${pageParam}&size=${booksPerPage}`;

                const res = await fetch(apiUrl);
                if (!res.ok) {
                    throw new Error('Something went wrong while fetching books.');
                }

                const data = await res.json();
                const { totalElements, totalPages: pages } = data.page;

                setTotalBooks(totalElements);
                setTotalPages(pages);

                const mappedBooks: Book[] = data._embedded.books.map((book: any) => ({
                    id: book.id,
                    title: book.title,
                    author: book.author,
                    overview: book.overview,
                    totalCopies: book.totalCopies,
                    copiesInStock: book.copiesInStock,
                    category: book.category,
                    image: book.image,
                }));

                setBooks(mappedBooks);
                setLoading(false);

                const endTime = performance.now();
                console.log(`⏱️ Reaktionszeit (Such-/Filteraktion): ${(endTime - startTime).toFixed(2)} ms`);
            } catch (err: any) {
                setLoading(false);
                setHttpError(err.message);
            }
        };

        loadBooks();
        window.scrollTo(0, 0);
    }, [currentPage, searchUrl]);


    if (loading) {
        return (
            <BreathingLoader size={80} color="#003366" speed={1} />
        );
    }

    if (httpError) {
        return (
            <div className="alert alert-danger mt-4" role="alert">
                {httpError}
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
            categoryInput.toLowerCase() === 'sc' ||
            categoryInput.toLowerCase() === 'devops'
        ) {
            setSearchUrl(`/search/findByCategoryAndDeletedFalse?category=${categoryInput}&page=<pageNumber>&size=${booksPerPage}`);
        }
        // fallback
        else {
            setSearchUrl('');
        }
    };


    const lastBookIndex = currentPage * booksPerPage;
    const firstBookIndex = lastBookIndex - booksPerPage;

    const displayedLastItem = Math.min(lastBookIndex, totalBooks);

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
                                    {category === 'SC' && t("search_page.categories.sc")}
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
                                    <li onClick={() => categoryHandler('SC')}>
                                        <a className='dropdown-item' href='#'>
                                            {t('search_page.categories.sc')}
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
                                    from: firstBookIndex + 1,
                                    to: displayedLastItem,
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
                            <a type="button" className='btn btn-md main-color text-white rounded-pill px-3 invert-hover' href='/messages'>
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