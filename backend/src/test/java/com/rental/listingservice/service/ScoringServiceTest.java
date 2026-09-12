package com.rental.listingservice.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.within;

import org.junit.jupiter.api.Test;

class ScoringServiceTest {
    private static final int BUDGET = 500_000;

    private final ScoringService scoring = new ScoringService();

    @Test
    void nullBudgetScoresNeutral() {
        assertThat(scoring.getPriceScore(400_000, null)).isEqualTo(0.5);
    }

    @Test
    void nonPositiveBudgetScoresNeutral() {
        assertThat(scoring.getPriceScore(400_000, 0)).isEqualTo(0.5);
        assertThat(scoring.getPriceScore(400_000, -1)).isEqualTo(0.5);
    }

    @Test
    void priceUnderBudgetScoresOne() {
        assertThat(scoring.getPriceScore(400_000, BUDGET)).isEqualTo(1.0);
    }

    @Test
    void priceExactlyAtBudgetScoresOne() {
        assertThat(scoring.getPriceScore(BUDGET, BUDGET)).isEqualTo(1.0);
    }

    // Integer division used to truncate the overage to 0, scoring this a perfect 1.0.
    @Test
    void tenPercentOverBudgetScoresNinetyPercent() {
        assertThat(scoring.getPriceScore(550_000, BUDGET)).isCloseTo(0.9, within(1e-9));
    }

    @Test
    void doubleBudgetScoresZero() {
        assertThat(scoring.getPriceScore(1_000_000, BUDGET)).isCloseTo(0.0, within(1e-9));
    }

    @Test
    void farOverBudgetClampsToZero() {
        assertThat(scoring.getPriceScore(1_500_000, BUDGET))
                .isEqualTo(0.0)
                .isGreaterThanOrEqualTo(0.0);
    }

    // The property the bug violated: every over-budget price used to score identically.
    @Test
    void scoreStrictlyDecreasesAsPriceRisesAboveBudget() {
        double slightlyOver = scoring.getPriceScore(510_000, BUDGET);
        double moreOver = scoring.getPriceScore(520_000, BUDGET);
        double mostOver = scoring.getPriceScore(530_000, BUDGET);

        assertThat(slightlyOver).isGreaterThan(moreOver);
        assertThat(moreOver).isGreaterThan(mostOver);
    }
}
