// src/api.js
export default (axios) => {
  return {
    giveaways: () => {
      return axios.get("http://localhost:3001/api/giveaways");
    },
    giveaway: (id) => {
      return axios.get(`http://localhost:3001/api/giveaways/${id}`);
    },
    sportsEvents: () => {
      return axios.get("http://localhost:3001/api/sports-events");
    },
    getUserBalance: (userId) => {
      return axios.get(`http://localhost:3001/api/balance/${userId}`);
    },
    getAllUsers: () => {
      return axios.get("http://localhost:3001/api/users");
    },
    getBetsSummary: () => {
      return axios.get("http://localhost:3001/api/events/bets-summary");
    },
    getUserProfile: (telegramId) => {
      return axios.get("http://localhost:3001/api/user/profile", {
        params: { telegramId }
      });
    },
    checkReward: (telegramId, giveawayId) => {
      return axios.get("http://localhost:3001/api/check-reward", {
        params: { telegramId, giveawayId }
      });
    },
    giveReward: (telegramId, giveawayId, prize) => {
      return axios.post("http://localhost:3001/api/give-reward", {
        telegramId, giveawayId, prize
      });
    }
  }
}
