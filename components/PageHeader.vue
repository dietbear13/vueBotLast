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
.v-toolbar-title {
  font-weight: bold;
  font-size: 18px;
}
</style>
