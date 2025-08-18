const { fetchHTML, extractRSSContent } = require("../lib/site.html.mjs")
const Sites = require("../models/sites");
const axios = require("axios");
const Feeds = require("../models/feeds");


const generateFeeds = async () => {
   const sites = await Sites.find({ status: 1 });
   for (const site of sites) {
      const html = await fetchHTML(site.url);
      const rssContent = extractRSSContent(html, site.base_url);

      const resp = await axios.post(process.env.N8N_HOST + '/webhook/rss-from-html', {
         rawData: rssContent
      });

      let respData = resp?.data;

      for (const feed of respData?.feeds) {
         await Feeds.findOneAndUpdate({ link: feed.link }, { ...feed, base_url: site?.base_url}, { upsert: true });
      }
   }
}

module.exports = {
   generateFeeds
};