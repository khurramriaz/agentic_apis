const { validationResult } = require("express-validator");
const UTIL_CONST = require("../constants/util");

/**
 * Send response with status 500 and text "Internal server error"
 * @param [res] HTTP request
 * @param [err] error to show in server logs
 */
function res_serverErr(res, err){
    console.log(err);
    res.status(500).json({ error: UTIL_CONST.SERVER_ERR })
}


/**
 * This is a middleware to process validation chain return by any validation rules based on express-validation
 * @param [req] http request object
 * @param [res] http response object
 * @param [next] execute next function in case of success
 */
function validateRule(req, res, next) {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(406).json({ error: result.array().map(({ msg }) => msg) });
    next();
}


/**
 * Send json response (HTTP)
 * @param {*} res HTTP response object
 * @param {*} status reponse status code default is 200
 * @param {*} data json data or string (if isErrorRes true) to send in response
 * @param {*} isErrorRes (boolean) if true "data" should be a string and response will send with "error" key
 */
function res_json(res, status = 200, data, isErrorRes) {
    if(isErrorRes){
        if(typeof data === 'string') 
            return res.status(status).json({ error: data }) 
        throw new Error('data should be a string if isErrorRes is true')
    }
    return res.status(status).json(data);
}


/**
 * Return all ENVS from process.env
 * @returns {} Spreaded ENVs
 */
function env(){
    return { ...process.env };
}

/**
 * Take any string and return it as slug (space replaced by -)
 * @param {*} text 
 * @returns {} slug
 */
function slugGenerator(text){
    return text.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');
}


module.exports = {
    slugGenerator,
    validateRule,
    res_serverErr,
    res_json,
    env,
}