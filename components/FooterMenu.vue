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

<style>
.footer-menu {
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  background-color: #121212;
}

.menu-item {
  flex: 1;
  text-align: center;
  color: #FFF;
  font-size: 0.85rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
  transition: color 0.3s, transform 0.3s;
  border: none !important; /* Убираем рамку */
  outline: none !important; /* Убираем выделение */
  box-shadow: none !important; /* Убираем тень */
}

.menu-item > .v-icon {
  font-size: 1.8rem !important; /* Увеличиваем размер иконки */
  margin-bottom: 10px !important; /* Уменьшаем отступ снизу */
}

.menu-item span {
  font-size: 0.75rem !important; /* Немного уменьшаем размер текста */
  display: block;
}

.menu-item.active {
  color: #FF6EC7 !important;
  transform: translateY(-2px) !important;
}

.menu-item.active .v-icon {
  color: #FF6EC7 !important;
}

.menu-item:focus, .menu-item:active {
  outline: none !important; /* Убираем фокус при клике */
  box-shadow: none !important; /* Убираем тени при клике */
}
</style>
