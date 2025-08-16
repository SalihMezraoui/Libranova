import React from 'react';
import Book from '../../../models/Book';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const BookReturn: React.FC<{ book: Book }> = (props) => {
  const { t } = useTranslation();
  const bookLink = `/checkout/${props.book.id}`;

  return (
    <div className="col-6 col-sm-6 col-md-4 col-lg-3 mb-4">
      <div className="text-center">
        <Link to={bookLink} className="book-image-container mb-2 d-block">
          {props.book.image ? (
            <img
              src={props.book.image}
              alt={props.book.title}
              className=""
            />
          ) : (
            <img
              src={require(`../../../Images/Books/book-1.png`)}
              alt="default book"
              className=""
            />
          )}
        </Link>

        <h6 className="mt-2">
          <Link to={bookLink} className="title-hover-effect fw-semibold">
            {props.book.title}
          </Link>
        </h6>


        <p className="text-muted">{props.book.author}</p>

        <Link to={bookLink} className="btn main-color text-white mt-2 hover-scale">
          {t('reserve')}
        </Link>
      </div>
    </div>
  );
};
