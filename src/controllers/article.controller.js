import article from '../helpers/getArticle';
import crawl from '../helpers/crawl.mjs';

function getArticle(req, res, next) {
  const articleList = article.getArticleList();

  res.json({
    status: 'success',
    result: articleList,
  });
}

async function findArticle(req, res, next) {
  const keywords = req.query.keywords.replaceAll(' ', '%20').trim();
  const result = await crawl.getArticle(`https://tuoitre.vn/tim-kiem.htm?keywords=${keywords}`);
  return res.json({
    status: 'success',
    result,
  });
}

export default { getArticle, findArticle };
