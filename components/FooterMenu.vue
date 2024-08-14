<template>
  <v-footer app class="footer-menu">
    <v-btn
      v-for="item in menuItems"
      :key="item.text"
      @click="navigate(item.link)"
      class="menu-item"
    >
      <v-icon>{{ item.icon }}</v-icon>

    </v-btn>
  </v-footer>
</template>

<script>
export default {
  data() {
    return {
      menuItems: [
        { text: 'Розыгрыши', link: '/', icon: 'mdi-trophy' },
        { text: 'Ставки', link: '/betting', icon: 'mdi-cash' },
        { text: 'Аккаунт', link: '/protocol', icon: 'mdi-account' }
      ]
    };
  },
  methods: {
    navigate(link) {
      window.location.href = link;
    }
  }
};
</script>

<style scoped>
.footer-menu {
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  background-color: #121212; /* Заменили на реальное значение цвета */
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.5);
}

.menu-item {
  flex: 1;
  text-align: center;
  color: #FFF;
  font-size: 1rem;
}

.menu-item v-icon {
  font-size: 1.5rem;
  margin-bottom: 5px;
  display: block;
}
</style>
