<template>
  <div>
    <!-- Ваш шаблон -->
  </div>
</template>

<script>
export default {
  props: {
    event: {
      type: Object,
      required: true,
    },
    userBets: {
      type: Array,
      required: true,
    },
  },
  computed: {
    totalBets() {
      return this.userBets.length;
    },
    userOdds() {
      if (this.totalBets === 0) {
        return {
          p1: this.event.odds_p1,
          x: this.event.odds_x,
          p2: this.event.odds_p2,
        };
      }

      const p1Bets = this.userBets.filter(bet => bet.outcome === 'П1').length;
      const xBets = this.userBets.filter(bet => bet.outcome === 'Х').length;
      const p2Bets = this.userBets.filter(bet => bet.outcome === 'П2').length;

      const p1Ratio = p1Bets / this.totalBets;
      const xRatio = xBets / this.totalBets;
      const p2Ratio = p2Bets / this.totalBets;

      return {
        p1: this.calculateUserOdds(p1Ratio, this.event.odds_p1),
        x: this.calculateUserOdds(xRatio, this.event.odds_x),
        p2: this.calculateUserOdds(p2Ratio, this.event.odds_p2),
      };
    },
  },
  methods: {
    calculateUserOdds(userRatio, originalOdds) {
      const margin = 0.05; // Маржа букмекера (например, 5%)
      const baseProbability = 1 / originalOdds;

      // Применение пользовательского коэффициента на основе соотношения ставок
      let impliedProbability = baseProbability * (1 - margin) + userRatio * margin;

      // Преобразование вероятности обратно в коэффициент
      let adjustedOdds = 1 / impliedProbability;

      return adjustedOdds.toFixed(2);
    },
  },
};
</script>

<style scoped>
/* Ваши стили */
</style>
