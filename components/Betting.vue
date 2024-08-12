<template>
  <v-container>
    <v-card-title>
      <h1 class="text-center">Ставки</h1>
    </v-card-title>

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
    }
  },

  components: {
    EventItem,
    FooterMenu,
  },
};
</script>
