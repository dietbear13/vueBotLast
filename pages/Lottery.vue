<template>
  <v-container>
    <v-row class="text-center">
      <v-col>
        <PageHeader title="Лотерея"/>
        <v-card outlined class="mx-auto my-4">
          <v-card-title>1st Place: {{ prizes.first }} ₿</v-card-title>
          <v-card-title>2nd Place: {{ prizes.second }} ₿</v-card-title>
          <v-card-title>3rd Place: {{ prizes.third }} ₿</v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="text-center my-4">
      <v-col>
        <h2>Купите лотерейные билеты</h2>
        <v-btn color="primary" @click="buyTicket">Купить билет</v-btn>
        <div>Ваши билеты: {{ userTickets.length }}</div>
        <div>Всего продано билетов: {{ totalTickets }}</div>
        <div>Ваш шанс на выигрыш: {{ winChance }}%</div>
      </v-col>
    </v-row>

    <v-row class="text-center my-4">
      <v-col>
        <h2>Розыгрыш заканчивается через:</h2>
        <v-countdown :time="remainingTime"/>
      </v-col>
    </v-row>
    <FooterMenu/>
  </v-container>
</template>

<script>
import FooterMenu from "~/components/FooterMenu.vue";

export default {
  components: {FooterMenu},
  data() {
    return {
      prizes: {
        first: 0.1,
        second: 0.05,
        third: 0.02
      },
      totalTickets: 0,
      userTickets: [],
      winChance: 0,
      remainingTime: 0 // time in milliseconds
    };
  },
  methods: {
    buyTicket() {
      // Call backend API to buy a ticket
      // Generate a unique ticket ID and add to userTickets
    },
    calculateWinChance() {
      // Calculate win chance based on userTickets and totalTickets
    },
    fetchLotteryData() {
      // Fetch current lottery data, including prizes, tickets, and remaining time
    }
  },
  mounted() {
    this.fetchLotteryData();
    this.calculateWinChance();
  }
};
</script>

<style scoped>
/* Add some basic styles to align with your current theme */
</style>
