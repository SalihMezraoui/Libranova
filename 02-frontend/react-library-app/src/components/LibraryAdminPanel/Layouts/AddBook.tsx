import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import AddBookModel from "../../../models/AddBoookModel";

export const AddBook = () => {

    const { authState } = useOktaAuth();

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [overview, setOverview] = useState('');
    const [totalCopies, setTotalCopies] = useState(0);
    const [category, setCategory] = useState('Category');
    const [image, setImage] = useState<any>(null);

    const [showWarning, setShowWarning] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    function categorySelector(input: any) {
        setCategory(input);
    }

    async function convertImagesToBase64(input: any) {
        console.log(input);
        if (input.target.files[0]) {
            convertBase64(input.target.files[0]);
        }
    }

    function convertBase64(file: any) {
        console.log(file);
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            setImage(reader.result);
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        }
    }

    async function addNewBook() {
        const apiUrl = `http://localhost:8080/api/admin/secure/add-book`;
        if (authState?.isAuthenticated && title !== '' && author !== '' && category !== 'category'
            && overview !== '' && totalCopies > 0) {
            const book: AddBookModel = new AddBookModel(
                title, author, overview, totalCopies, category
            );
            book.image = image;
            const requestOptions = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(book)
            };

            const response = await fetch(apiUrl, requestOptions);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            setTitle('');
            setAuthor('');
            setOverview('');
            setTotalCopies(0);
            setCategory('Category');
            setImage(null);
            setShowWarning(false);
            setShowSuccess(true);
        }
        else {
            setShowWarning(true);
            setShowSuccess(false);
        }
    }

    return (
        <div className="container py-5">
            {showSuccess && (
                <div className="alert alert-success d-flex align-items-center" role="alert">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    <div>
                        <strong>Book added successfully!</strong>
                    </div>
                </div>
            )}
            {showWarning && (
                <div className="alert alert-warning d-flex align-items-center" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <div><strong>All fields are required!</strong></div>
                </div>
            )}
            <div className="card shadow-sm border-0">
                <div className="card-header bg-color text-white fw-bold fs-5">
                    <i className="bi bi-journal-plus me-2"></i>Add a New Book
                </div>
                <div className="card-body">
                    <form method="POST">
                        <div className="row g-4">
                            <div className="col-md-6 ">
                                <label className="form-label">Title</label>
                                <input
                                    type="text"
                                    className="form-control shadow-sm"
                                    value={title}
                                    placeholder="Enter book title"
                                    onChange={(e) => setTitle(e.target.value)}
                                    name="title"
                                    required
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Author</label>
                                <input
                                    type="text"
                                    className="form-control shadow-sm"
                                    value={author}
                                    placeholder="Enter author's name"
                                    onChange={(e) => setAuthor(e.target.value)}
                                    name="author"
                                    required
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Category</label>
                                <div className="dropdown">
                                    <button
                                        className="btn btn-outline-secondary w-100 text-start dropdown-toggle"
                                        type="button"
                                        id="dropdownMenuButton"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        {category || "Select category"}
                                    </button>
                                    <ul className="dropdown-menu w-100" aria-labelledby="dropdownMenuButton">
                                        <li><a className="dropdown-item" onClick={() => categorySelector('FE')}>Front End</a></li>
                                        <li><a className="dropdown-item" onClick={() => categorySelector('BE')}>Backend</a></li>
                                        <li><a className="dropdown-item" onClick={() => categorySelector('Data')}>Data Science</a></li>
                                        <li><a className="dropdown-item" onClick={() => categorySelector('DevOps')}>DevOps</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <label className="form-label">Overview</label>
                            <textarea
                                className="form-control shadow-sm"
                                value={overview}
                                onChange={(e) => setOverview(e.target.value)}
                                id="sampleTextarea"
                                rows={4}
                                placeholder="Enter book overview"
                                name="overview"
                                required
                            ></textarea>
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">Total Copies</label>
                            <input
                                type="number"
                                className="form-control shadow-sm"
                                value={totalCopies}
                                onChange={(e) => setTotalCopies(Number(e.target.value))}
                                name="totalCopies"
                                placeholder="Enter total copies"
                                min="1"
                                max="1000"
                                required
                            />
                        </div>
                        <div className="col-md-8">
                            <label className="form-label fw-semibold">Cover Image</label>
                            <div>
                                <input type='file' onChange={e => convertImagesToBase64(e)} />
                            </div>
                        </div>

                        <div className="mt-4 text-center">
                            <button
                                type="button"
                                className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2 px-4 py-2 fs-5 fw-semibold rounded-pill shadow-sm"
                                onClick={addNewBook}
                                style={{ minWidth: '220px' }}
                            >
                                <i className="bi bi-plus-circle-fill fs-4"></i>
                                Add Book
                            </button>
                        </div>

                    </form>

                </div>

            </div>
        </div>
    );
}