import { useState } from "react";
import { HistoryTab } from "./Layouts/HistoryTab";
import { Loans } from "./Layouts/Loans";

export const LibraryActivity = () => {

    const [historyRefresh, setHistoryRefresh] = useState(false);


    return (
        <div className='container mt-5'>
            <div className="mt-3">
                <nav>
                    <div
                        className="nav nav-tabs justify-content-center gap-3 pb-3"
                        id="nav-tab"
                        role="tablist"
                    >
                        <button
                            onClick={() => setHistoryRefresh(false)}
                            className={`nav-link rounded-pill fw-semibold ${!historyRefresh
                                    ? 'active bg-primary text-white fw-bold shadow-sm'
                                    : 'text-primary bg-white border border-primary'
                                }`}
                            id="nav-loans-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-loans"
                            type="button"
                            role="tab"
                            aria-controls="nav-loans"
                            aria-selected={!historyRefresh}
                        >
                            Loans
                        </button>

                        <button
                            onClick={() => setHistoryRefresh(true)}
                            className={`nav-link rounded-pill fw-semibold ${historyRefresh
                                    ? 'active bg-primary text-white fw-bold shadow-sm'
                                    : 'text-primary bg-white border border-primary'
                                }`}
                            id="nav-history-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-history"
                            type="button"
                            role="tab"
                            aria-controls="nav-history"
                            aria-selected={historyRefresh}
                        >
                            My History
                        </button>
                    </div>
                </nav>

                <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="nav-loans" role="tabpanel"
                        aria-labelledby="nav-loans-tab">
                        <Loans />
                    </div>
                    <div className="tab-pane fade" id="nav-history" role="tabpanel"
                        aria-labelledby="nav-history-tab">
                        {historyRefresh ? <HistoryTab /> : <></>}
                    </div>
                </div>
            </div>
        </div>
    );
} 