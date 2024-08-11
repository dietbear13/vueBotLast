import axios from 'axios';

export default (context, inject) => {
  inject('axios', axios);
};

