<template>
  <v-container>
    <PageHeader title="Ставки" />

    <!-- Табы для выбора спорта -->
    <v-tabs v-model="selectedSport" grow>
      <v-tab v-for="(icon, sport) in sports" :key="sport" :value="sport">
        <v-icon>{{ icon }}</v-icon> {{ sport }}
      </v-tab>
    </v-tabs>

    <v-divider class="my-4"></v-divider>

    <!-- Таблица с событиями и коэффициентами -->
    <v-data-table
      :headers="headers"
      :items="events"
      :items-per-page="5"
      :custom-filter="filterBySport"
      :search="selectedSport"

      class="elevation-1"
      item-key="event._id"

      dense
    >
      <template v-slot:item.actions="{ item }">
        <!-- Здесь рендерится BettingItem с переданным event -->
        <BettingItem :event="item" @place-bet="openBetDialog" />

      </template>
    </v-data-table>
    <div v-if="events.length === 0">Нет доступных событий</div>
    <div v-else>
      <div v-for="event in events" :key="event._id">{{ event }}</div>
    </div>

    <!-- Диалог для ввода суммы ставки -->
    <v-dialog v-model="betDialog" max-width="400">
      <v-card>
        <v-card-title>Ставка на {{ selectedOutcome }}</v-card-title>
        <v-card-text>
          <v-text-field v-model="betAmount" label="Введите сумму ставки" type="number"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="placeBet">Поставить</v-btn>
          <v-btn text @click="closeBetDialog">Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <FooterMenu />
  </v-container>
</template>

<script>
import FooterMenu from '../components/FooterMenu.vue';
import PageHeader from '../components/PageHeader.vue';
import BettingItem from "../components/BettingItem.vue";

export default {
  components: {
    FooterMenu,
    PageHeader,
    BettingItem,
  },
  data() {
    return {
      selectedSport: 'football', // Выбранный спорт по умолчанию
      sports: {
        'football': 'mdi-soccer',
        'tennis': 'mdi-tennis',
        // Добавить другие виды спорта при необходимости
      },
      events: [], // Сюда будут загружены события
      betDialog: false,
      selectedOutcome: '',
      betAmount: 0,
      selected: null,
      headers: [
        { text: 'Событие', value: 'participant1' },
        { text: 'Коэффициенты', value: 'actions', sortable: false },
        { text: 'Общее количество ставок', value: 'total_bets', sortable: false }
      ]
    };
  },
  computed: {
    filteredEvents() {
      console.log("!!! event:", this.events);
      console.log("!!! Selected Sport:", this.selectedSport);

      console.log("Selected Sport:", this.selectedSport);
      const filtered = this.events.filter(event => event.typeEvent === this.selectedSport);
      console.log("Filtered Events:", filtered);
      return filtered;
    }
  },
  methods: {
    filterBySport(value, search, item) {
      return item.typeEvent === search;
    },

    openBetDialog(event, outcome) {
      console.log("Selected Event:", event);  // Убедитесь, что событие передается правильно
      this.selectedEvent = event;
      this.selectedOutcome = outcome;
      this.betDialog = true;
    },
    closeBetDialog() {
      this.betDialog = false;
      this.selectedOutcome = '';
      this.betAmount = 0;
    },
    async placeBet() {
      try {
        console.log(`Ставка на ${this.selectedOutcome} в событии ${this.selectedEvent.title} на сумму ${this.betAmount}`);
        this.closeBetDialog();
      } catch (error) {
        console.error('Ошибка при попытке сделать ставку', error);
      }
    },
    async fetchEvents() {
      try {
        const { data } = await this.$api.sportsEvents();
        console.log("events", this.events);  // Убедитесь, что массив `events` содержит объекты
        this.events = data;
        console.log("Fetched Events Data:", data);  // Лог для проверки данных
      } catch (error) {
        console.error("Ошибка загрузки данных о спортивных событиях", error);
      }
    }
  },
  async mounted() {
    await this.fetchEvents();
  }
};
</script>

<style scoped>
.v-data-table th {
  background-color: #1E1E1E;
  color: #ECEFF1;
}

.v-data-table td {
  background-color: #2A2A2A;
  color: #ECEFF1;
  padding: 10px;
}

.v-btn {
  margin: 5px;
}
</style>
