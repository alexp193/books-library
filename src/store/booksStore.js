import alt from "./libs/alt.js";
import BooksActions from "./actions/booksActions";
import axios from 'axios';


class BooksStore {

    constructor() {
        this.bindActions(BooksActions);
        this.list = []
    }

    read() {
        axios.get('https://www.googleapis.com/books/v1/volumes?q=Isaac+Asimov').then(res => {
            const list = res.data.items;
            this.setState({ list });
        })
    }

    create(book) {
        let _this = this;
        const list = this.list;
        _this.setState({ list: list.concat(book.item) })
    }

    update(item) {
        let id = item.id;
        let obj = item;
        let _this = this;
        const list = this.list;


        for (var i = 0; i < list.length; i++) {
            if (list[i].id === id) {
                list[i] = obj;
                _this.setState({
                    list: list
                })
                break;
            }
        }
    }

    delete(id) {
        let _this = this;
        const list = this.list;
        for (var i = 0; i < list.length; i++) {
            if (list[i].id === id) {
                list.splice(i, 1);
                _this.setState({
                    list: list
                })
                break
            }
        }
    }


}

export default alt.createStore(BooksStore, "BooksStore");