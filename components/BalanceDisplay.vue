<template>
  <div class="balance-container">
    <div class="balance-item">
      <p class="balance-amount">{{ balance }} ₿</p>
    </div>
<!--    <div class="balance-item">-->
<!--      <h1 class="balance-label">Заморожено:</h1>-->
<!--      <p class="balance-amount">{{ frozenBalance }} ₿</p>-->
<!--    </div>-->
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px; /* Уменьшены отступы */
  background-color: #121212;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.balance-item {
  display: flex;
  align-items: center;
}

.balance-label {
  font-size: 0.9rem; /* Немного уменьшен размер шрифта */
  color: #e0e0e0;
  margin-right: 4px; /* Уменьшен отступ между текстом */
  white-space: nowrap;
}

.balance-amount {
  font-size: 1.2rem; /* Уменьшен размер текста */
  color: #00FFFF;
  font-weight: bold;
  white-space: nowrap;
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
