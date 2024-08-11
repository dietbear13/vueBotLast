// const

import axios from "axios";

export default (axios) => {
  return {
    giveweaways: () => {
      return axios.get("http://localhost:3001/api/giveaways");
    },
    giveweaway:(id)=>{
      return  axios.get(`http://localhost:3001/api/giveaways/${id}`);
    }


  }

}
