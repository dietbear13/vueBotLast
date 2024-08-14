<template>
  <v-container>
    <PageHeader title="Ставки" />

    <v-divider class="my-4"></v-divider>

    <v-row>
      <v-col v-for="event in events" :key="event._id" cols="12" md="6">
        <EventItem :event="event" />
      </v-col>
    </v-row>
    <FooterMenu />
  </v-container>
</template>

<script>
import EventItem from "../components/EventItem.vue";
import FooterMenu from '../components/FooterMenu.vue';
import PageHeader from '../components/PageHeader.vue';
export default {
  data() {
    return {
      events: [],
      betOptions: [10, 50, 100, 500, 1000]
    };
  },

  async mounted() {
    await this.fetchEvents(); // Fetch data when the component is mounted
  },

  methods: {
    async fetchEvents() {
      try {
        const {data} = await this.$api.sportsEvents();
        this.events = data; // Populate the `events` array with data from the backend
      } catch (error) {
        console.error("Ошибка загрузки данных о спортивных событиях", error);
      }
    },
    placeBet(amount) {
      console.log(`Поставить ${amount}`);
      // Реализация ставки
    }
  },

  components: {
    EventItem,
    FooterMenu,
    PageHeader
  },
};
</script>

<style scoped>
.betting-container {
  display: flex;
  justify-content: space-around;
  padding: 20px;
}

.bet-button {
  font-size: 1.25rem;
  color: #000;
  background-color: #FF6EC7;
  margin: 5px;
  transition: transform 0.2s ease;
}

.bet-button:active {
  transform: scale(1.1);
}
</style>
