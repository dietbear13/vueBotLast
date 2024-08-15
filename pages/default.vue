<template>
  <div class="custom-app">
    <v-app class="custom-app">
      <v-main>
        <Nuxt />
      </v-main>
    </v-app>
  </div>
</template>

<style scoped>
/* Основной фон и текст */
.custom-app {
  background-color: #121212 !important;
  color: #FFFFFF !important;
  font-family: 'Roboto', sans-serif;
}

/* Настройка контейнера */
.custom-container {
  padding: 20px;
}

/* Карточки */
.v-card {
  background-color: #1E1E1E;
  color: #FFFFFF; /* Белый текст */
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 229, 255, 0.7), 0 0 10px rgba(0, 229, 255, 0.7);
  padding: 16px;
}

/* Кнопки */
.v-btn {
  background-color: #ff6ec7; /* Неоновый акцент */
  color: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(255, 110, 199, 0.7), 0 0 20px rgba(255, 110, 199, 0.7);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: rgba(255, 110, 199, 0.8);
    box-shadow: 0 0 20px rgba(255, 110, 199, 0.7), 0 0 30px rgba(255, 110, 199, 0.7);
  }
}

/* Нижнее меню */
.v-bottom-navigation {
  background-color: #ff4081; /* Неоновый фон для нижнего меню */
  box-shadow: 0 0 10px rgba(255, 64, 129, 0.7);

  .v-btn {
    background: none;
    border: none;
    color: #FFFFFF;
    transition: color 0.3s ease;

    &:hover {
      color: #00e5ff;
    }
  }

  img {
    filter: drop-shadow(0 0 5px #00e5ff);
  }
}
</style>

<script>
import FooterMenu from '../components/FooterMenu.vue';
import BalanceDisplay from '../components/BalanceDisplay.vue';

export default {
  components: {
    FooterMenu,
    BalanceDisplay
  },
  name: 'DefaultLayout',
  data() {
    return {
      giveaway: null,
      rewardMessage: '',
      snackbar: false,
      snackbarMessage: '',
      snackbarColor: '',
      telegram: null,
      price: 0,
    };
  },

  async mounted() {
    try {
      // Получаем initData из Telegram Web App SDK
      const { initData } = retrieveLaunchParams();


      console.log('initData DEFAULT:', initData);

      // Извлекаем Telegram User ID
      const userId = initData && initData.user && initData.user.id;

      if (userId) {
        console.log('Telegram User ID:', userId);

        // Отправляем запрос на сервер для получения баланса
        await this.getUserBalance(userId);
      } else {
        console.error('Ошибка: ID пользователя не найден');
      }

      await this.loadGiveawayData();
      if (!this.giveaway) {
        console.log('Данные о розыгрыше не загружены.');
      }

      this.getTelegramChannelAvatar();
    } catch (error) {
      console.error('Ошибка инициализации Telegram WebApp', error);
    }
  },

  methods: {
    async getUserBalance(telegramId) {
      try {
        const response = await fetch(`/balance/${telegramId}`);
        if (!response.ok) throw new Error('Ошибка получения баланса');
        const data = await response.json();
        this.balance = data.balance;
        this.frozenBalance = data.frozenBalance;
        console.log('Баланс получен:', data);
      } catch (error) {
        console.error('Ошибка:', error);
      }
    }
  }
};
</script>
