import { Link } from "react-router-dom";
import Book from "../../../models/Book";
import { useTranslation } from "react-i18next";

export const SearchBook: React.FC<{ book: Book }> = (props) => {
    const { t } = useTranslation();

    return (
        <div className='card mt-4 p-4 border-0 shadow-sm rounded-4 bg-white'>
            <div className='row g-0'>
                <div className='col-md-2'>
                    <div className='d-none d-lg-block'>
                        {props.book.image ?
                            <img src={props.book.image}
                                width='140'
                                height='220'
                                alt='Book'
                                className='rounded-2 border'
                            />
                            :
                            <img src={require('../../../Images/Books/book-1.png')}
                                width='140'
                                height='220'
                                alt='Book'
                                className='rounded-2 border'
                            />
                        }
                    </div>
                    <div className='d-lg-none d-flex justify-content-center 
                        align-items-center'>
                        {props.book.image ?
                            <img src={props.book.image}
                                width='130'
                                height='200'
                                alt='Book'
                            />
                            :
                            <img src={require('../../../Images/Books/book-1.png')}
                                width='130'
                                height='200'
                                alt='Book'
                                className='rounded-2 border'
                            />
                        }
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className='card-body'>
                        <h4 className='fw-bold text-dark'>
                            {props.book.title}
                        </h4>
                        <h6 className='text-muted mb-2'>
                            {props.book.author}
                        </h6>

                        <p className='card-text'>
                            {props.book.overview}
                        </p>
                    </div>
                </div>
                <div className='col-md-4 d-flex justify-content-center align-items-center'>
                    <Link className='btn btn-md main-color rounded-pill text-white invert-hover' to={`/checkout/${props.book.id}`}>
                        {t('search_page.viewDetails')}
                    </Link>
                </div>
            </div>
        </div>
    );
}