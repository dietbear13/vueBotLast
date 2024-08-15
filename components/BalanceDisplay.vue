<template>
  <v-card>
    <v-card-title>Баланс</v-card-title>
    <v-card-text>
      <div class="balance">{{ balance }} ₿</div>
    </v-card-text>
  </v-card>
</template>

<script>
import { retrieveLaunchParams } from '@telegram-apps/sdk';

export default {
  data() {
    return {
      balance: 0,
      frozenBalance: 0,
      loading: true,
      error: null
    };
  },
  async mounted() {
    try {
      // Получаем initData из Telegram Web App SDK
      const { initData } = retrieveLaunchParams();

      // Извлекаем Telegram User ID
      const userId = initData && initData.user && initData.user.id;

      if (userId) {
        await this.getUserBalance(userId);
      } else {
        console.error('Ошибка: ID пользователя не найден');
        this.error = "Ошибка: ID пользователя не найден";
      }
    } catch (error) {
      console.error("Ошибка инициализации Telegram WebApp", error);
      this.error = "Ошибка инициализации Telegram WebApp";
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async getUserBalance(telegramId) {
      try {
        const response = await fetch(`/api/balance/${telegramId}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Пользователь не найден');
          }
          throw new Error('Ошибка получения баланса');
        }
        const data = await response.json();
        this.balance = data.balance;
        this.frozenBalance = data.frozenBalance;
      } catch (error) {
        console.error('Ошибка:', error);
        this.error = 'Ошибка загрузки баланса';
      }
    },
  }
}
</script>

<style scoped>
.balance {
  font-size: 24px;
  color: #00BFA6; /* Мятный цвет */
}
</style>
