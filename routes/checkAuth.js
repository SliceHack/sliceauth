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

        var admin = db.get(hwid) == "ZGpsZXYxMC4wYW1kNjQxMC4wV2luZG93cyAxMEM6XFVzZXJzXGRqbGV2QU1ENjQgRmFtaWx5IDIzIE1vZGVsIDggU3RlcHBpbmcgMiwgQXV0aGVudGljQU1EQU1ENjRBTUQ2NDIzMjM=" || db.get(hwid) == "853392200078983182";

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