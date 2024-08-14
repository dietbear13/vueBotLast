<template>
  <div class="balance-container">
    <div v-if="loading" class="loading">Загрузка баланса...</div>
    <div v-else>
      <p>Баланс: <span class="balance-amount">{{ balance }} ₿</span></p>
      <p>Заморожено: <span class="balance-amount">{{ frozenBalance }} ₿</span></p>
    </div>
  </div>
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
.balance-container {
  text-align: center;
  padding: 10px;
}

.balance-amount {
  font-size: 1.5rem;
  color: #00FFFF;
}

.loading {
  color: #00FFFF;
}

.balance-update-animation {
  animation: pulse 1s ease-in-out;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
