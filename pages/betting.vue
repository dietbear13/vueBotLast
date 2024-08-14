<template>
  <v-container>
    <PageHeader title="Ставки" />
    <v-row>
      <v-col v-for="event in events" :key="event._id" cols="12" md="6">
        <EventItem :event="event" />
      </v-col>
    </v-row>
    <FooterMenu />
  </v-container>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue';
import EventItem from "../components/EventItem.vue";
import FooterMenu from '../components/FooterMenu.vue';

export default {
  components: {
    PageHeader,
    EventItem,
    FooterMenu
  },
  data() {
    return {
      events: []
    };
  },
  mounted() {
    this.fetchEvents();
  },
  methods: {
    async fetchEvents() {
      try {
        const {data} = await this.$api.sportsEvents();
        this.events = data;
      } catch (error) {
        console.error("Ошибка загрузки данных о спортивных событиях", error);
      }
    }
  }
}
</script>
