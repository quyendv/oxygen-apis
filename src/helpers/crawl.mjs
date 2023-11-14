import cheerio from 'cheerio';
import fetch from 'node-fetch';
import fs from 'fs';

async function get() {
  async function fetchTitle() {
    var array = [];
    const res = await fetch(`https://tuoitre.vn/chat-luong-khong-khi.html`);
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
  async function fetchContent(arr, index) {
    if (index == arr.length) {
      fs.writeFile('data.txt', JSON.stringify(arr), (err) => {
        console.log(err);
      });
      return;
    }
    const res = await fetch(arr[index].url);
    const arrayContent = [];
    if (res.status == 200) {
      const html = await res.text();
      const $ = cheerio.load(html);
      const content = $('.detail-content');
      content.children().each((index, el) => {
        if ($(el).get(0).tagName == 'figure') {
          const imgSrc = $(el).find('img').attr('src');
          const caption = $(el).find('p').text();
          arrayContent.push({
            figure: {
              imgSrc,
              caption,
            },
          });
        }
        if ($(el).get(0).tagName == 'h3') {
          const title = $(el).text();
          arrayContent.push({
            heading: {
              heading: title,
            },
          });
        }

        if ($(el).get(0).tagName == 'p') {
          const paragraphContent = $(el).text();
          arrayContent.push({
            paragraph: paragraphContent,
          });
        }
      });
      arr[index] = {
        ...arr[index],
        arrayContent,
      };
    }
    fetchContent(arr, ++index);
  }

  var arr = await fetchTitle();

  await fetchContent(arr, 0);
}

get();
