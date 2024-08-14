<template>
  <v-container class="giveaway-details">
    <PageHeader title="Детали розыгрыша" />
    <v-divider class="my-4"></v-divider>
    <p v-if="giveaway" class="giveaway-description">
      Здесь находится информация о розыгрыше <span>{{ giveaway.title }}</span>
    </p>
    <v-list lines="one" v-if="giveaway">
      <v-list-item v-for="channel in giveaway.channels" :key="channel.id" class="channel-item">
        <v-card
          class="w-100 channel-card"
          outlined
          @click="openChannel(channel.link)"
        >
          <v-card-title>
            <v-row class="align-center w-100">
              <v-col cols="3">
                <v-img
                  :width="64"
                  aspect-ratio="1"
                  class="channel-avatar"
                  :src="channel.avatar"
                  contain
                ></v-img>
              </v-col>
              <v-col cols="6">
                <v-list-item-content>
                  <v-list-item-title class="channel-name">{{ channel.name }}</v-list-item-title>
                </v-list-item-content>
              </v-col>
              <v-col cols="3" class="text-right">
                <template v-if="channel.subscribed">
                  <v-icon color="success" class="check-icon">mdi-check-circle</v-icon>
                </template>
                <template v-else>
                  <v-btn class="custom-btn" elevation="5" color="primary" @click.stop="checkSubscription(channel)">
                    Проверить
                  </v-btn>
                </template>
              </v-col>
            </v-row>
          </v-card-title>
        </v-card>
      </v-list-item>
    </v-list>
    <v-btn class="back-btn mt-4" elevation="8" color="accent" @click="goBack">
      Назад
    </v-btn>
    <v-snackbar v-model="snackbar" :timeout="4000" top right :color="snackbarColor">
      {{ snackbarMessage }}
    </v-snackbar>
    <FooterMenu />
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      giveaway: null,
      snackbar: false,
      snackbarMessage: '',
      snackbarColor: ''
    };
  },
  async mounted() {
    await this.loadGiveawayData();
    if (!this.giveaway) {
      console.log('Данные о розыгрыше не загружены.');
    }

    this.getTelegramChannelAvatar();
  },
  methods: {
    async loadGiveawayData() {
      console.log("params", this.$route.params);
      try {
        const { data } = await this.$api.giveaway(this.$route.params.id);
        console.log("Data loaded", data); // Логируем загруженные данные
        this.giveaway = data;

        // После загрузки данных о розыгрыше проверяем подписки
        await this.checkAllSubscriptions();
      } catch (error) {
        console.error("Ошибка при загрузке данных розыгрыша:", error);
      }
    },
    async checkAllSubscriptions() {
      try {
        const telegramId = window.Telegram.WebApp.initDataUnsafe.user.id; // Получаем telegramId пользователя
        const response = await this.$axios.get(`/api/get-subscriptions/${telegramId}`);
        const userSubscriptions = response.data.channels;

        // Обновляем статус подписки для каждого канала
        this.giveaway.channels.forEach(channel => {
          const subscription = userSubscriptions.find(sub => sub.id === channel.id);
          if (subscription && subscription.subscribed) {
            this.$set(channel, 'subscribed', true);
          }
        });
      } catch (error) {
        console.error('Ошибка проверки подписок', error);
      }
    },
    async checkSubscription(channel) {
      try {
        const telegramId = window.Telegram.WebApp.initDataUnsafe.user.id; // Получаем telegramId пользователя
        const response = await this.$axios.post(`/api/check-subscription`, {
          telegramId,
          channelId: channel.id
        });
        const isSubscribed = response.data.isMember;

        if (isSubscribed) {
          this.$set(channel, 'subscribed', true);
          this.snackbarMessage = 'Вы успешно подписаны на канал';
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
    openChannel(link) {
      window.open(link, '_blank');
    },
    goBack() {
      this.$router.push({ name: 'index' });
    },
    getTelegramChannelAvatar() {
      const tg = window.Telegram.WebApp;
      const avatarUrl = tg.initDataUnsafe.user?.photo_url;
      if (avatarUrl) {
        console.log("Telegram Channel Avatar URL:", avatarUrl);
      } else {
        console.log("Аватарка пользователя недоступна.");
      }
    }
  }
};
</script>

<style scoped>
.giveaway-details {
  background-color: #121212;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
}

.giveaway-description span {
  color: #FF6EC7;
  font-weight: bold;
}

.channel-item {
  margin-bottom: 16px;
  width: 100%; /* Делаем элементы на 100% ширины */
}

.channel-card {
  background: linear-gradient(45deg, #FF6EC7, #00FFFF);
  border-radius: 12px;
  padding: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 100%; /* Делаем карточки на 100% ширины */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); /* Добавляем тень */
}

.channel-avatar {
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.channel-name {
  color: #e0e0e0;
  font-weight: bold;
  font-size: 1rem;
}

.check-icon {
  font-size: 24px;
}

.back-btn {
  width: 100%;
  background-color: #FF6EC7;
  color: #000;
  font-weight: bold;
  text-transform: uppercase;
}

.v-snackbar {
  background-color: #1e1e1e;
}

.v-btn {
  font-weight: bold;
  text-transform: uppercase;
}
</style>
