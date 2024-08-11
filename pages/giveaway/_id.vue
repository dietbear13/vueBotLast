<template>
  <v-container>
    <v-divider class="my-4">
      <h1 class="text-center">Детали розыгрыша</h1>
    </v-divider>
      <p>Здесь находится информация о розыгрыше {{ giveaway.title }}</p>
      <v-list lines="one">
        <v-list-item v-for="channel in giveaway.channels" :key="channel.id">
          <v-card class="w-100 clickable-card" @click="openChannel(channel.link)">
            <v-card-title>
              <v-row class="align-center w-100">
                <v-col cols="3">
                  <v-img :width="124" aspect-ratio="16/9" class="mr-1" :src="channel.avatar"></v-img>
                </v-col>
                <v-col cols="6">
                  <v-list-item-content>
                    <v-list-item-title class="channel-name">{{ channel.name }}</v-list-item-title>
                  </v-list-item-content>
                </v-col>
                <v-col cols="6" class="text-right">
                  <template v-if="!channel.subscribed">
                    <v-btn class="custom-btn mx-2" elevation="24" color="primary" @click.stop="checkSubscription(channel)">
                      Проверить
                    </v-btn>
                  </template>
                  <template v-else>
                    <v-icon color="green" class="mx-2">mdi-check-circle</v-icon>
                  </template>
                </v-col>
              </v-row>
            </v-card-title>
          </v-card>
        </v-list-item>
      </v-list>
      <v-btn class="custom-btn mt-4" elevation="24" color="primary" @click="goBack">Назад</v-btn>
    <v-snackbar v-model="snackbar" :timeout="4000" top right :color="snackbarColor">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  async fetch(){
    console.log("params", this.$route.params)
    const {data} = await this.$api.giveaway(this.$route.params.id);
    this.giveaway = data
    console.log("fetchh ", data)
  },
  mounted(){

  },
  data() {
    return {
      giveaway: null,
      snackbar: false,
      snackbarMessage: '',
      snackbarColor: ''
    };
  },
  methods: {
    async fetch() {
      try {
        const { data } = await this.$axios.get(`/api/giveaways/${this.$route.params.id}`);
        this.giveaway = data;
      } catch (error) {
        console.error("Ошибка при загрузке данных розыгрыша:", error);
      }
    },

    openChannel(link) {
      window.open(link, '_blank');
    },
    async checkSubscription(channel) {
      try {
        const userId = this.$route.params.userId; // Ensure userId is passed in route params
        const response = await axios.get(`/api/users/${userId}`);
        const user = response.data;

        const subscription = user.subscriptions.find(sub => sub.channelId === channel.id && sub.giveawayId === this.giveaway._id);

        if (subscription && subscription.subscribed) {
          this.$set(channel, 'subscribed', true);
          this.snackbarMessage = 'Вы успешно подписались на канал';
          this.snackbarColor = 'green';
        } else {
          this.snackbarMessage = 'Вы не подписаны на канал';
          this.snackbarColor = 'red';
        }
        this.snackbar = true;
      } catch (error) {
        console.error('Ошибка проверки подписки', error);
        this.snackbarMessage = 'Ошибка проверки подписки';
        this.snackbarColor = 'red';
        this.snackbar = true;
      }
    },
    goBack() {
      this.$router.push({ name: 'index' });
    }
  }
};
</script>

<style scoped>
</style>
