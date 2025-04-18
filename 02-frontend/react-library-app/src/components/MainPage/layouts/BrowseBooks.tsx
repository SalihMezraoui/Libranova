export const BrowseBooks = () => {
    return (
        <div className='p-5 mb-4 bg-dark header'>
            <div className='container-fluid py-5 text-white 
                d-flex justify-content-center align-items-center'>
                <div className='text-center'>
                    <h1 className='display-5 fw-bold'>Entdecke dein nächstes Leseabenteuer</h1>
                    <p className='col-md-8 fs-4 mx-auto'>Was möchtest du als Nächstes lesen?</p>
                    <a type='button' className='btn main-color btn-lg text-white mt-3 hover-scale' href='#'>
                        Jetzt Bücher erkunden</a>
                </div>
            </div>
        </div>
    );
}