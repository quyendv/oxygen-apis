import article from '../helpers/getArticle';

function getArticle(req, res, next) {
  const articleList = article.getArticleList();

  res.json({
    status: 'success',
    result: articleList,
  });
}

export default { getArticle };
