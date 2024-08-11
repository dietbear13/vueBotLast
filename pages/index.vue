<template>

  <v-container>
    <v-divider class="my-4">
      <h1 class="text-center">Розыгрыши</h1>
    </v-divider>
    <v-row>
      <v-col v-for="giveaway in giveaways" :key="giveaway._id" cols="12" md="6">
        <GiveAwayItem :giveaway="giveaway"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import GiveAwayItem from "../components/GiveAwayItem.vue"

export default {
  data() {
    return {
      giveaways: [],
    };
  },
  // fetchOnServer: true,
  async fetch() {


    try {
      console.log("this", this)
      const {data} = await this.$api.giveaways();
      console.log("data", data)
      this.giveaways = data.filter(giveaway => giveaway.title);
    } catch (error) {
      console.error("Ошибка загрузки данных", error);
    }
  },
  async mounted() {
    try {
      console.log("tgapp", this.$tg)
      console.log("user", this.$tg.initDataUnsafe)
      let optionalParams = this.$tg.initData;
      console.log("user", optionalParams)

      await this.$tg.ready()
      await this.$tg.expand()
      console.log("user: " + optionalParams)

      this.$tg.showConfirm("user " + optionalParams, () => {
        console.log("ok")
      })

      this.$tg.miniApp.MainButton.setText("test")
      this.$tg.miniApp.MainButton.enable()
      this.$tg.miniApp.MainButton.show()
    } catch (error) {
      console.error("Ошибка загрузки данных", error);
    }
  },
  methods: {
    viewGiveaway(id) {
      this.$router.push({name: "giveaway-id", params: {id}});
    }
  },
  components: {GiveAwayItem}
};
</script>

<style scoped>

</style>
