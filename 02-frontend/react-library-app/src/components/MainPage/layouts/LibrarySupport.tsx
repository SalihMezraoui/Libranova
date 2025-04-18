export const LibrarySupport = () => {
    return (
        <div className='container my-5'>
            <div className='row p-4 align-items-center border shadow-lg rounded-4 bg-body-secondary'>
                <div className='col-lg-7 p-3'>
                    <h1 className='display-4 fw-bold'>
                    Fehlt dir ein bestimmtes Buch?
                    </h1>
                    <p className='lead mb-4'>
                    Solltest du nicht finden, was du suchst, kontaktiere gerne unsere Admins persönlich
                    </p>
                    <div className='d-grid gap-2 justify-content-md-start mb-4 mb-lg-3'>
                        <a className='btn main-color btn-lg text-white hover-scale' href='#'>
                            Registrieren
                        </a>
                    </div>
                </div>
                <div className='col-lg-4 offset-lg-1 shadow-lg col-image-medium'></div>
            </div>
        </div>
    );
}