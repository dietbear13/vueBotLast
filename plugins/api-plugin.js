import api from '~/plugins/custom/api'

export default (ctx, inject) => {
  // Inject `api` key
  // -> app.$api
  // -> this.$api in vue components
  // -> this.$api in store actions/mutations
  // ctx.app.$axios.defaults.timeout = 30000
  console.log("ctx",ctx)
  inject('api', api(ctx.$axios))
}
