// const

export default (axios) => {
  return {
    giveaways: () => {
      return axios.get("http://localhost:3001/api/giveaways");
    },
    giveaway:(id)=>{
      return axios.get(`http://localhost:3001/api/giveaways/${id}`);
    },
    sportsEvents: () => {
      return axios.get("http://localhost:3001/api/sports-events");
    },
    getUserBalance: (userId) => {
      return axios.get(`http://localhost:3001/api/balance/${userId}`);
    },
    checkSubscription: (telegramId, channelId) => {
      return axios.post("http://localhost:3001/api/check-subscription", {
        telegramId,
        channelId
      });
    },
    subscribe: (telegramId, channelId, giveawayId) => {
      return axios.post("http://localhost:3001/api/subscribe", {
        telegramId,
        channelId,
        giveawayId
      });
    }
  }
}
