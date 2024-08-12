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

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'C:\\Users\\dietb\\VSprojects\\testy\\test\\assets\\neon-theme.scss' // Добавьте ваш новый файл стилей здесь

  ],

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
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: '#1E88E5',
          accent: '#FFA726',
          secondary: '#B0BEC5',
          info: '#00e5ff',
          warning: '#ff6ec7',
          error: '#ff4081',
          success: '#69f0ae'
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [({ isLegacy }) => isLegacy && 'axios']
  }
}
