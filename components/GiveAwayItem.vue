<template>
	<v-card @click="viewGiveaway(giveaway._id)" class="my-2">
	          <v-card-title>
	            <v-img :width="230" class="mr-3" :src="giveaway.image">
	            </v-img>
	            <div>
	              <div>{{ giveaway.title }}</div>
	              <div>{{ giveaway.description }}</div>
	            </div>
	          </v-card-title>
	        </v-card>
</template>

<script>
export default {
	name:"GiveAwayItem",
	props:['giveaway'],
	mounted(){
			console.log(this.giveaway)
	},
	methods:{
    async fetch() {
      try {
        const { data } = await this.$axios.get(`/api/giveaways/${this.$route.params.id}`);
        this.giveaway = data;
      } catch (error) {
        console.error("Ошибка при загрузке данных розыгрыша:", error);
      }
    },

    viewGiveaway(id) {
            this.$router.push({ name: "giveaway-id", params: { id } });
        }
	}
}
</script>

