<template>
  <v-container class="giveaway-details">
    <PageHeader title="Детали розыгрыша" />
    <v-divider class="my-4"></v-divider>

    <!-- Информация о розыгрыше -->
    <p v-if="giveaway" class="giveaway-description">
      Здесь находится информация о розыгрыше <span>{{ giveaway.title }}</span>
    </p>

    <!-- Сообщение о награде или предупреждение о неполной подписке -->
    <p v-if="rewardMessage" class="reward-message">{{ rewardMessage }}</p>
    <p v-else-if="!allSubscribed" class="warning-message">Вы не подписаны на все каналы розыгрыша!</p>

    <!-- Список каналов -->
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
                <v-btn v-else variant="text" class="custom-btn" color="primary" @click.stop="checkSubscription(channel)">
                  Проверить
                </v-btn>
              </v-card-actions>
            </v-row>
          </v-card-title>
        </v-card>
      </v-list-item>
    </v-list>

    <!-- Кнопка проверки награды -->
    <v-btn
      v-if="allSubscribed && !rewardGiven"
      class="mt-4"
      color="primary"
      @click="checkReward"
    >
      Проверить награду
    </v-btn>

    <!-- Уведомление (Snackbar) -->
    <v-snackbar v-model="snackbar" :timeout="2000" top right :color="snackbarColor">
      {{ snackbarMessage }}
    </v-snackbar>

    <FooterMenu />
  </v-container>
</template>

<script>
import FooterMenu from '../../components/FooterMenu.vue';
import api from "@/plugins/custom/api";

export default {
  components: {
    FooterMenu
  },
  data() {
    return {
      giveaway: null,
      rewardMessage: '',
      rewardGiven: false, // Новый флаг для отслеживания, была ли выдана награда
      allSubscribed: false,  // Флаг для отслеживания подписки на все каналы
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
      const userId = initData?.user?.id;

      if (userId) {
        await this.loadGiveawayData();
        await this.checkAllSubscriptions();
      } else {
        console.error('Ошибка: ID пользователя не найден');
      }
    } catch (error) {
      console.error('Ошибка инициализации Telegram WebApp', error);
    }
  },

  methods: {
    async checkReward() {
      try {
        const telegramId = this.telegram.initDataUnsafe.user.id;
        console.log(`Проверка награды для пользователя: ${telegramId}`);

        const rewardCheck = await this.$axios.get(`/api/check-reward`, {
          params: { telegramId, giveawayId: this.giveaway._id }
        });

        if (!rewardCheck.data.rewardReceived) {
          console.log("Начисление награды:", this.giveaway.price);

          await this.$axios.post(`/api/give-reward`, {
            telegramId,
            giveawayId: this.giveaway._id,
            prize: this.giveaway.price
          });
          this.rewardMessage = `Выдана награда ${this.giveaway.price} монет`;
          this.rewardGiven = true; // Устанавливаем флаг, что награда была выдана
          this.snackbarMessage = 'Награда успешно выдана';
          this.snackbarColor = 'green';
        } else {
          this.rewardMessage = `Награда уже была выдана ранее`;
          this.snackbarMessage = 'Награда уже была выдана ранее';
          this.snackbarColor = 'blue';
        }

        this.snackbar = true;

      } catch (error) {
        console.error('Ошибка при проверке награды', error);
        this.snackbarMessage = 'Ошибка при проверке награды';
        this.snackbarColor = 'red';
        this.snackbar = true;
      }
    },

    async loadGiveawayData() {
      try {
        const { data } = await this.$axios.get(`/api/giveaways/${this.$route.params.id}`);
        this.giveaway = data;
        await this.checkAllSubscriptions(); // Перенос вызова сюда, чтобы проверить подписки после загрузки розыгрыша
      } catch (error) {
        console.error("Ошибка при загрузке данных розыгрыша:", error);
      }
    },

    async checkSubscription(channel) {
      try {
        const telegramId = this.telegram.initDataUnsafe.user.id;
        console.log(`Проверка подписки на канал: ${channel.id} пользователем: ${telegramId}`);

        // Вызов API Telegram для получения статуса пользователя в чате
        const response = await this.$axios.post(`/api/check-subscription`, {
          telegramId,
          channelId: channel.id
        });

        const isSubscribed = response.data.isMember;
        console.log(`Результат проверки подписки на канал ${channel.id}:`, isSubscribed);

        if (isSubscribed) {
          // Обновляем подписку на сервере
          const subscribeResponse = await this.$axios.post(`/api/subscribe`, {
            telegramId,
            channelId: channel.id,
            giveawayId: this.giveaway._id
          });
          console.log(`Результат обновления подписки на сервере для канала ${channel.id}:`, subscribeResponse.data);

          // Обновление UI после успешной подписки
          this.$set(channel, 'subscribed', true);
          this.snackbarMessage = subscribeResponse.data.message;
          this.snackbarColor = 'green';

          await this.checkAllSubscriptions();

        } else {
          // Если пользователь не подписан
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

    async checkAllSubscriptions() {
      try {
        const telegramId = this.telegram.initDataUnsafe.user.id;
        console.log(`Проверка всех подписок для пользователя: ${telegramId}`);

        const response = await this.$axios.get(`/api/get-subscriptions/${telegramId}`);
        const userSubscriptions = response.data.channels;
        console.log('Текущие подписки пользователя:', userSubscriptions);

        this.allSubscribed = this.giveaway.channels.every(channel => {
          const subscription = userSubscriptions.find(sub => sub.channelId === channel.id); // проверка по channelId

          console.log(`Подписка на канал ${channel.id}:`, subscription);

          if (subscription) {
            this.$set(channel, 'subscribed', subscription.subscribed);
          }
          return subscription && subscription.subscribed;
        });

        console.log(`Результат проверки всех подписок: ${this.allSubscribed ? 'все подписаны' : 'не все подписаны'}`);

        // Проверка награды после подтверждения всех подписок
        if (this.allSubscribed) {
          const rewardCheck = await this.$axios.get(`/api/check-reward`, {
            params: { telegramId, giveawayId: this.giveaway._id }
          });
          this.rewardGiven = rewardCheck.data.rewardReceived;

          if (this.rewardGiven) {
            this.rewardMessage = `Награда уже была выдана ранее`;
          }
        }
      } catch (error) {
        console.error('Ошибка проверки подписок', error);
      }
    },

    openChannel(link) {
      window.open(link, '_blank');
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

.reward-message, .warning-message {
  color: #00BFA6; /* Мятный цвет */
  font-weight: bold;
  margin-top: 20px;
}

.warning-message {
  color: #FF5252; /* Красный цвет */
}

.channel-item {
  margin-bottom: 16px;
  width: 100%;
}

.channel-card {
  background-color: #1E1E1E;
  border-radius: 12px;
  padding: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
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
  color: #00BFA6;
}

.v-snackbar {
  background-color: #1e1e1e;
}

.v-btn {
  font-weight: bold;
  text-transform: uppercase;
  color: #00BFA6;
}
</style>
