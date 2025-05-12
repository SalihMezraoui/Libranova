import React from 'react';
import Book from '../../../models/Book';
import { Link } from 'react-router-dom';

export const BookReturn: React.FC<{ book: Book }> = (props) => {
  return (
    <div className='col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3'>
      <div className='text-center'>
        {props.book.image ?
          <img
            src={props.book.image}
            width='180'
            height='270'
            alt={"book"}
            className='img-fluid rounded shadow-sm hover-scale'
          />
          :
          <img
            src={require(`../../../Images/Books/book-1.png`)}
            width='180'
            height='270'
            alt={"book"}
            className='img-fluid rounded shadow-sm hover-scale'
          />}

        <h6 className='mt-2'>{props.book.title}</h6>
        <p>{props.book.author}</p>
        <Link className='btn main-color text-white hover-scale' to={`checkout/${props.book.id}`}>Reservieren</Link>
      </div>
    </div>
  );
};

