import article from '../helpers/getArticle';
import crawl from '../helpers/crawl.mjs';

function getArticle(req, res, next) {
  const articleList = article.getArticleList();

  return res.status(200).json(articleList);
}

async function findArticle(req, res, next) {
  const keywords = req.query.keywords.replaceAll(' ', '%20').trim();
  if (keywords == '') {
    return res.status(400).json({
      message: 'Invalid Argument',
    });
  }
  const result = await crawl.getArticle(`https://tuoitre.vn/tim-kiem.htm?keywords=${keywords}`);
  return res.status(200).json(result);
}

export default { getArticle, findArticle };
