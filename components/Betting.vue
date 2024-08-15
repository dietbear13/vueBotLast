<template>
  <v-container>
    <PageHeader title="Ставки" />

    <v-divider class="my-4"></v-divider>

    <v-row>
      <v-col v-for="event in events" :key="event._id" cols="12">
        <v-card class="event-card">
          <v-card-title class="event-title">
            <v-chip class="sport-tag" color="primary" text-color="white">{{ event.sport }}</v-chip>
            {{ event.title }}
          </v-card-title>
          <v-card-subtitle class="event-time">
            {{ event.time }}
          </v-card-subtitle>
          <v-card-text class="event-odds">
            <v-row>
              <v-col v-for="(odds, index) in event.odds" :key="index" class="odds-col">
                <div class="odds-type">{{ odds.type }}</div>
                <div class="odds-value">{{ odds.value }}</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <FooterMenu/>
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
  },

  components: {
    EventItem,
    FooterMenu,
    PageHeader
  },
};
</script>

<style scoped>
.event-card {
  background-color: #1E1E1E;
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

.event-time {
  color: #B0BEC5;
  font-size: 0.9rem;
  margin-top: 5px;
}

.event-odds {
  margin-top: 10px;
}

.odds-col {
  text-align: center;
}

.odds-type {
  font-size: 0.85rem;
  color: #B0BEC5;
}

.odds-value {
  font-size: 1.1rem;
  color: #00BFA6; /* Мятный цвет */
}
</style>
