import { Route } from '@/types';
import got from '@/utils/got';
import { load } from 'cheerio';
import { config } from '@/config';

export const route: Route = {
    path: '/:id',
    categories: ['new-media'],
    example: '/tophub/Om4ejxvxEN',
    parameters: { id: '榜单id，可在 URL 中找到' },
    features: {
        requireConfig: [
            {
                name: 'TOPHUB_COOKIE',
                optional: true,
                description: '',
            },
        ],
        requirePuppeteer: false,
        antiCrawler: false,
        supportBT: false,
        supportPodcast: false,
        supportScihub: false,
    },
    radar: [
        {
            source: ['tophub.today/n/:id'],
        },
    ],
    name: '榜单',
    maintainers: ['LogicJake'],
    handler,
};

async function handler(ctx) {
    const id = ctx.req.param('id');

    const link = `https://tophub.today/n/${id}`;
    const response = await got.get(link, {
        headers: {
            Referer: 'https://tophub.today',
            Cookie: config.tophub.cookie,
        },
    });
    const $ = load(response.data);

    const title = $('div.Xc-ec-L.b-L').text().trim();

    const out = $('div.Zd-p-Sc > div:nth-child(1) tr')
        .toArray()
        .map((e) => {
            const info = {
                title: $(e).find('td.al a').text(),
                link: $(e).find('td.al a').attr('href'),
            };
            if (id === "K7GdaMgdQy") { // 抖音
                info.link = 'https://www.douyin.com/search/' + encodeURIComponent(title);
            } else if (id === "Om4ejxvxEN") { // 贴吧
                info.link = 'https://tieba.baidu.com/hottopic/browse/hottopic?topic_name=' + encodeURIComponent(title);
            }
            return info;
        });

    return {
        title,
        link,
        item: out,
    };
}
