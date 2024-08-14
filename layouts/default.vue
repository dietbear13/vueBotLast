<template>
  <v-app dark>

    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>

  </v-app>
</template>

<style scoped>
/* Основной фон и текст */
.custom-app {
  background-color: #121212; /* Темный фон */
  color: #FFFFFF; /* Белый текст */
  font-family: 'Roboto', sans-serif;
}

/* Настройка контейнера */
.custom-container {
  padding: 20px;
}

/* Кнопки с неоновым эффектом */
.v-btn {
  background-color: #ff6ec7; /* Неоновый акцент */
  color: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(255, 110, 199, 0.7), 0 0 20px rgba(255, 110, 199, 0.7);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: rgba(255, 110, 199, 0.8); /* Темный оттенок с помощью rgba */
    box-shadow: 0 0 20px rgba(255, 110, 199, 0.7), 0 0 30px rgba(255, 110, 199, 0.7);
  }
}

/* Карточки с неоновыми тенями */
.v-card {
  background-color: #1E1E1E;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 229, 255, 0.7), 0 0 10px rgba(0, 229, 255, 0.7);
  padding: 16px;
}

/* Неоновый стиль для нижнего меню */
.v-bottom-navigation {
  background-color: #ff4081; /* Неоновый фон для нижнего меню */
  box-shadow: 0 0 10px rgba(255, 64, 129, 0.7);

  .v-btn {
    background: none;
    border: none;
    color: #FFFFFF;
    transition: color 0.3s ease;

    &:hover {
      color: #00e5ff; /* Изменение цвета при наведении */
    }
  }

  img {
    filter: drop-shadow(0 0 5px #00e5ff); /* Неоновая подсветка иконок */
  }
}
</style>

<script>
export default {
  name: 'DefaultLayout',
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  }
}
</script>


