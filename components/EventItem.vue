<template>
  <v-card class="event-card">
    <v-card-title class="event-title">
      <v-chip class="sport-tag" color="primary" text-color="white">{{ event.sport }}</v-chip>
      {{ event.title }}
    </v-card-title>
    <v-card-subtitle class="event-subtitle">
      {{ event.participant1 }} vs {{ event.participant2 }}
    </v-card-subtitle>
    <v-card-text class="odds-container">
      <v-row no-gutters>
        <v-col class="odds-block">
          <span class="odds-label">П1</span>
          <span class="odds-value">{{ event.current_odds_p1 }}</span>
        </v-col>
        <v-col class="odds-block">
          <span class="odds-label">Х</span>
          <span class="odds-value">{{ event.current_odds_x }}</span>
        </v-col>
        <v-col class="odds-block">
          <span class="odds-label">П2</span>
          <span class="odds-value">{{ event.current_odds_p2 }}</span>
        </v-col>
      </v-row>
    </v-card-text>
    <p class="event-time">{{ event.time }}</p>
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
      betOptions: [10, 50, 100, 500, 1000], // Predefined bet amounts
      selectedBetAmount: 10 // Default selected bet amount
    };
  },
  methods: {
    selectBetAmount(amount) {
      this.selectedBetAmount = amount; // Update the selected bet amount
    },
    async placeBet(outcome) {
      try {
        const response = await this.$axios.post('/api/events/vote', {
          eventId: this.event._id,
          outcome,
          betAmount: this.selectedBetAmount // Use the selected bet amount
        });
        console.log('Ставка успешно сделана', response);
        this.event = response.data.event; // Update event data after the bet
      } catch (error) {
        console.error('Ошибка при попытке сделать ставку', error);
      }
    }
  }
};
</script>

<style scoped>
.event-card {
  background-color: #1E1E1E; /* Темная подложка */
  margin-bottom: 20px;
  padding: 10px;
  color: #ECEFF1;
}

.event-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  font-size: 1.2rem;
}

.sport-tag {
  font-size: 0.8rem;
  margin-right: 10px;
}

.event-subtitle {
  color: #B0BEC5;
  font-size: 1rem;
  margin-bottom: 5px;
}

.odds-container {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}

.odds-block {
  text-align: center;
  padding: 10px;
  background-color: #2A2A2A; /* Светлее для контраста */
  border-radius: 8px;
  width: 100%;
  margin: 5px;
}

.odds-label {
  font-size: 0.85rem;
  color: #B0BEC5;
}

.odds-value {
  font-size: 1.3rem;
  color: #00BFA6; /* Мятный цвет */
  font-weight: bold;
}

.event-time {
  color: #B0BEC5;
  font-size: 0.9rem;
  text-align: right;
  margin-top: 10px;
}
</style>
