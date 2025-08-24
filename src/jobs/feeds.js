const { fetchHTML, extractBlogContent } = require("../lib/site.html.mjs")
const Sites = require("../models/sites");
const axios = require("axios");
const Feeds = require("../models/feeds");
const News = require("../models/news");
const { slugGenerator } = require("../lib/utility");


const generateFeeds = async () => {
   const sites = await Sites.find({ status: 1 });
   for (const site of sites) {
      const html = await fetchHTML(site.url);
      const rssContent = extractBlogContent(html, site.base_url);

      let resp = null;
      try {
         resp = await axios.post(process.env.N8N_HOST + '/webhook/rss-from-html', {
            rawData: rssContent
         });
      } catch (e) {
         console.log("Error in n8n request:", e.message);
         continue;
      }


      let respData = resp?.data;

      for (const feed of respData?.feeds) {
         await Feeds.findOneAndUpdate({ link: feed.link }, { ...feed, base_url: site?.base_url, category: site?.category }, { upsert: true });
      }
   }
}

const fetchAndGenerateNews = async () => {
   let feedsForNews = await Feeds.find({ news_generated: 0, status: 1 });

   for (const feed of feedsForNews) {
      const html = await fetchHTML(feed.link);
      const blogContent = extractBlogContent(html, feed.base_url);

      let resp = null;

      try {
         resp = await axios.post(process.env.N8N_HOST + '/webhook/news-from-html', {
            rawData: blogContent
         });
      } catch (e) {
         console.log("Error in n8n request:", e.message);
         continue;
      }

      let respData = resp?.data;

      await News.findOneAndUpdate(
         { link: feed.link },
         {
            base_url: feed?.base_url,
            category: feed?.category,
            slug: slugGenerator(respData?.data?.original_title),
            original_title: respData?.data?.original_title,
            original_post: respData?.data?.original_post,
            generated_title: respData?.data?.generated_title,
            generated_post: respData?.data?.generated_post,
            translated_title: respData?.data?.translated_title,
            translated_post: respData?.data?.translated_post,
            link: feed.link,
         },
         { upsert: true }
      );

      await Feeds.findByIdAndUpdate(feed._id, { news_generated: 1 });
   }
}

module.exports = {
   generateFeeds,
   fetchAndGenerateNews
};