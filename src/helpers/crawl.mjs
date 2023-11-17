import cheerio from 'cheerio';
import fetch from 'node-fetch';
import fs from 'fs';

async function getArticle(urlArticle) {
  async function fetchTitle() {
    var array = [];
    const res = await fetch(urlArticle);
    if (res.status == 200) {
      const html = await res.text();
      const $ = cheerio.load(html);
      // @ts-ignore
      $('.box-category-item').each((index, el) => {
        const imgSrc = $(el).find('img').attr('src');
        const url = `https://tuoitre.vn${$(el).find('a').attr('href')}`;

        
        const title = $(el).find('h3 > a').text();
        const preViewText = $(el).find('p').text();
        const articleObj = {
          imgSrc,
          url,
          title,
          preViewText,
        };
        array.push(articleObj);
      });
    }
    return array;
  }
  

  var arr = await fetchTitle();
  return arr;
}


if(process.argv[2] == '--article') {
  // var arr = await getArticle(`https://tuoitre.vn/chat-luong-khong-khi.html`);
  
  // fs.writeFileSync('data.txt', JSON.stringify(arr), (err) => {
  //   console.log(err)
  // });

} else if(process.argv[2] == '--aqi') {
  // getAqi()
}



export default {getArticle}