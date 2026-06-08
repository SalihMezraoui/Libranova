package com.libranova.spring_boot_library.service;

import com.libranova.spring_boot_library.Repository.BookRepository;
import com.libranova.spring_boot_library.Repository.WishlistRepository;
import com.libranova.spring_boot_library.model.Book;
import com.libranova.spring_boot_library.model.Wishlist;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final BookRepository bookRepository;

    public List<Book> getWishlistBooks(String userEmail) {
        return wishlistRepository.findByUserEmail(userEmail)
                .stream()
                .map(item -> bookRepository.findById(item.getBookId()).orElse(null))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public boolean isWishlisted(String userEmail, Long bookId) {
        return wishlistRepository.findByUserEmailAndBookId(userEmail, bookId) != null;
    }

    public void addToWishlist(String userEmail, Long bookId) {
        if (!isWishlisted(userEmail, bookId)) {
            wishlistRepository.save(Wishlist.builder()
                    .userEmail(userEmail)
                    .bookId(bookId)
                    .build());
        }
    }

    public void removeFromWishlist(String userEmail, Long bookId) {
        wishlistRepository.deleteByUserEmailAndBookId(userEmail, bookId);
    }
}
