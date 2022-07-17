var express = require('express');
var router = express.Router();
const JSONdb = require('simple-json-db');

router.get('/:hwid', function(req, res, next){
    let hwid = req.params.hwid;
    if (!hwid) {
        var response = {
            "status": "false",
            "admin": "false"
        }
        return res.status(200).send(JSON.stringify(response));
    }

    const db = new JSONdb('accounts.json');
    if (db.has(hwid)) {

        var admin = db.get(hwid) == "381914174407835660" || db.get(hwid) == "853392200078983182";

        var response = {
            "status": "true",
            "admin": admin
        }
        return res.status(200).send(JSON.stringify(response));
    } else {
        var response = {
            "status": "false",
            "admin": "false"
        }
        return res.status(200).send(JSON.stringify(response));
    }

})

module.exports = router;