import React from 'react';
import PropTypes from 'prop-types';
import './ArticleForm.scss';
import authRequests from '../../helpers/data/authRequests';
import articleRequests from '../../helpers/data/articleRequests';

const defaultArticle = {
  uid: '',
  url: '',
  title: '',
  synopsis: '',
};

class ArticleForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    isEditing: PropTypes.bool,
    editId: PropTypes.string,
  }

  state = {
    newArticle: defaultArticle,
  }

  formFieldStringState = (name, e) => {
    e.preventDefault();
    const tempArticle = { ...this.state.newArticle };
    tempArticle[name] = e.target.value;
    this.setState({ newArticle: tempArticle });
  }

  synopsisChange = e => this.formFieldStringState('synopsis', e);

  titleChange = e => this.formFieldStringState('title', e);

  urlChange = e => this.formFieldStringState('url', e);


  formSubmit = (e) => {
    e.preventDefault();
    const { onSubmit } = this.props;
    const myArticle = { ...this.state.newArticle };
    myArticle.uid = authRequests.getCurrentUid();
    onSubmit(myArticle);
    this.setState({ newArticle: defaultArticle });
  }

  componentDidUpdate(prevProps) {
    const { isEditing, editId } = this.props;
    if (prevProps !== this.props && isEditing) {
      articleRequests.getSingleArticle(editId)
        .then((article) => {
          this.setState({ newArticle: article.data });
        })
        .catch(err => console.error('error with getSingleArticle', err));
    }
  }

  render() {
    const { newArticle } = this.state;
    const { isEditing } = this.props;
    const title = () => {
      if (isEditing) {
        return <h2>Edit Article:</h2>;
      }
      return <h2>Add New Article:</h2>;
    };
    return (
      <div className="article-form col">
        {title()}
        <form onSubmit={this.formSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              className="form-control"
              id="title"
              aria-describedby="titleHelp"
              placeholder="Man Eats Whole Raw Onion"
              value={newArticle.title}
              onChange={this.titleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="synopsis">Synopsis:</label>
            <input
              type="text"
              className="form-control"
              id="synopsis"
              aria-describedby="synopsisHelp"
              placeholder="Super interesting article"
              value={newArticle.synopsis}
              onChange={this.synopsisChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="url">Url:</label>
            <input
              type="text"
              className="form-control"
              id="url"
              aria-describedby="urlHelp"
              placeholder="https://www.google.com"
              value={newArticle.url}
              onChange={this.urlChange}
            />
          </div>
          <button className="btn btn-danger">Save Article</button>
        </form>
      </div>
    );
  }
}

export default ArticleForm;
