<template>
  <v-footer app class="footer-menu">
    <v-btn
      v-for="item in menuItems"
      :key="item.text"
      @click="navigate(item.link)"
      :class="['menu-item', { active: isActive(item.link) }]"
      flat
    >
      <v-icon>{{ item.icon }}</v-icon>
      <span>{{ item.text }}</span>
    </v-btn>
  </v-footer>
</template>

<script>
export default {
  data() {
    return {
      menuItems: [
        { text: 'Заработок', link: '/', icon: 'mdi-trophy' },
        { text: 'Ставки', link: '/betting', icon: 'mdi-cash' },
        { text: 'Аккаунт', link: '/protocol', icon: 'mdi-account' }
      ]
    };
  },
  methods: {
    navigate(link) {
      window.location.href = link;
    },
    isActive(link) {
      return window.location.pathname === link;
    }
  }
};
</script>

<style scoped>
.footer-menu {
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  background-color: #1E1E1E; /* Темная подложка */
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.5);
}

.menu-item {
  flex: 1;
  text-align: center;
  color: #ECEFF1; /* Белый текст */
  font-size: 0.85rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
  transition: color 0.3s, transform 0.3s;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

.menu-item > .v-icon {
  font-size: 1.8rem !important;
  margin-bottom: 10px !important;
}

.menu-item span {
  font-size: 0.75rem !important;
  display: block;
}

.menu-item.active {
  color: #00BFA6 !important; /* Мятный цвет для активного элемента */
  transform: translateY(-2px) !important;
}

.menu-item.active .v-icon {
  color: #00BFA6 !important; /* Мятный цвет иконки для активного элемента */
}
</style>
