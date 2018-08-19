import React, { Component } from 'react';
import './App.css';

import Books from "./components/book-list/book-list.js";
import Form from './components/form';

import BooksActions from "./store/actions/booksActions";
import BooksStore from "./store/booksStore";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = BooksStore.getState();
  }

  componentDidMount() {
    BooksStore.listen(this.storeChanged);
    BooksActions.read();
  }

  componentWillUnmount() {
    BooksStore.unlisten(this.storeChanged);
  }

  storeChanged = (state) => {
    this.setState(state);
  }

  addBook = (NewBook) => {
    BooksActions.create({ item: NewBook })
  }


  render() {

    const list = this.state.list;

    return (
      <div className="App">
        <div className="container">
          <h1>Books library</h1>
          <Form books={list} creactBook={this.addBook} />
          <Books items={list} />
        </div>
      </div>
    );
  }
}

export default App;
