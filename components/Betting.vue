<!--<template>-->
<!--  <v-container>-->
<!--    <PageHeader title="Ставки" />-->

<!--    &lt;!&ndash; Табы для выбора спорта &ndash;&gt;-->
<!--    <v-tabs v-model="selectedSport" grow>-->
<!--      <v-tab v-for="(icon, sport) in sports" :key="sport">-->
<!--        <v-icon>{{ icon }}</v-icon> {{ sport }}-->
<!--      </v-tab>-->
<!--    </v-tabs>-->

<!--    <v-divider class="my-4"></v-divider>-->

<!--    &lt;!&ndash; Таблица с событиями и коэффициентами &ndash;&gt;-->
<!--    <v-table dense>-->
<!--      <thead>-->
<!--      <tr>-->
<!--        <th>Событие</th>-->
<!--        <th>Коэффициенты</th>-->
<!--        <th>Общее количество ставок</th>-->
<!--      </tr>-->
<!--      </thead>-->
<!--      <tbody>-->
<!--      <tr v-for="event in filteredEvents" :key="event._id">-->
<!--        <BettingItem :event="event" @place-bet="openBetDialog" />-->
<!--      </tr>-->
<!--      </tbody>-->
<!--    </v-table>-->

<!--    &lt;!&ndash; Диалог для ввода суммы ставки &ndash;&gt;-->
<!--    <v-dialog v-model="betDialog" max-width="400">-->
<!--      <v-card>-->
<!--        <v-card-title>Ставка на {{ selectedOutcome }}</v-card-title>-->
<!--        <v-card-text>-->
<!--          <v-text-field v-model="betAmount" label="Введите сумму ставки" type="number"></v-text-field>-->
<!--        </v-card-text>-->
<!--        <v-card-actions>-->
<!--          <v-btn color="primary" @click="placeBet">Поставить</v-btn>-->
<!--          <v-btn text @click="closeBetDialog">Отмена</v-btn>-->
<!--        </v-card-actions>-->
<!--      </v-card>-->
<!--    </v-dialog>-->

<!--    <FooterMenu />-->
<!--  </v-container>-->
<!--</template>-->

<!--<script>-->
<!--import FooterMenu from '../components/FooterMenu.vue';-->
<!--import PageHeader from '../components/PageHeader.vue';-->
<!--import BettingItem from "../components/BettingItem.vue";-->

<!--export default {-->
<!--  components: {-->
<!--    FooterMenu,-->
<!--    PageHeader,-->
<!--    BettingItem,-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      selectedSport: 'Футбол',-->
<!--      sports: {-->
<!--        'Футбол': 'mdi-soccer',-->
<!--        'Теннис': 'mdi-tennis',-->
<!--        // Добавить другие виды спорта при необходимости-->
<!--      },-->
<!--      events: [],-->
<!--      betDialog: false,-->
<!--      selectedOutcome: '',-->
<!--      betAmount: 0,-->
<!--      selectedEvent: null,-->
<!--    };-->
<!--  },-->
<!--  computed: {-->
<!--    filteredEvents() {-->
<!--      return this.events.filter(event => event.sport === this.selectedSport);-->
<!--    }-->
<!--  },-->
<!--  methods: {-->
<!--    openBetDialog(event, outcome) {-->
<!--      this.selectedEvent = event;-->
<!--      this.selectedOutcome = outcome;-->
<!--      this.betDialog = true;-->
<!--    },-->
<!--    closeBetDialog() {-->
<!--      this.betDialog = false;-->
<!--      this.selectedOutcome = '';-->
<!--      this.betAmount = 0;-->
<!--    },-->
<!--    async placeBet() {-->
<!--      try {-->
<!--        console.log(`Ставка на ${this.selectedOutcome} в событии ${this.selectedEvent.title} на сумму ${this.betAmount}`);-->
<!--        this.closeBetDialog();-->
<!--      } catch (error) {-->
<!--        console.error('Ошибка при попытке сделать ставку', error);-->
<!--      }-->
<!--    },-->
<!--    async fetchEvents() {-->
<!--      try {-->
<!--        const { data } = await this.$api.sportsEvents();-->
<!--        console.log("Fetched Events Data:", data);  // Лог для проверки данных-->
<!--        this.events = data;-->
<!--      } catch (error) {-->
<!--        console.error("Ошибка загрузки данных о спортивных событиях", error);-->
<!--      }-->
<!--    }-->
<!--  },-->
<!--  async mounted() {-->
<!--    await this.fetchEvents();-->
<!--  }-->
<!--};-->
<!--</script>-->

<!--<style scoped>-->
<!--.v-simple-table th {-->
<!--  background-color: #1E1E1E;-->
<!--  color: #ECEFF1;-->
<!--}-->

<!--.v-simple-table td {-->
<!--  background-color: #2A2A2A;-->
<!--  color: #ECEFF1;-->
<!--  padding: 10px;-->
<!--}-->

<!--.v-btn {-->
<!--  margin: 5px;-->
<!--}-->
<!--</style>-->
