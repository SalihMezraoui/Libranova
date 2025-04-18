import { BookHeros } from "./layouts/BookHero";
import { BrowseBooks } from "./layouts/BrowseBooks";
import { Carousel } from "./layouts/Carousel";
import { LibrarySupport } from "./layouts/LibrarySupport";

export const MainPage = () => {
    return (
        <><BrowseBooks />
        <Carousel />
        <BookHeros />
        <LibrarySupport /></>
    );
}