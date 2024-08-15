<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2>Тестирование расчета коэффициентов на основе ставок пользователей</h2>
      </v-col>
    </v-row>

    <!-- Проходим по всем тестовым случаям и выводим результаты -->
    <v-row v-for="(testCase, index) in testCases" :key="index">
      <v-col cols="12">
        <h3>{{ testCase.event.title }} ({{ testCase.userBets.length }} пользователей)</h3>
        <div>
          <strong>Распределение ставок:</strong>
          <div>П1: {{ testCase.p1Votes }} голосов ({{ (testCase.p1Ratio * 100).toFixed(2) }}%)</div>
          <div>Х: {{ testCase.xVotes }} голосов ({{ (testCase.xRatio * 100).toFixed(2) }}%)</div>
          <div>П2: {{ testCase.p2Votes }} голосов ({{ (testCase.p2Ratio * 100).toFixed(2) }}%)</div>
        </div>
        <div>
          <strong>Коэффициенты букмекера:</strong>
          <div>П1: {{ testCase.event.odds_p1 }} | Х: {{ testCase.event.odds_x }} | П2: {{ testCase.event.odds_p2 }}</div>
        </div>
        <div>
          <strong>Коэффициенты на основе ставок пользователей:</strong>
          <div>
            П1: {{ testCase.userOdds.p1 }} | Х: {{ testCase.userOdds.x }} | П2: {{ testCase.userOdds.p2 }}
          </div>
        </div>
        <v-divider class="my-4"></v-divider>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PredictionCalculator from './PredictionCalculator.vue';

export default {
  components: {
    PredictionCalculator
  },
  data() {
    return {
      testCases: this.generateTestCases()
    };
  },
  methods: {
    generateTestCases() {
      const testCases = [
        {
          event: {
            _id: 'event1',
            title: 'Football Match',
            odds_p1: 1.8,
            odds_x: 3.2,
            odds_p2: 2.1,
          },
          userBets: this.generateUserBets(50, 0.5, 0.3, 0.2),
        },
        {
          event: {
            _id: 'event2',
            title: 'Tennis Match',
            odds_p1: 2.5,
            odds_x: 3.0,
            odds_p2: 2.8,
          },
          userBets: this.generateUserBets(350, 0.3, 0.5, 0.2),
        },
        {
          event: {
            _id: 'event3',
            title: 'Football Match',
            odds_p1: 1.8,
            odds_x: 3.2,
            odds_p2: 2.1,
          },
          userBets: this.generateUserBets(17621, 0.2, 0.2, 0.6),
        }
      ];

      // Добавляем информацию о голосах и перерасчитанные коэффициенты
      return testCases.map(testCase => {
        const p1Votes = testCase.userBets.filter(bet => bet.outcome === 'П1').length;
        const xVotes = testCase.userBets.filter(bet => bet.outcome === 'Х').length;
        const p2Votes = testCase.userBets.filter(bet => bet.outcome === 'П2').length;
        const totalVotes = p1Votes + xVotes + p2Votes;

        const p1Ratio = p1Votes / totalVotes;
        const xRatio = xVotes / totalVotes;
        const p2Ratio = p2Votes / totalVotes;

        const userOdds = this.calculateUserOdds(
          p1Ratio, xRatio, p2Ratio,
          testCase.event.odds_p1, testCase.event.odds_x, testCase.event.odds_p2
        );

        return {
          ...testCase,
          p1Votes,
          xVotes,
          p2Votes,
          p1Ratio,
          xRatio,
          p2Ratio,
          userOdds
        };
      });
    },

    generateUserBets(totalUsers, p1Ratio, xRatio, p2Ratio) {
      const userBets = [];
      const outcomes = ['П1', 'Х', 'П2'];
      const ratios = [p1Ratio, xRatio, p2Ratio];

      for (let i = 0; i < totalUsers; i++) {
        const randomValue = Math.random();
        let cumulativeRatio = 0;
        for (let j = 0; j < outcomes.length; j++) {
          cumulativeRatio += ratios[j];
          if (randomValue < cumulativeRatio) {
            userBets.push({eventId: 'event1', userId: `user${i}`, outcome: outcomes[j]});
            break;
          }
        }
      }
      return userBets;
    },

    calculateUserOdds(p1Ratio, xRatio, p2Ratio, odds_p1, odds_x, odds_p2) {
      const correlationFactor = 0.5;
      const adjustmentFactor = (p1Ratio + xRatio + p2Ratio) / 3;

      const newOddsP1 = odds_p1 * (1 - correlationFactor * (p1Ratio - adjustmentFactor));
      const newOddsX = odds_x * (1 - correlationFactor * (xRatio - adjustmentFactor));
      const newOddsP2 = odds_p2 * (1 - correlationFactor * (p2Ratio - adjustmentFactor));

      return {
        p1: newOddsP1.toFixed(2),
        x: newOddsX.toFixed(2),
        p2: newOddsP2.toFixed(2)
      };
    }
  }
};
</script>

<style scoped>
h2 {
  color: #ECEFF1;
}

h3 {
  color: #00BFA6;
}
</style>
