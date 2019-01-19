import React from 'react';
import './Articles.scss';

import articleRequests from '../../../helpers/data/articleRequests';
import smashRequests from '../../../helpers/data/smashRequests';
import authRequests from '../../../helpers/data/authRequests';

import ArticleItem from '../../ArticleItem/ArticleItem';
import ArticleForm from '../../ArticleForm/ArticleForm';

class Articles extends React.Component {
  state = {
    articles: [],
    isEditing: false,
    editId: '-1',
  }

  getArticles = () => {
    const uid = authRequests.getCurrentUid();
    smashRequests.getArticlesFromMeAndFriends(uid)
      .then((articles) => {
        this.setState({ articles });
      })
      .catch(err => console.error('error with Articles GET', err));
  }

  componentDidMount() {
    this.getArticles();
  }

  deleteSingleArticle = (articleId) => {
    articleRequests.deleteArticle(articleId)
      .then(() => {
        this.getArticles();
      })
      .catch(err => console.error('error with delete single', err));
  }

  formSubmitArticle = (newArticle) => {
    const { isEditing, editId } = this.state;
    if (isEditing) {
      articleRequests.updateArticle(editId, newArticle)
        .then(() => {
          this.setState({ isEditing: false, editId: '-1' });
          this.getArticles();
        })
        .catch(err => console.error('error with articles post', err));
    } else {
      articleRequests.postRequest(newArticle)
        .then(() => {
          this.getArticles();
        })
        .catch(err => console.error('error with articles post', err));
    }
  }

  render() {
    const { articles, isEditing, editId } = this.state;
    const passArticleToEdit = articleId => this.setState({ isEditing: true, editId: articleId });
    const articlesItemComponents = articles.map(article => (
      <ArticleItem
        article={article}
        key={article.id}
        deleteSingleArticle={this.deleteSingleArticle}
        passArticleToEdit={passArticleToEdit}
      />
    ));

    return (
      <div className="Articles text-center col">
        <h1>Articles</h1>
        <div className="row">
          <div className="col">
            <h3>Upcoming Articles</h3>
            <ul>{ articlesItemComponents }</ul>
          </div>
          <div className="col">
            <ArticleForm
              onSubmit={this.formSubmitArticle}
              isEditing={isEditing}
              editId={editId}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Articles;
