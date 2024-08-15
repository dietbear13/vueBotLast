<template>
  <v-card>
    <v-card-title class="d-flex justify-center">
      {{ event.participant1 }} vs {{ event.participant2 }}
    </v-card-title>
    <v-card-actions class="d-flex justify-around">
      <v-btn small @click="$emit('place-bet', event, 'П1')">П1: {{ event.current_odds_p1 }}</v-btn>
      <v-btn small @click="$emit('place-bet', event, 'Х')">Х: {{ event.current_odds_x }}</v-btn>
      <v-btn small @click="$emit('place-bet', event, 'П2')">П2: {{ event.current_odds_p2 }}</v-btn>
    </v-card-actions>
    <v-card-subtitle class="text-center">
      Общее количество ставок: {{ event.total_bets }}
    </v-card-subtitle>
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
  created() {
    console.log("BettingItem Created with Event:", this.event);
    if (!this.event) {
      console.error("Prop 'event' is missing or undefined");
    } else {
      console.log("Event Content:", this.event);
    }
  },
  methods: {
    async placeBet(outcome) {
      try {
        console.log("Placing bet on:", outcome);
        const response = await this.$axios.post('/api/events/vote', {
          eventId: this.event._id,
          outcome,
          betAmount: this.selectedBetAmount // Использование выбранной суммы ставки
        });
        console.log('Ставка успешно сделана', response);
        this.event = response.data.event; // Обновление данных события после ставки
      } catch (error) {
        console.error('Ошибка при попытке сделать ставку', error);
      }
    }
  },
  watch: {
    event: {
      handler(newValue) {
        console.log("Event prop updated:", newValue);
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style scoped>
.v-card {
  background-color: #1E1E1E;
  color: #ECEFF1;
}
.v-card-title {
  font-weight: bold;
}
.v-card-actions {
  margin-top: 10px;
}
.v-btn {
  background-color: #2A2A2A;
  color: #00BFA6;
}
.v-card-subtitle {
  margin-top: 10px;
  font-size: 0.9em;
}
</style>
