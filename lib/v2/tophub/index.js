const got = require('@/utils/got');
const cheerio = require('cheerio');
const config = require('@/config').value;

module.exports = async (ctx) => {
    const id = ctx.params.id;

    const link = `https://tophub.today/n/${id}`;
    const response = await got.get(link, {
        headers: {
            Referer: 'https://tophub.today',
            Cookie: config.tophub.cookie,
        },
    });
    const $ = cheerio.load(response.data);

    const title = $('div.Xc-ec-L.b-L').text().trim();

    const out = $('div.Zd-p-Sc > div:nth-child(1) tr')
        .toArray()
        .map((e) => {
            const info = {
                title: $(e).find('td.al a').text(),
                link: $(e).find('td.al a').attr('href'),
            };
            if (id === 'K7GdaMgdQy') {
                // 抖音
                info.link = 'https://www.douyin.com/search/' + encodeURIComponent(info.title);
            } else if (id === 'Om4ejxvxEN') {
                // 贴吧
                info.link = 'https://tieba.baidu.com/hottopic/browse/hottopic?topic_name=' + encodeURIComponent(info.title);
            }
            return info;
        });

    ctx.state.data = {
        title,
        link,
        item: out,
    };
};
