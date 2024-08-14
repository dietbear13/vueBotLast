<template>
  <v-card>
    <v-card-title class="event-title">{{ event.title }}</v-card-title>
    <v-card-subtitle class="event-subtitle">
      <div class="team-name">{{ event.participant1 }} vs {{ event.participant2 }}</div>
    </v-card-subtitle>
    <v-card-text>
      <div class="odds-container">
        <div class="odds-block">
          <span class="odds-label">П1</span>
          <span class="odds-value">{{ event.current_odds_p1 }}</span>
        </div>
        <div class="odds-block">
          <span class="odds-label">Х</span>
          <span class="odds-value">{{ event.current_odds_x }}</span>
        </div>
        <div class="odds-block">
          <span class="odds-label">П2</span>
          <span class="odds-value">{{ event.current_odds_p2 }}</span>
        </div>
      </div>
      <v-row>
        <v-col>
          <div class="betting-amounts">
            <v-btn
              v-for="amount in betOptions"
              :key="amount"
              :class="{'selected': selectedBetAmount === amount}"
              class="amount-button"
              @click="selectBetAmount(amount)"
            >
              {{ amount }}
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="betting-actions">
      <v-btn @click="placeBet('P1')" class="bet-button">П1</v-btn>
      <v-btn @click="placeBet('X')" class="bet-button">Х</v-btn>
      <v-btn @click="placeBet('P2')" class="bet-button">П2</v-btn>
    </v-card-actions>
    <p>Общее число ставок: {{ event.total_bets }}</p>

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
.event-title {
  font-size: 1.5rem;
  color: #FFFFFF;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
}

.event-subtitle {
  font-size: 1rem;
  color: #b0b0b0;
  text-align: center;
  margin-bottom: 10px;
}

.team-name {
  font-weight: bold;
  font-size: 1.2rem;
  color: #FFFFFF;
}

.odds-container {
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
  align-items: center;
}

.odds-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #404040; /* Changed to a lighter shade */
  padding: 15px 25px; /* Increased padding for longer blocks */
  border-radius: 12px; /* More rounded corners */
  width: auto; /* Allows dynamic width */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3); /* Slightly darker shadow */
}

.odds-label {
  font-size: 1rem;
  color: #FFFFFF;
  margin-bottom: 5px;
}

.odds-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #00FFFF;
}

.betting-amounts {
  display: flex;
  justify-content: center; /* Centering the buttons */
  gap: 10px; /* Adding space between buttons */
  margin: 20px 0;
}

.amount-button {
  background-color: #3a3a3a;
  color: #FFFFFF;
  font-weight: bold;
  border-radius: 8px;
  width: 60px;
  height: 40px;
  transition: background-color 0.2s ease, transform 0.2s ease;
  border: 2px solid #FF6EC7; /* Adding a border for better visibility */
}

.amount-button:hover {
  background-color: #565656;
}

.amount-button.selected {
  background-color: #FF6EC7;
  transform: scale(1.1);
}

.bet-button {
  background-color: #FF6EC7;
  color: #FFFFFF;
  font-weight: bold;
  border-radius: 8px;
  width: 80px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
  border: 2px solid #FFFFFF; /* Adding a white border for contrast */
}

.bet-button:active {
  transform: scale(1.1);
}
</style>
