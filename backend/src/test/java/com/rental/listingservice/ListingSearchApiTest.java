package com.rental.listingservice;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

// Full context rather than @WebMvcTest: validation lives in ListingService, so mocking
// that bean would stub out the very code these tests exercise.
@SpringBootTest
@AutoConfigureMockMvc
class ListingSearchApiTest {
    private static final String SEARCH = "/api/listings/search";

    @Autowired
    private MockMvc mockMvc;

    // The frontend asked for 20 per page and silently got 10; page size is now server-owned.
    @Test
    void searchWithoutParamsUsesServerPageSizeOfTen() throws Exception {
        mockMvc.perform(get(SEARCH))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.itemsPerPage").value(10))
                .andExpect(jsonPath("$.results.length()").value(10))
                .andExpect(jsonPath("$.page").value(0));
    }

    @Test
    void clientSuppliedItemsPerPageIsIgnored() throws Exception {
        mockMvc.perform(get(SEARCH).param("itemsPerPage", "50"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.itemsPerPage").value(10))
                .andExpect(jsonPath("$.results.length()").value(10));
    }

    // The untouched frontend still sends this spelling; it must stay harmless.
    @Test
    void legacyItemsParamIsIgnored() throws Exception {
        mockMvc.perform(get(SEARCH).param("items", "50"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.itemsPerPage").value(10))
                .andExpect(jsonPath("$.results.length()").value(10));
    }

    // Proves the removed "items must be at least 1" check is genuinely unreachable.
    @Test
    void itemsZeroIsNoLongerRejected() throws Exception {
        mockMvc.perform(get(SEARCH).param("items", "0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.itemsPerPage").value(10));
    }

    @Test
    void secondPageReturnsRemainingResults() throws Exception {
        mockMvc.perform(get(SEARCH).param("page", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page").value(1))
                .andExpect(jsonPath("$.results").isArray());
    }

    @Test
    void pageBeyondLastReturnsEmptyResults() throws Exception {
        mockMvc.perform(get(SEARCH).param("page", "99"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.results").isEmpty());
    }

    // A huge page overflows page * PAGE_SIZE into a negative index.
    @Test
    void hugePageNumberDoesNotOverflowIntoNegativeIndex() throws Exception {
        mockMvc.perform(get(SEARCH).param("page", "300000000"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.results").isEmpty());
    }

    @ParameterizedTest
    @CsvSource(delimiter = '|', value = {
        "minPrice=-1                   | minPrice must not be negative",
        "maxPrice=-1                   | maxPrice must not be negative",
        "minPrice=900000&maxPrice=1000 | minPrice must not be greater than maxPrice",
        "minBedrooms=-1                | minBedrooms must not be negative",
        "targetBudget=-1               | targetBudget must not be negative",
        "page=-1                       | page must not be negative",
    })
    void rejectsInvalidCriteria(String query, String expectedError) throws Exception {
        mockMvc.perform(get(SEARCH + "?" + query.trim()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value(expectedError.trim()));
    }
}
