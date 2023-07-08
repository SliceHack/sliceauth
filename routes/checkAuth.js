var express = require('express');
var router = express.Router();
const JSONdb = require('simple-json-db');

router.get('/:id', function(req, res, next){
    let id = req.params.id;
    
    if (!id) {
        var response = {
            "status": "false",
            "admin": "false"
        }
        return res.status(200).send(JSON.stringify(response));
    }

    const db = new JSONdb('accounts.json');
    if (db.has(id)) {

        var admin = id == "853392200078983182"
        || id == "381914174407835660";

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