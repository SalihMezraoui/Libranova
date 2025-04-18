export const BookHeros = () => {
    return (
        <div>
            {/* Laptop BookHeros */}
            <div className='d-none d-lg-block'>
            <div className='row g-0 mt-5'>
                    <div className='col-4 col-md-4 container d-flex justify-content-center align-items-center'>
                        <div className='ml-2'>
                            <h1>Deine nächste Lesereise beginnt hier</h1>
                            <p className='lead'>
                                Bücher öffnen Türen zu neuen Welten.
                                Lass uns gemeinsam deine nächste literarische Entdeckungsreise gestalten -
                                ob Fachwissen, Lebenshilfe oder fesselnde Geschichten,
                                wir haben den perfekten Begleiter für dich.
                            </p>
                            <a className='btn main-color btn-lg text-white hover-scale' href='#'>Registrieren</a>
                        </div>
                    </div>
                    <div className='col-sm-6 col-md-6'>
                        <div className='col-image-left'></div>
                    </div>
                </div>
                <div className='row g-0'>
                <div className='col-sm-6 col-md-6'>
                        <div className='col-image-right'></div>
                    </div>
                    <div className='col-4 col-md-4 container d-flex 
                        justify-content-center align-items-center'>
                        <div className='ml-2'>
                            <h1>Frische Ideen. Täglich.</h1>
                            <p className='lead'>
                            Unsere <strong>Bibliothekar:innen</strong> durchforsten täglich Neuerscheinungen und Klassiker,
                                um dir handverlesene Empfehlungen zu bieten.
                                Als Libranova-Mitglied erhältst du Zugang zu exklusiven Titeln
                                und persönlichen Lesevorschlägen, die genau zu deinen Interessen passen.
                            </p>
                        </div>
                    </div>
                    
                </div>
                
            </div>

            {/* Mobile BookHeros */}
            <div className='d-lg-none'>
                <div className='container'>
                    <div className='m-2'>
                        <div className='col-image-right'></div>
                        <div className='mt-2'>
                            <h1>Deine nächste Lesereise beginnt hier</h1>
                            <p className='hero-subtitle'>
                                Bücher öffnen Türen zu neuen Welten.
                                Lass uns gemeinsam deine nächste literarische Entdeckungsreise gestalten -
                                ob Fachwissen, Lebenshilfe oder fesselnde Geschichten,
                                wir haben den perfekten Begleiter für dich.
                            </p>
                            <a className='btn main-color btn-lg text-white' href='#'>Registrieren</a>
                        </div>
                    </div>
                    <div className='m-2'>
                        <div className='col-image-left'></div>
                        <div className='mt-2'>
                            <h1> Frische Ideen. Täglich.</h1>
                            <p className='lead'>
                                Unsere <strong>Bibliothekar:innen</strong> durchforsten täglich Neuerscheinungen und Klassiker,
                                um dir handverlesene Empfehlungen zu bieten.
                                Als Libranova-Mitglied erhältst du Zugang zu exklusiven Titeln
                                und persönlichen Lesevorschlägen, die genau zu deinen Interessen passen.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}