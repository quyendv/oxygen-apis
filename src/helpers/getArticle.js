import fs from 'fs';
let article = [];
function getArticleFromSrc() {
  article = JSON.parse(fs.readFileSync(`${__dirname}/data.txt`, 'utf8'));
}
function getArticleList() {
  return article;
}

export default { getArticleFromSrc, getArticleList };
