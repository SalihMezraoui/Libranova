export const Pagination: React.FC<{
    currentPage: number,
    totalPages: number,
    paginate: any
}> = (props) => {

    const visiblePages = [];

    if (props.currentPage === 1) {
        visiblePages.push(props.currentPage);
        if (props.totalPages >= props.currentPage + 1) {
            visiblePages.push(props.currentPage + 1);
        }
        if (props.totalPages >= props.currentPage + 2) {
            visiblePages.push(props.currentPage + 2);
        }
    } else if (props.currentPage > 1) {
        if (props.currentPage >= 3) {
            visiblePages.push(props.currentPage - 2);
            visiblePages.push(props.currentPage - 1);
        } else {
            visiblePages.push(props.currentPage - 1);
        }

        visiblePages.push(props.currentPage);

        if (props.totalPages >= props.currentPage + 1) {
            visiblePages.push(props.currentPage + 1);
        }
        if (props.totalPages >= props.currentPage + 2) {
            visiblePages.push(props.currentPage + 2);
        }
    }

    return (
        <nav aria-label="Pagination Navigation">
            <ul className="pagination justify-content-center gap-2">
                <li className="page-item">
                    <button
                        className="btn btn-md main-color text-white rounded-pill px-3 invert-hover"
                        onClick={() => props.paginate(1)}
                    >
                        ⏮ Erste 
                    </button>
                </li>

                {visiblePages.map(number => (
                    <li key={number} className="page-item">
                        <button
                            onClick={() => props.paginate(number)}
                            className={`btn ${props.currentPage === number
                                ? 'btn-md main-color text-white invert-hover'
                                : 'btn-outline-secondary'} rounded-pill px-3`}
                        >
                            {number}
                        </button>
                    </li>
                ))}

                <li className="page-item">
                    <button
                        className="btn btn-md main-color text-white rounded-pill px-3 invert-hover"
                        onClick={() => props.paginate(props.totalPages)}
                    >
                        Letzte ⏭
                    </button>
                </li>
            </ul>
        </nav>

    );
}