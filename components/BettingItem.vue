Копировать код
<template>
  <v-card>
    <v-card-title class="d-flex justify-right">
      {{ event.participant1 }} vs {{ event.participant2 }}
    </v-card-title>

    <v-card-actions class="d-flex justify-center align-center">
      <v-btn small @click="$emit('place-bet', event, 'П1')">П1 {{ event.current_odds_p1 }}</v-btn>
      <v-btn small @click="$emit('place-bet', event, 'Х')">Х {{ event.current_odds_x }}</v-btn>
      <v-btn small @click="$emit('place-bet', event, 'П2')">П2 {{ event.current_odds_p2 }}</v-btn>
    </v-card-actions>
    <v-row class="text-center" dense>
      <v-col cols="12">
        <v-progress-linear height="20" rounded>
          <!-- П1 -->
          <v-progress-linear
            slot="default"
            :value="percentP1"
            color="#4CAF50"
            height="20"
          >
            <template v-slot:default="{ value }">
              <div class="d-flex justify-center align-center" style="color: white;">
                {{ countP1 }} ({{ percentP1 }}%)
              </div>
            </template>
          </v-progress-linear>

          <!-- Х -->
          <v-progress-linear
            slot="default"
            :value="percentX"
            color="#2196F3"
            height="20"
          >
            <template v-slot:default="{ value }">
              <div class="d-flex justify-center align-center" style="color: white;">
                {{ countX }} ({{ percentX }}%)
              </div>
            </template>
          </v-progress-linear>

          <!-- П2 -->
          <v-progress-linear
            slot="default"
            :value="percentP2"
            color="#FFC107"
            height="20"
          >
            <template v-slot:default="{ value }">
              <div class="d-flex justify-center align-center" style="color: white;">
                {{ countP2 }} ({{ percentP2 }}%)
              </div>
            </template>
          </v-progress-linear>
        </v-progress-linear>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  props: {
    event: {
      type: Object,
      required: true
    },
    countP1: {
      type: Number,
      default: 0
    },
    countX: {
      type: Number,
      default: 0
    },
    countP2: {
      type: Number,
      default: 0
    },
  },
  computed: {
    totalCount() {
      return this.countP1 + this.countX + this.countP2;
    },
    percentP1() {
      return this.totalCount > 0 ? (this.countP1 / this.totalCount) * 100 : 0;
    },
    percentX() {
      return this.totalCount > 0 ? (this.countX / this.totalCount) * 100 : 0;
    },
    percentP2() {
      return this.totalCount > 0 ? (this.countP2 / this.totalCount) * 100 : 0;
    },
    pageCount() {
      return Math.ceil(this.filteredEvents.length / this.itemsPerPage);
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
.v-chip {
  font-weight: bold;
}

</style>
