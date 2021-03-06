const Apify = require('apify');

Apify.main(async () => {
    // Get queue and enqueue first url.
    const requestQueue = await Apify.openRequestQueue();
    await requestQueue.addRequest(new Apify.Request({ url: 'https://www.visitrichmondva.com/events/' }));

    const crawler = new Apify.PuppeteerCrawler({
        requestQueue,
        handlePageFunction: async ({ page, request }) => {

            //trying to get all the links.
            const pageFunction = ($posts) => {
                const data = [];

                // We're getting the title, rank and URL of each post on Hacker News.
                $posts.forEach(($post) => {
                    data.push({
                        title: $post.querySelector('div.inner ul.info-list h4').innerText,
                        href: $post.querySelector('div.inner ul.info-list h4 a').href,
                    });
                });

                return data;
            };

            const data = await page.$$eval('div.inner ul.info-list', pageFunction);


            const title = await page.title();
            const posts = await page.$$('div.inner ul.info-list h4');

            // console.log(`Page ${request.url} succeeded and it has ${posts.length} posts. The data is ${data}`);
            console.log(JSON.stringify(data, null, 2));

            // console.log(data.title);


            // Save data.
            await Apify.pushData({
                url: request.url,
                title,
                postsCount: posts.length,
            });
        },

        // If request failed 4 times then this function is executed.
        handleFailedRequestFunction: async ({ request }) => {
            console.log(`Request ${request.url} failed 4 times`);
        },
    });

    // Run crawler.
    await crawler.run();

    //Perhaps insert crawler2 here?

    const crawler2 = newApify.PuppeteerCrawler({
        requestQueue,
        handlePageFunction: async ({ page, request }) => {
            const pageFunction = ($posts) => {
                const data = {};
            }
        }
    });

    await crawler2.run();
});
