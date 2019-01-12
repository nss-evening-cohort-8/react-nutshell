import axios from 'axios';
import apiKeys from '../apiKeys';

const firebaseUrl = apiKeys.firebaseConfig.databaseURL;

const getAllArticles = () => new Promise((resolve, reject) => {
  axios.get(`${firebaseUrl}/articles.json`)
    .then((result) => {
      const articleObject = result.data;
      const articleArray = [];
      if (articleObject != null) {
        Object.keys(articleObject).forEach((articleId) => {
          articleObject[articleId].id = articleId;
          articleArray.push(articleObject[articleId]);
        });
      }
      resolve(articleArray);
    })
    .catch((error) => {
      reject(error);
    });
});
const deleteArticle = articleId => axios.delete(`${firebaseUrl}/articles/${articleId}.json`);

const postRequest = newArticle => axios.post(`${firebaseUrl}/articles.json`, newArticle);

const getSingleArticle = articleId => axios.get(`${firebaseUrl}/articles/${articleId}.json`);

const updateArticle = (articleId, article) => axios.put(`${firebaseUrl}/articles/${articleId}.json`, article);

export default {
  getAllArticles,
  deleteArticle,
  postRequest,
  getSingleArticle,
  updateArticle,
};
