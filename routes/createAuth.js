var express = require('express');
var router = express.Router();
const JSONdb = require('simple-json-db');

router.post('/', function(req, res, next){
    if (!req.body.hwid | !req.body.discordid | !req.body.invitekey) {
        var response = {
            "status": "Missing required fields",
        }
        return res.status(200).send(JSON.stringify(response));
    }
    const db = new JSONdb('invitekeys.json');
    if (db.has(req.body.invitekey)) {
        db.delete(req.body.invitekey);
        const db2 = new JSONdb('accounts.json');
        db2.set(req.body.hwid, req.body.discordid);
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