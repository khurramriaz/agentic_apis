const express       = require('express');
const Router        = express.Router();
const pkg           = require('../../package.json');

// routes
const moment = require('moment/moment');
const { version } = require('mongoose');


/*********************************************************************************
 *                                  index route                                  *
 *********************************************************************************/
Router.get('/', (req, res) => {
  res.status(200).json(
    {
      version: pkg.version,
      status: "ok",
      now: `${moment().format('MMM DD, YYYY - HH:mm')}`
    });
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
  res.status(404).json({err: 'Invalid endpoint'});
});

module.exports = Router;