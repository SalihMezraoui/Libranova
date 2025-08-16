import { BookShowCase } from "./layouts/BookShowCase";
import { BrowseBooks } from "./layouts/BrowseBooks";
import { Carousel } from "./layouts/Carousel";
import { LibrarySupport } from "./layouts/LibrarySupport";

export const MainPage = () => {
    return (
        <><BrowseBooks />
        <Carousel />
        <BookShowCase />
        <LibrarySupport /></>
    );
}