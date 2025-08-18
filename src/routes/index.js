const express = require('express');
const Router = express.Router();
const pkg = require('../../package.json');
const { fetchHTML, extractRSSContent } = require('../lib/site.html.mjs');
const axios = require('axios')

// routes


/*********************************************************************************
 *                                  index route                                  *
 *********************************************************************************/
Router.get('/', (req, res) => {

  res.status(200).json(
    {
      version: pkg.version,
      status: "ok"
    });
})

Router.get('/scrape-feeds', async (req, res) => {
  const { url } = req.query;

  if(!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  let html = await fetchHTML(url);
  let rawData = extractRSSContent(html);
  let resp = await axios.post(process.env.N8N_HOST + '/webhook/rss-from-html', { rawData });
  res.status(200).json(resp.data);
})


/*********************************************************************************
 *                                  APIs                                         *
 *********************************************************************************/
// Router.use('/auth', authRoutes)
// .use(employee_auth.authorizedEmployee)
// .use('/admin', entityRoutes)


/*********************************************************************************
 *                                  404                                          *
 *********************************************************************************/
Router.use((req, res) => {
  res.status(404).json({ err: 'Invalid endpoint' });
});

module.exports = Router;