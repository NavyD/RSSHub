const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const id = ctx.params.id;

    const link = `https://tophub.today/n/${id}`;
    const response = await got.get(link);
    const $ = cheerio.load(response.data);

    const title = $('div.Xc-ec-L.b-L').text().trim();

    const out = $('div.Zd-p-Sc > div:nth-child(1) tr')
        .map(function () {
            const title = $(this).find('td.al a').text();

            let link;
            if (id === "K7GdaMgdQy") { // 抖音
                link = 'https://www.douyin.com/search/' + encodeURIComponent(title);
            } else {
                link = $(this).find('td.al a').attr('href');
            }

            return {
                title,
                link,
            };
        })
        .get();

    ctx.state.data = {
        title,
        link,
        item: out,
    };
};
