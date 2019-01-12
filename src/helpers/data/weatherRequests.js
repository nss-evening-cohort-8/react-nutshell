import axios from 'axios';
import apiKeys from '../apiKeys';


const firebaseUrl = apiKeys.firebaseConfig.databaseURL;

const getWeather = uid => new Promise((resolve, reject) => {
  axios.get(`${firebaseUrl}/weather.json?orderBy="uid"&equalTo="${uid}"`)
    .then((result) => {
      const weatherObject = result.data;
      const weatherArray = [];
      if (weatherObject != null) {
        Object.keys(weatherObject).forEach((weatherId) => {
          weatherObject[weatherId].id = weatherId;
          weatherArray.push(weatherObject[weatherId]);
        });
      }
      resolve(weatherArray);
    })
    .catch((error) => {
      reject(error);
    });
});

const deleteWeather = weatherId => axios.delete(`${firebaseUrl}/weather/${weatherId}.json`);

const getIsCurrent = uid => new Promise((resolve, reject) => {
  axios.get(`${firebaseUrl}/weather.json?orderBy="uid"&equalTo="${uid}"`)
    .then((result) => {
      const weatherObject = result.data;
      const weatherArray = [];
      if (weatherObject != null) {
        Object.keys(weatherObject).forEach((weatherId) => {
          weatherObject[weatherId].id = weatherId;
          weatherArray.push(weatherObject[weatherId]);
        });
      }
      const isCurrent = weatherArray.find(x => x.isCurrent);
      resolve(isCurrent);
    })
    .catch((error) => {
      reject(error);
    });
});

const patchIsCurrent = (weatherId, isCurrent) => axios.patch(`${firebaseUrl}/weather/${weatherId}.json`, { isCurrent });

const postRequest = weather => axios.post(`${firebaseUrl}/weather.json`, weather);

export default {
  deleteWeather,
  getIsCurrent,
  getWeather,
  patchIsCurrent,
  postRequest,
};
