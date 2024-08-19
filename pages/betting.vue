<template>
  <v-container>
    <PageHeader title="Ставки"/>

    <!-- Табы для выбора спорта -->
    <v-tabs :value="selectedSport" grow>
      <v-tab v-for="(icon, sport) in sports" :key="sport" @click="setSport(sport)">
        <v-icon>{{ icon }}</v-icon>
      </v-tab>
    </v-tabs>

    <v-divider class="my-4"></v-divider>

    <!-- Таблица с событиями и коэффициентами -->
    <v-tabs-items v-model="selectedSport">
      <v-tab-item v-for="(icon, sport) in sports" :key="sport" :value="sport">
        <!-- Таблица с событиями и коэффициентами -->
        <v-data-table
          :headers="headers"
          :items="filteredEvents"
          :page.sync="page"
          :items-per-page="itemsPerPage"
          :disable-sort="true"
          :calculate-widths="true"
          class="elevation-1"
          item-key="event._id"
          dense
          hide-default-footer
          :mobile-breakpoint="0"
          :show-group-by="true"
          :group-by="['title']"

        >
          <template v-slot:item.actions="{ item }">
            <!-- Здесь рендерится BettingItem с переданным event -->
            <BettingItem
              :event="item"
              :countP1="betSummaries[item._id]?.countP1 || 0"
              :countX="betSummaries[item._id]?.countX || 0"
              :countP2="betSummaries[item._id]?.countP2 || 0"
              @place-bet="openBetDialog"
            />
            <PredictionCalculator :event="item" :userBets="getUserBets(item._id)"/>

          </template>
        </v-data-table>
        <div v-if="filteredEvents.length === 0">Нет доступных событий</div>
      </v-tab-item>
    </v-tabs-items>

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
      <v-pagination
        v-model="page"
        :length="pageCount"
      ></v-pagination>
      <v-text-field
        :value="itemsPerPage"
        label="Items per page"
        type="number"
        min="-1"
        max="15"
        @input="itemsPerPage = parseInt($event, 10)"
      ></v-text-field>

    </v-dialog>

    <FooterMenu/>
  </v-container>
</template>

<script>
import FooterMenu from '../components/FooterMenu.vue';
import PageHeader from '../components/PageHeader.vue';
import BettingItem from "../components/BettingItem.vue";
import PredictionCalculator from '../components/PredictionCalculator.vue';
//

export default {
  components: {
    FooterMenu,
    PageHeader,
    BettingItem,
    PredictionCalculator,
  },
  data() {
    return {
      selectedSport: 'football',
      sports: {
        'football': 'mdi-soccer',
        'tennis': 'mdi-tennis',
        'basketball': 'mdi-basketball',
        'boxing': 'mdi-boxing-glove',
        'figure skating': 'mdi-skate',
      },
      events: [],
      betSummaries: {},
      userBets: [],
      betDialog: false,
      selectedOutcome: '',
      betAmount: 0,
      selectedEvent: null,
      headers: [
        {text: 'Событие', value: 'title', width: '20%'},
        {text: 'Коэффициенты', value: 'actions', sortable: false, width: '80%'},
      ],
      page: 1,
      itemsPerPage: 5,

    };
  },
  computed: {
    filteredEvents() {
      console.log("Selected Sport:", this.selectedSport);
      const filtered = this.events.filter(event => {
        console.log("!! event typeEvent:", event.typeEvent, "Selected Sport:", this.selectedSport);
        return event.typeEvent === this.selectedSport;
      });
      console.log("!! filtered", filtered);
      return filtered;
    },
    eventBetSummaries() {
      return this.filteredEvents.map(event => ({
        ...event,
        totalP1: this.betSummaries[event._id]?.totalP1 || 0,
        totalX: this.betSummaries[event._id]?.totalX || 0,
        totalP2: this.betSummaries[event._id]?.totalP2 || 0,
      }));
    }
  },
  methods: {

    async fetchBetSummaries() {
      try {
        const {data} = await this.$api.getBetsSummary(); // Используйте существующий $api объект
        this.betSummaries = data.reduce((acc, curr) => {
          acc[curr.eventId] = curr;
          return acc;
        }, {});
      } catch (error) {
        console.error('Ошибка загрузки сумм ставок', error);
      }
    },
    getUserBets(eventId) {
      if (!this.userBets || this.userBets.length === 0) return [];
      return this.userBets.filter(bet => bet.eventId === eventId);
    },

    filterBySport(value, search, item) {
      return item.typeEvent === search;
    },
    setSport(sport) {
      this.selectedSport = sport;
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
        const {data} = await this.$api.sportsEvents();
        console.log("++Fetched Events Data:", data);  // Убедитесь, что массив `events` содержит объекты
        this.events = data;
        console.log("++ event", this.events);  // Лог для проверки массива `events`
      } catch (error) {
        console.error("Ошибка загрузки данных о спортивных событиях", error);
      }
    },
    async fetchUserBets() {
      try {
        // Заглушка для тестирования
        this.userBets = [
          {eventId: 'event1', userId: 'user1', bet: 'p1'},
          {eventId: 'event2', userId: 'user2', bet: 'p2'},
          // Добавьте больше тестовых данных, если нужно
        ];
      } catch (error) {
        console.error('Ошибка при получении ставок пользователей', error);
      }
    }
  },
  async mounted() {
    await this.fetchEvents();
    await this.fetchUserBets();
    await this.fetchBetSummaries();
    this.selectedSport = 'football'; // Установите значение после загрузки данных

  },
  watch: {
    selectedSport(newVal, oldVal) {
      console.log('Selected Sport changed from:', oldVal, 'to:', newVal);
    }
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

.sport-icons {
  color: #00BFA6; /* Мятный цвет */
}

.v-tabs .v-tab {
  color: #00BFA6; /* Сделать текст табов мятного цвета */
}

.v-tab--active .sport-icons {
  color: #00BFA6; /* Более насыщенный мятный для активного таба */
}


</style>
