import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/',
});

const hardcodedCallerId = 'e4a71e7f-37bc-4776-a8f8-1779d4a16dd8';

export { axiosInstance, hardcodedCallerId };
