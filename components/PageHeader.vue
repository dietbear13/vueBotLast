<template>
  <v-container class="page-header">
    <div class="header">
      <BalanceDisplay />
      <h1 class="page-title">{{ title }}</h1>
      <v-divider class="my-4"></v-divider>
    </div>
  </v-container>
</template>

<script>
import BalanceDisplay from "@/components/BalanceDisplay.vue";

export default {
  props: {
    title: {
      type: String,
      required: true
    }
  },
  components: {
    BalanceDisplay
  }
}
</script>

<style scoped>
.page-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.page-title {
  font-size: 2rem;
  color: #FF6EC7;
  text-align: center;
  margin-bottom: 10px;
  text-shadow: 0 0 5px rgba(255, 110, 199, 0.8), 0 0 10px rgba(255, 110, 199, 0.6);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }
}
</style>
