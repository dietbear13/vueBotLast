import colors from 'vuetify/es5/util/colors'

export default {
  ssr: false,
  headers: {'Access-Control-Allow-Origin':'*'},

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'tg_app',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      {charset: 'utf-8'},
      {hid: 'description', name: 'description', content: ''},
      {name: 'format-detection', content: 'telephone=no'},
      {
        hid: "no-zoom",
        name: "viewport",
        content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
      }
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ],
    script: [
      {hid: 'tg', src: 'https://telegram.org/js/telegram-web-app.js', defer: false}
    ]
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/axios.js',mode: 'all' },
    { src: '~/plugins/api-plugin.js',mode: 'all' },
    { src: '~/plugins/vue-telegram.js', mode: 'client' }

  ],
  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'betting',
        path: '/betting',
        component: resolve(__dirname, 'pages/betting.vue')
      });

      console.log(routes);
    }
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
  ],

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    // customVariables: ['~/assets/neon-theme.scss'],
    theme: {
      dark: true, // или true, если хотите темную тему
      themes: {
        dark: {
          primary: '#FF6EC7',   // Яркий неоново-зеленый
          secondary: '#FF6EC7', // Неоново-розовый
          accent: '#00FFFF',    // Неоново-голубой (циан)
          error: '#FF1744',     // Яркий красный для ошибок
          warning: '#FFEA00',   // Неоново-желтый
          info: '#00E5FF',      // Неоново-голубой для информационных сообщений
          success: '#76FF03',   // Яркий неоново-зеленый для успеха
          background: '#121212' // Темный фон
        },
        light: {
          primary: '#FF6EC7',   // Яркий неоново-зеленый
          secondary: '#FF6EC7', // Неоново-розовый
          accent: '#00FFFF',    // Неоново-голубой (циан)
          error: '#FF1744',     // Яркий красный для ошибок
          warning: '#FFEA00',   // Неоново-желтый
          info: '#00E5FF',      // Неоново-голубой для информационных сообщений
          success: '#76FF03',   // Яркий неоново-зеленый для успеха
          background: '#000000' // Черный фон для светлой темы (контраст неоновых цветов)
        }
      }
    }
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/neon-theme.scss'
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [
      ({ isLegacy }) => isLegacy && 'axios',
      '@telegram-apps/sdk'
    ]
  }
}
