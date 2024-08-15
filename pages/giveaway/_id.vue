<template>
  <v-container class="giveaway-details">
    <PageHeader title="Детали розыгрыша" />
    <p v-if="giveaway" class="giveaway-description">
      Здесь находится информация о розыгрыше <span>{{ giveaway.title }}</span>
    </p>

    <!-- Добавленный блок для сообщения о награде -->
    <p v-if="rewardMessage" class="reward-message">{{ rewardMessage }}</p>

    <v-list lines="one" v-if="giveaway">
      <v-list-item v-for="channel in giveaway.channels" :key="channel.id" class="channel-item">
        <v-card
          class="w-100 channel-card"
          outlined
          @click="openChannel(channel.link)"
        >
          <v-card-title>
            <v-row class="align-center w-100">
              <v-col cols="12" class="d-flex">
                <v-avatar
                  :size="64"
                  class="channel-avatar mr-2"
                  :src="channel.avatar"
                  aspect-ratio="1"
                  contain
                ></v-avatar>

                <v-list-item-content>
                  <v-list-item-title class="channel-name">{{ channel.name }}</v-list-item-title>
                </v-list-item-content>
              </v-col>
              <v-card-actions>
                <v-icon v-if="channel.subscribed" color="success" class="check-icon">mdi-check-circle</v-icon>
                <v-btn v-else variant="text" text class="custom-btn" color="primary" @click.stop="checkSubscription(channel)">
                  Проверить
                </v-btn>
              </v-card-actions>
            </v-row>
          </v-card-title>
        </v-card>
      </v-list-item>
    </v-list>
    <v-snackbar v-model="snackbar" :timeout="2000" top right :color="snackbarColor">
      {{ snackbarMessage }}
    </v-snackbar>
    <FooterMenu />
  </v-container>
</template>

<script>
import FooterMenu from '../../components/FooterMenu.vue';
import PageHeader from '../../components/PageHeader.vue';

export default {
  components: {
    FooterMenu,
    PageHeader
  },
  name: 'DefaultLayout',
  data() {
    return {
      giveaway: null,
      rewardMessage: '',
      snackbar: false,
      snackbarMessage: '',
      snackbarColor: '',
      telegram: null // Для Telegram SDK
    };
  },

  async mounted() {
    try {
      this.telegram = window.Telegram.WebApp;
      this.telegram.ready();

      const initData = this.telegram.initDataUnsafe;
      const userId = initData && initData.user && initData.user.id;
      if (userId) {
        await this.getUserBalance(userId);
      } else {
        console.error('Ошибка: ID пользователя не найден');
      }

      await this.loadGiveawayData();
      this.getTelegramChannelAvatar();
    } catch (error) {
      console.error('Ошибка инициализации Telegram WebApp', error);
    }
  },

  methods: {
    async loadGiveawayData() {
      try {
        const { data } = await this.$api.giveaway(this.$route.params.id);
        this.giveaway = data;
        await this.checkAllSubscriptions();
      } catch (error) {
        console.error("Ошибка при загрузке данных розыгрыша:", error);
      }
    },

    async checkSubscription(channel) {
      try {
        const telegramId = this.telegram.initDataUnsafe.user.id;

        const response = await this.$axios.post(`/api/check-subscription`, {
          telegramId,
          channelId: channel.id
        });

        const isSubscribed = response.data.isMember;

        if (isSubscribed) {
          this.$set(channel, 'subscribed', true);
          this.snackbarMessage = 'Вы успешно подписаны на канал';
          this.snackbarColor = 'green';

          await this.$axios.post(`/api/subscribe`, {
            telegramId,
            channelId: channel.id,
            giveawayId: this.giveaway._id
          });

          await this.checkAllSubscriptions();
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

    async getUserBalance(userId) {
      try {
        const { data } = await this.$api.getUserBalance(userId);
      } catch (error) {
        console.error("Ошибка при получении баланса пользователя:", error);
      }
    },

    async checkAllSubscriptions() {
      try {
        const telegramId = this.telegram.initDataUnsafe.user.id;
        const response = await this.$axios.get(`/api/get-subscriptions/${telegramId}`);
        const userSubscriptions = response.data.channels;

        let allSubscribed = true;
        this.giveaway.channels.forEach(channel => {
          const subscription = userSubscriptions.find(sub => sub.id === channel.id);
          if (subscription && subscription.subscribed) {
            this.$set(channel, 'subscribed', true);
          } else {
            allSubscribed = false;
          }
        });

        if (allSubscribed) {
          this.rewardMessage = `Выдана награда ${this.giveaway.prize} монет`;
        }
      } catch (error) {
        console.error('Ошибка проверки подписок', error);
      }
    },

    openChannel(link) {
      window.open(link, '_blank');
    },

    goBack() {
      this.$router.push({ name: 'index' });
    },

    getTelegramChannelAvatar() {
      const avatarUrl = this.telegram.initDataUnsafe.user?.photo_url;
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
  color: #00BFA6; /* Мятный цвет */
  font-weight: bold;
}

.reward-message {
  color: #00BFA6; /* Мятный цвет */
  font-weight: bold;
  margin-top: 20px;
}

.channel-item {
  margin-bottom: 16px;
  width: 100%; /* Делаем элементы на 100% ширины */
}

.channel-card {
  background-color: #1E1E1E; /* Темная подложка */
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
  color: #00BFA6; /* Мятный цвет */
}

.back-btn {
  width: 100%;
  background-color: #00BFA6; /* Мятный цвет */
  color: #121212; /* Темный текст */
  font-weight: bold;
  text-transform: uppercase;
}

.v-snackbar {
  background-color: #1e1e1e;
}

.v-btn {
  font-weight: bold;
  text-transform: uppercase;
  color: #00BFA6; /* Мятный цвет */
}
</style>
