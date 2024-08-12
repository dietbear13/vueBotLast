<template>
    <v-app>
      <v-main>
        <Nuxt />
        <FooterMenu />

      </v-main>
    </v-app>
  </template>

  <script>
  import FooterMenu from '../components/FooterMenu.vue';

  export default {
    components: {
      FooterMenu
    },
    mounted() {
      this.miniApp.postEvent('web_app_setup_back_button', { is_visible: true });

      console.log('App mounted');
    },
  };
  </script>

  <style >
  </style>
