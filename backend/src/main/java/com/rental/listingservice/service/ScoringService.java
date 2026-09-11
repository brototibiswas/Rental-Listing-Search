package com.rental.listingservice.service;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.rental.listingservice.model.Listing;

@Service 
public class ScoringService {
    private static final double PRICE_WEIGHT = 0.7;
    private static final double SCORE_WEIGHT = 0.3;
    private static final int RECENCY_HALF_LIFE_DAYS = 14;

    // penalize if price bigger than budget
    public double getPriceScore(int price, Integer budget) {
        if(budget == null || budget <= 0) return 0.5; //neutral score
        if(price <= budget) return 1.0; // perfect price under budget

        double over = Math.abs((price - budget) / budget);
        return Math.max(0, 1-over);
    }

    // use listing date as tiebreaker if multiple listing has same price score. Newer listing gets higher score
    public LocalDate getRecencyRank(Listing item) {
        try {
            return LocalDate.parse(item.getListedDate());
        } catch (Exception e) {
            return LocalDate.MIN; // malformed/missing date treated as oldest
        }
    }
}
