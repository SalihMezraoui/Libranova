import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import AddBookModel from "../../../models/AddBoookModel";
import { useTranslation } from "react-i18next";

export const AddBook = () => {

    //  Auth & localisation
    const { authState } = useOktaAuth(); // Handles authentication state from Okta
    const { t } = useTranslation(); // For translations/localisation

    // Book details
    const [overview, setOverview] = useState(''); // Book overview text
    const [category, setCategory] = useState('Category'); // Book category
    const [author, setAuthor] = useState(''); // Book author name
    const [title, setTitle] = useState(''); // Book title
    const [totalCopies, setTotalCopies] = useState(0); // Number of copies

    // Media
    const [image, setImage] = useState<any>(null); // Book cover image
    const [fileName, setFileName] = useState(''); // File name for uploaded image

    // UI feedback states
    const [showSuccess, setShowSuccess] = useState(false); // Success message visibility
    const [showWarning, setShowWarning] = useState(false); // Warning message visibility



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
        const apiUrl = `${process.env.REACT_APP_API_URL}/admin/secure/post/book`;
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

            const data = await fetch(apiUrl, requestOptions);
            if (!data.ok) {
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
                        <strong>{t("addBook.successMessage")}</strong>
                    </div>
                </div>
            )}
            {showWarning && (
                <div className="alert alert-warning d-flex align-items-center" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <div><strong>{t("addBook.warningMessage")}</strong></div>
                </div>
            )}
            <div className="card shadow-sm border-0">
                <div className="card-header bg-color text-white fw-bold fs-5">
                    <i className="bi bi-journal-plus me-2"></i>{t("addBook.header")}
                </div>
                <div className="card-body">
                    <form method="POST">
                        <div className="row g-4">
                            <div className="col-md-6 ">
                                <label className="form-label">{t("addBook.titleLabel")}</label>
                                <input
                                    type="text"
                                    className="form-control shadow-sm"
                                    value={title}
                                    placeholder={t("addBook.titlePlaceholder")}
                                    onChange={(e) => setTitle(e.target.value)}
                                    name="title"
                                    required
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">{t("addBook.authorLabel")}</label>
                                <input
                                    type="text"
                                    className="form-control shadow-sm"
                                    value={author}
                                    placeholder={t("addBook.authorPlaceholder")}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    name="author"
                                    required
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">{t("addBook.categoryLabel")}</label>
                                <div className="dropdown">
                                    <button
                                        className="btn btn-outline-secondary w-100 text-start dropdown-toggle"
                                        type="button"
                                        id="dropdownMenuButton"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        {category === 'FE' && t("addBook.category.frontend")}
                                        {category === 'BE' && t("addBook.category.backend")}
                                        {category === 'Data' && t("addBook.category.dataScience")}
                                        {category === 'SC' && t("addBook.category.cyberSecurity")}
                                        {category === 'DevOps' && t("addBook.category.devops")}
                                        {(!category || category === 'Category') && t("addBook.selectCategory")}
                                    </button>

                                    <ul className="dropdown-menu w-100" aria-labelledby="dropdownMenuButton">
                                        <li><a className="dropdown-item" onClick={() => categorySelector('FE')}>{t("addBook.category.frontend")}</a></li>
                                        <li><a className="dropdown-item" onClick={() => categorySelector('BE')}>{t("addBook.category.backend")}</a></li>
                                        <li><a className="dropdown-item" onClick={() => categorySelector('Data')}>{t("addBook.category.dataScience")}</a></li>
                                        <li><a className="dropdown-item" onClick={() => categorySelector('SC')}>{t("addBook.category.cyberSecurity")}</a></li>
                                        <li><a className="dropdown-item" onClick={() => categorySelector('DevOps')}>{t("addBook.category.devops")}</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <label className="form-label">{t("addBook.overviewLabel")}</label>
                            <textarea
                                className="form-control shadow-sm"
                                value={overview}
                                onChange={(e) => setOverview(e.target.value)}
                                id="sampleTextarea"
                                rows={4}
                                placeholder={t("addBook.overviewPlaceholder")}
                                name="overview"
                                required
                            ></textarea>
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">{t("addBook.totalCopiesLabel")}</label>
                            <input
                                type="number"
                                className="form-control shadow-sm"
                                value={totalCopies}
                                onChange={(e) => setTotalCopies(Number(e.target.value))}
                                name="totalCopies"
                                placeholder={t("addBook.totalCopiesPlaceholder")}
                                min="1"
                                max="1000"
                                required
                            />
                        </div>
                        <div className="col-md-8">
                            <label className="form-label fw-semibold">{t("addBook.coverImageLabel")}</label>
                            <div className="custom-file-wrapper">
                                <label htmlFor="fileUpload" className="btn btn-outline-secondary">
                                    {t("addBook.selectFile")}
                                </label>
                                <input
                                    id="fileUpload"
                                    type="file"
                                    style={{ display: "none" }}
                                    onChange={e => {
                                        convertImagesToBase64(e);
                                        setFileName(e.target.files?.[0]?.name || '');
                                    }}
                                />
                                <span className="ms-2">
                                    {fileName || t("addBook.noFileChosen")}
                                </span>
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
                                {t("addBook.submitButton")}
                            </button>
                        </div>

                    </form>

                </div>

            </div>
        </div>
    );
}