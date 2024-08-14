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
        this.giveaways = data.filter(giveaway => giveaway.title);
      } catch (error) {
        console.error("Ошибка загрузки данных", error);
      }
    }
  }
}
</script>
