<template>
  <v-card class="balance-card">
    <v-card-title class="d-flex justify-end align-center">
      <!-- Вся строка с балансом и иконкой -->
      <div class="d-flex align-center">
        <div class="balance">{{ balance }} ₿</div>
        <v-icon size="44" @click="goToAccountPage" class="account-icon" color="#00BFA6">mdi-account-circle</v-icon>
      </div>
    </v-card-title>
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
      error: null,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      try {
        const { initData } = retrieveLaunchParams();

        const userId = initData?.user?.id;

        if (userId) {
          await this.getUserBalance(userId);
        } else {
          console.error('Ошибка: ID пользователя не найден');
          this.error = 'Ошибка: ID пользователя не найден';
        }
      } catch (error) {
        console.error('Ошибка инициализации Telegram WebApp', error);
        this.error = 'Ошибка инициализации Telegram WebApp';
      } finally {
        this.loading = false;
      }
    },
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
    goToAccountPage() {
      this.$router.push('/account');
    },
  },
};
</script>

<style scoped>
.balance {
  font-size: 24px;
  color: #00BFA6; /* Мятный цвет */
  margin-right: 16px;
}

.account-icon {
  cursor: pointer;
  transition: color 0.3s;
}

</style>
