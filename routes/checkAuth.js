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

        var admin = hwid == "ZGpsZXYxMC4wYW1kNjQxMC4wV2luZG93cyAxMEM6XFVzZXJzXGRqbGV2QU1ENjQgRmFtaWx5IDIzIE1vZGVsIDggU3RlcHBpbmcgMiwgQXV0aGVudGljQU1EQU1ENjRBTUQ2NDIzMjM="
        || hwid == "TmljazEwLjBhbWQ2NDEwLjBXaW5kb3dzIDExQzpcVXNlcnNcTmlja0ludGVsNjQgRmFtaWx5IDYgTW9kZWwgMTQxIFN0ZXBwaW5nIDEsIEdlbnVpbmVJbnRlbEFNRDY0QU1ENjQ2Ng=="
        || hwid == "V29sZjEwLjBhbWQ2NDEwLjBXaW5kb3dzIDExQzpcVXNlcnNcV29sZkludGVsNjQgRmFtaWx5IDYgTW9kZWwgNDIgU3RlcHBpbmcgNywgR2VudWluZUludGVsQU1ENjRBTUQ2NDY2"


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