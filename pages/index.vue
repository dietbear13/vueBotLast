<template>
  <v-container>
    <PageHeader title="Розыгрыши" />
    <v-row>
      <v-col v-for="giveaway in giveaways" :key="giveaway._id" cols="12" md="6">
        <GiveAwayItem :giveaway="giveaway" />
      </v-col>
    </v-row>
    <FooterMenu />
  </v-container>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue';
import GiveAwayItem from "../components/GiveAwayItem.vue";
import FooterMenu from '../components/FooterMenu.vue';
import moment from 'moment'; // Используем библиотеку moment.js для форматирования даты

export default {
  components: {
    PageHeader,
    GiveAwayItem,
    FooterMenu
  },
  data() {
    return {
      giveaways: []
    };
  },
  mounted() {
    this.fetchGiveaways();
  },
  methods: {
    async fetchGiveaways() {
      try {
        const { data } = await this.$api.giveaways();
        this.giveaways = data.filter(giveaway => giveaway.title)
          .map(giveaway => {
            return {
              ...giveaway,
              formattedDate: moment(giveaway.event_date).format('DD.MM') // Форматируем дату
            };
          });
      } catch (error) {
        console.error("Ошибка загрузки данных", error);
      }
    }
  }
}
</script>
