<template>
  <v-dialog v-model="dialog" persistent max-width="600px" @click-outside="closeDialog">
    <v-card>
      <v-card-title class="d-flex justify-between align-center">
        <v-btn icon @click="goBack">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <span class="title">  Аккаунт</span>
        <v-spacer></v-spacer>
      </v-card-title>

      <v-card-text>
        <v-row justify="center">
          <v-col cols="12" md="8">
            <v-card-title class="d-flex justify-center">
              {{ userProfile.firstName }} {{ userProfile.lastName }}
            </v-card-title>
            <v-card-subtitle class="d-flex justify-center">
              @{{ userProfile.username }}
            </v-card-subtitle>
            <v-card-text class="text-center">
              <p><strong>Telegram ID:</strong> {{ userProfile.telegramId }}</p>
              <p><strong>Баланс:</strong> {{ userProfile.balance }} ₿</p>
              <p><strong>Замороженный баланс:</strong> {{ userProfile.frozenBalance }} ₿</p>
            </v-card-text>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import FooterMenu from '../components/FooterMenu.vue';
import axios from 'axios';
import {retrieveLaunchParams} from "@telegram-apps/sdk";

export default {
  components: {
    FooterMenu,
  },
  data() {
    return {
      dialog: true,
      userProfile: {
        telegramId: '',
        firstName: '',
        lastName: '',
        username: '',
        avatarUrl: '',
        balance: 0,
        frozenBalance: 0,
      },
      defaultAvatar: 'https://via.placeholder.com/120', // Замените на путь к вашему изображению-заполнителю
    };
  },
  async created() {
    try {
      const { initData } = retrieveLaunchParams();
      const userId = initData?.user?.id;
      if (userId) {
        await this.getUserProfile(userId);
      } else {
        console.error('Ошибка: ID пользователя не найден');
      }
    } catch (error) {
      console.error('Ошибка инициализации Telegram WebApp', error);
    }
  },
  methods: {
    async getUserProfile(telegramId) {
      try {
        const { data } = await axios.get(`/api/user/profile`, { params: { telegramId } });
        this.userProfile = {
          telegramId: data.telegramId,
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
          avatarUrl: data.avatarUrl,
          balance: data.balance,
          frozenBalance: data.frozenBalance,
        };
      } catch (error) {
        console.error('Ошибка при загрузке данных профиля пользователя:', error);
      }
    },
    goBack() {
      this.$router.go(-1); // Возвращает пользователя на предыдущую страницу
    },
    closeDialog() {
      this.dialog = false; // Закрывает диалог, если пользователь кликнет за пределами
      this.$router.push('/'); // Возвращает на главную страницу или в любое другое нужное место
    },
  },
};
</script>

<style scoped>
.title {
  font-weight: bold;
  font-size: 20px;
}

.v-avatar {
  margin-top: 20px;
  margin-bottom: 20px;
}

.v-card-title {
  font-weight: bold;
}

.v-card-subtitle {
  color: #00BFA6;
  font-size: 1.1em;
}

.v-card-text p {
  margin: 10px 0;
}
</style>
