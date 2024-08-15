<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-title>{{ event.participant1 }} vs {{ event.participant2 }}</v-card-title>
        <v-card-subtitle>Коэффициенты:</v-card-subtitle>
        <v-card-actions>
          <v-btn small @click="$emit('place-bet', event, 'П1')">П1: {{ event.current_odds_p1 }}</v-btn>
          <v-btn small @click="$emit('place-bet', event, 'Х')">Х: {{ event.current_odds_x }}</v-btn>
          <v-btn small @click="$emit('place-bet', event, 'П2')">П2: {{ event.current_odds_p2 }}</v-btn>
        </v-card-actions>
        <v-card-subtitle>
          Общее количество ставок: {{ event.total_bets }}
        </v-card-subtitle>
        <!-- Временный текст -->
        <div>Компонент BettingItem рендерится</div>
      </v-card>
    </v-col>
  </v-row>
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
</style>
