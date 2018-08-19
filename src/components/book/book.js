import React from 'react';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

import BooksActions from "../../store/actions/booksActions";
import './book.css'


export default class Book extends React.Component {

    constructor(props) {
        super(props);

        let { title, authors, publishedDate } = this.props.book.volumeInfo;

        this.state = {
            book: {
                title: title,
                author: authors[0],
                publishedDate: publishedDate,
                imageURL: this.props.book.volumeInfo.imageLinks.thumbnail
            },
            deletePopup: false,
            editModal: false,
            errorText: ''

        };
    }

    handleDeleteModal = () => this.setState({ deletePopup: !this.state.deletePopup });

    handleEditModal = () => this.setState({ editModal: !this.state.editModal });


    deleteItem = () => {
        BooksActions.delete(this.props.book.id)
        this.handleDeleteModal();
    }

    handleChange = name => event => {
        let newItem = { ...this.state.book, [name]: event.target.value }
        this.setState({
            book: newItem
        });
    };

    checkForString = data => data.length <= 0

    checkfields = (title, author, publishedDate, imageURL) => {
        return (
            [title, author, imageURL].filter(item => {
                if (this.checkForString(item)) {
                    this.setState({ errorText: 'do you have empty fields' });
                    return false;
                }
                return true;
            }).length === 3
        );
    };

    correctString(string) {
        return string
            .split(' ')
            .map(word => this.capitalize(word))
            .join(' ');
    }

    checkTitle(title) {
        const TitleExists = this.props.books.filter(book => book.volumeInfo.title === title);

        if (TitleExists.length) {
            this.setState({ errorText: `This Title name: "${title}" already exists` });
            return true;
        }
        return false;
    }

    validateDate = (date) => {
        var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
        return regex.test(date);

    }

    capitalize(string) {
        let simpleString = string.replace(/[^A-Za-z0-9]/g, '');
        return simpleString.charAt(0).toUpperCase() + simpleString.slice(1).toLowerCase();
    }

    handleUpdate = () => {
        let { title, author, publishedDate, imageURL } = this.state.book;

        if (!this.checkfields(title, author, publishedDate, imageURL)) {
            return;
        }

        if (this.checkTitle(title)) {
            return;
        }

        if (!this.validateDate(publishedDate)) {
            this.setState({ errorText: 'The Date Field is Not Valid' });
            return
        }

        title = this.correctString(title);
        author = this.correctString(author);

        BooksActions.update({
            id: this.props.book.id,
            volumeInfo: {
                imageLinks: {
                    thumbnail: this.state.book.imageURL
                },
                title: this.state.book.title,
                publishedDate: this.state.book.publishedDate,
                authors: [this.state.book.author]
            }
        });
        this.handleEditModal();
    };

    render() {

        return (
            <div className="item" onClick={this.handleClick} >
                <span className="item-title"> {this.props.book.volumeInfo.title} </span>
                <img src={this.props.book.volumeInfo.imageLinks.thumbnail} alt="img" width="100" height="50" />
                <span className="item-date"> {this.props.book.volumeInfo.publishedDate} </span>
                <span className="item-author"> {this.props.book.volumeInfo.authors[0]} </span>
                <div className="buttom-section">
                    <div className="edit" onClick={this.handleEditModal}>
                        <Button className="edit-icon" variant="fab" color="secondary" aria-label="Edit">
                            <Edit />
                        </Button>
                    </div>
                    <div className="align" onClick={this.handleDeleteModal}>
                        <Button className="button-del" variant="fab" disabled aria-label="Delete" >
                            <DeleteIcon />
                        </Button>
                    </div>
                </div>
                <Dialog
                    open={this.state.deletePopup}
                    onClose={this.state.deletePopup}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{`Do you want to delete ${this.props.book.volumeInfo.title} book`}</DialogTitle>
                    <DialogActions>
                        <Button onClick={this.handleDeleteModal} color="primary">
                            Cancel
                       </Button>
                        <Button onClick={this.deleteItem} color="primary" autoFocus>
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={this.state.editModal}
                    onClose={this.state.editModal}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">edit</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            please edit fields
                         </DialogContentText>
                        <TextField
                            autoFocus
                            value={this.state.book.title}
                            onChange={this.handleChange('title')}
                            margin="dense"
                            id="name"
                            label="book title"
                            type="name"
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            value={this.state.book.author}
                            onChange={this.handleChange('author')}
                            margin="dense"
                            id="name"
                            label="author"
                            type="name"
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            value={this.state.book.publishedDate}
                            onChange={this.handleChange('publishedDate')}
                            margin="dense"
                            id="date"
                            type="date"
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            value={this.state.book.imageURL}
                            onChange={this.handleChange('imageURL')}
                            margin="dense"
                            id="name"
                            label="imageURL"
                            type="name"
                            fullWidth
                        />

                        <FormControl>
                            <FormHelperText className="error">{this.state.errorText}</FormHelperText>
                        </FormControl>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleEditModal} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleUpdate} color="primary">
                            edit
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>

        )
    }
}