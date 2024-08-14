export default async (ctx, inject) => {
  try {
    if (window.Telegram && window.Telegram.WebApp) {
      inject('tg', window.Telegram.WebApp);
    } else {
      console.error("Telegram WebApp не доступен.");
    }
  } catch (error) {
    console.error("Произошла ошибка при инициализации Telegram WebApp:", error);
  }
};
