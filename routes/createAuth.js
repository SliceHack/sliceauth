var express = require('express');
var router = express.Router();
const JSONdb = require('simple-json-db');

router.post('/', function(req, res, next) {

    if (!req.body.discordid | !req.body.invitekey) {
        var response = {
            "status": "Missing required fields",
        }
        return res.status(200).send(JSON.stringify(response));
    }
    
    const db = new JSONdb('invitekeys.json');
    
    if (db.has(req.body.invitekey)) {
        db.delete(req.body.invitekey);
        const db2 = new JSONdb('accounts.json');
        db2.set(req.body.discordid, req.body.discordid);

        return res.status(200).send(JSON.stringify({
            "status": "success",
        }));
    }

    return res.status(200).send(JSON.stringify({
        "status": "Invalid invite key",
    }));
})

module.exports = router;