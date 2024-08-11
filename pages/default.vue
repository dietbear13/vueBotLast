<template>
    <v-app>
      <v-main>
        <Nuxt />
      </v-main>
    </v-app>
  </template>

  <script>
  export default {
    mounted() {
      console.log('App mounted');
    },
  };
  </script>

  <style scoped>
  body {
    background-color: #121212;
    color: #E0E0E0;
    font-family: 'Poppins', sans-serif;
  }

  .bottom-nav {
    background-color: #1E1E1E;
    border-top: 1px solid #00FF7F;
  }

  .v-btn {
    color: #E0E0E0;
    transition: color 0.3s ease;
  }

  .v-btn:hover {
    color: #00FFFF;
  }

  .v-icon {
    color: #8A2BE2;
  }

  .v-btn--active .v-icon {
    color: #00FF7F;
  }
  </style>
