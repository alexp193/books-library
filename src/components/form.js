import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';


const uuidv1 = require('uuid/v1');


export default class Form extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            newBook: { title: '', author: '', publishedDate: '', imageURL: '' },
            addModal: false,
            errorText: ''
        };

        this.handleChange = this.handleChange.bind(this);

    }


    handleAddModal = () => this.setState({ addModal: !this.state.addModal });

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

    handleSubmit = event => {
        let { title, author, publishedDate, imageURL } = this.state.newBook;

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

        this.props.creactBook({
            id: uuidv1(),
            volumeInfo: {
                imageLinks: {
                    thumbnail: imageURL
                },
                title: title,
                publishedDate: publishedDate,
                authors: [author]
            }
        });

        this.handleAddModal();
    };

    handleChange = prop => event => {
        let newItem = { ...this.state.newBook, [prop]: event.target.value }

        this.setState({
            newBook: newItem
        });
    };

    render() {
        return (
            <div className="form-container">
                <Button onClick={this.handleAddModal}>Create New Book</Button>
                <Dialog
                    open={this.state.addModal}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">New Vehicle</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter a current fields
                        </DialogContentText>
                        <TextField
                            autoFocus
                            value={this.state.newBook.title}
                            onChange={this.handleChange('title')}
                            margin="dense"
                            id="name"
                            label="book title"
                            type="name"
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            value={this.state.newBook.author}
                            onChange={this.handleChange('author')}
                            margin="dense"
                            id="name"
                            label="author"
                            type="name"
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            value={this.state.newBook.publishedDate}
                            onChange={this.handleChange('publishedDate')}
                            margin="dense"
                            id="date"
                            type="date"
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            value={this.state.newBook.imageURL}
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
                        <Button onClick={this.handleAddModal} color="primary">
                            Cancel
            </Button>
                        <Button onClick={this.handleSubmit} disabled={this.state.valid} color="primary">
                            create
            </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}




