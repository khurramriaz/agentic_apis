const express = require('express');
const Router = express.Router();
const pkg = require('../../package.json');
const { fetchHTML, extractRSSContent } = require('../lib/site.html.mjs');
const axios = require('axios')
const mongoose = require('mongoose');

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


Router.get('/get_all_entries/:collection', async (req, res) => {
   try {
    const { collection } = req.params;
    let { page, page_size, sort, filter } = req.query;

    // --- Pagination ---
    page = Number(page) || 1;
    if (page < 1) page = 1;

    page_size = Number(page_size) || 10;
    if (page_size < 1) page_size = 10;
    if (page_size > 99) page_size = 99;

    // --- Sort ---
    sort = Number(sort);
    if (![1, -1].includes(sort)) {
      sort = -1; // default
    }

    // --- Filter ---
    try {
      filter = filter ? JSON.parse(filter) : {};
      if (typeof filter !== "object" || Array.isArray(filter)) {
        filter = {};
      }
    } catch (err) {
      return res.status(400).json({ error: "Invalid filter JSON" });
    }

    // --- Get dynamic collection (without predefined Schema) ---
    const col = mongoose.connection.db.collection(collection);

    // Fetch data
    const data = await col
      .find(filter)
      .sort({ _id: sort })
      .skip((page - 1) * page_size)
      .limit(page_size)
      .toArray();

    const total = await col.countDocuments(filter);

    res.json({
      page,
      page_size,
      total,
      status: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
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