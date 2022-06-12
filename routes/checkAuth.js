var express = require('express');
var router = express.Router();
const JSONdb = require('simple-json-db');

router.get('/:hwid', function(req, res, next){
    let hwid = req.params.hwid;
    if (!hwid) {
        var response = {
            "status": "false",
        }
        return res.status(200).send(JSON.stringify(response));
    }

    const db = new JSONdb('accounts.json');
    if (db.has(hwid)) {
        var response = {
            "status": "true",
        }
        return res.status(200).send(JSON.stringify(response));
    } else {
        var response = {
            "status": "false",
        }
        return res.status(200).send(JSON.stringify(response));
    }

})

module.exports = router;