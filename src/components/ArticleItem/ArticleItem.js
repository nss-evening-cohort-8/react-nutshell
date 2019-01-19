import React from 'react';
import PropTypes from 'prop-types';

import articleShape from '../../helpers/propz/articleShape';
import authRequests from '../../helpers/data/authRequests';

import './ArticleItem.scss';

class ArticleItem extends React.Component {
  static propTypes = {
    article: articleShape.articleShape,
    deleteSingleArticle: PropTypes.func,
    passArticleToEdit: PropTypes.func,
  }

  deleteArticle = (e) => {
    e.preventDefault();
    const { deleteSingleArticle, article } = this.props;
    deleteSingleArticle(article.id);
  }

  editArticle = (e) => {
    e.preventDefault();
    const { passArticleToEdit, article } = this.props;
    passArticleToEdit(article.id);
  }

  render() {
    const { article } = this.props;
    const uid = authRequests.getCurrentUid();

    const makeButtons = () => {
      if (article.uid === uid) {
        return (
          <div className="col-2">
            <button className="btn btn-default" onClick={this.editArticle}>
              <i className="fas fa-pencil-alt"></i>
            </button>
            <button className="btn btn-default" onClick={this.deleteArticle}>
              <i className="fas fa-trash-alt"></i>
            </button>
          </div>
        );
      }
      return <div className="col-2"></div>;
    };
    return (
      <li className="article-item text-center">
        <div className="col-7">
          <h4>{article.title}</h4>
          <p>{article.synopsis}</p>
        </div>
        <div className="col-3">
          <p>Link <a target="_blank" rel="noopener noreferrer" href={article.url}>HERE</a></p>
        </div>
        { makeButtons() }
      </li>
    );
  }
}

export default ArticleItem;
