var express = require('express');
var router = express.Router();
const JSONdb = require('simple-json-db');

router.get('/:file', function(req, res, next){
    var file = req.params.file;
    if (!file) return;
    switch (file) {
        case 'lib':
            return res.sendFile('files/lib.zip');
        case 'jar':
            return res.sendFile(`files/jar.zip`);
    }
    return res.sendStatus(404);

})

module.exports = router;