// const

export default (axios) => {
  return {
    giveaways: () => {
      return axios.get("http://localhost:3001/api/giveaways");
    },
    giveaway:(id)=>{
      return axios.get(`http://localhost:3001/api/giveaways/${id}`);
    }


  }

}
