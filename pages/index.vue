<template>
  <v-container>
    <v-card-title>
      <h1 class="text-center">Розыгрыши</h1>
    </v-card-title>

    <v-divider class="my-4"></v-divider>

    <v-row>
      <v-col v-for="giveaway in giveaways" :key="giveaway._id" cols="12" md="6">
        <GiveAwayItem :giveaway="giveaway" />
      </v-col>
    </v-row>

    <FooterMenu />
  </v-container>
</template>

<script>
import GiveAwayItem from "../components/GiveAwayItem.vue";
import FooterMenu from '../components/FooterMenu.vue';

export default {
  data() {
    return {
      giveaways: [],
    };
  },

  async fetch() {
    try {
      const { data } = await this.$api.giveaways();
      console.log("Полученные данные:", data);
      this.giveaways = data.filter(giveaway => giveaway.title); // Убедитесь, что поле `title` существует
    } catch (error) {
      console.error("Ошибка загрузки данных", error);
    }
  },

  async mounted() {
    try {
      console.log("Telegram App:", this.$tg);
      const optionalParams = this.$tg.initData;
      console.log("Пользовательские данные:", optionalParams);

      await this.$tg.ready();
      await this.$tg.expand();

      console.log("Параметры пользователя: " + optionalParams);

      this.$tg.showConfirm("Параметры пользователя: " + optionalParams, () => {
        console.log("Пользователь подтвердил");
      });

      this.$tg.miniApp.MainButton.setText("Test");
      this.$tg.miniApp.MainButton.enable();
      this.$tg.miniApp.MainButton.show();
    } catch (error) {
      console.error("Ошибка инициализации Telegram WebApp", error);
    }
  },

  methods: {
    viewGiveaway(id) {
      this.$router.push({ name: "giveaway-id", params: { id } });
    }
  },

  components: { GiveAwayItem, FooterMenu },
};
</script>

<style scoped>
/* Ваши стили */
</style>
