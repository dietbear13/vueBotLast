<template>
  <v-card>
    <v-card-title>{{ event.title }}</v-card-title>
    <v-card-subtitle>{{ event.participant1 }} vs {{ event.participant2 }}</v-card-subtitle>
    <v-card-text>
      <p>Коэффициенты:</p>
      <v-row>
        <v-col>П1: {{ event.current_odds_p1 }}</v-col>
        <v-col>Х: {{ event.current_odds_x }}</v-col>
        <v-col>П2: {{ event.current_odds_p2 }}</v-col>
      </v-row>
      <p>Общее число ставок: {{ event.total_bets }}</p> <!-- Новая строка для отображения общего числа ставок -->
      <v-row>
        <v-col>
          <v-text-field
            v-model="betAmount"
            label="Ставка (от 10 до 1000 монет)"
            type="number"
            :rules="[v => !!v || 'Обязательно', v => v >= 10 && v <= 1000 || 'Ставка от 10 до 1000']"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="placeBet('P1')">Ставка на П1</v-btn>
      <v-btn @click="placeBet('X')">Ставка на Х</v-btn>
      <v-btn @click="placeBet('P2')">Ставка на П2</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      betAmount: 10
    };
  },
  methods: {
    async placeBet(outcome) {
      try {
        const response = await this.$axios.post('/api/events/vote', {
          eventId: this.event._id,
          outcome,
          betAmount: this.betAmount
        });
        console.log('Ставка успешно сделана', response);
        this.event = response.data.event; // Обновляем данные события после ставки
      } catch (error) {
        console.error('Ошибка при попытке сделать ставку', error);
      }
    }
  }
};
</script>
