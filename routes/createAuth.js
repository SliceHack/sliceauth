var express = require('express');
var router = express.Router();
const JSONdb = require('simple-json-db');
const db = new JSONdb('invitekeys.json');
const db2 = new JSONdb('accounts.json');

router.post('/', function(req, res, next){
    if (!req.body.hwid | !req.body.discordid | !req.body.invitekey) {
        var response = {
            "status": "Missing required fields",
        }
        return res.status(200).send(JSON.stringify(response));
    }

    if (db.has(req.body.invitekey)) {
        db.delete(req.body.invitekey);
        db2.set(req.body.discordid, req.body.hwid);
        var response = {
            "status": "success",
        }
        return res.status(200).send(JSON.stringify(response));
    } else {
        var response = {
            "status": "Invalid invite key",
        }
        return res.status(200).send(JSON.stringify(response));
    }
})

module.exports = router;