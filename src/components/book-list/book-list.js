import React from 'react';

import Book from '../book/book';
import './book-list.css';


export default class Books extends React.Component {

    state = {
        open: false,
        item: {
            id: "",
            author: "",
            publishedDate: "",
            title: ""
        }
    };

    renderBooks = (book) => {
        return (
            <li className="style-type" key={book.id} >
                <Book books={this.props.items} book={book} />
            </li>
        )
    }



    render() {
        const items = this.props.items;
        return (
            <ul className="list">
                {items.map(this.renderBooks)}
            </ul>
        )
    }
}