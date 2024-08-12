<template>
  <v-footer app>
    <v-btn v-for="item in menuItems" :key="item.text" @click="navigate(item.link)">
      {{ item.text }}
    </v-btn>
  </v-footer>
</template>

<script>
export default {
  data() {
    return {
      menuItems: [
        { text: 'Розыгрыши', link: '/' },
        { text: 'Ставки', link: '/betting' },
        { text: 'Аккаунт', link: '/protocol' }
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
