var express = require('express');
var router = express.Router();
const JSONdb = require('simple-json-db');

router.get('/download/:file', function(req, res, next){
    var file = req.params.file;
    if (!file) return;
    
    switch (file) {
        case 'lib':
            return res.sendFile('files/lib.zip', { root: process.cwd() });
        case 'jar':
            return res.sendFile(`files/Slice.jar`, { root: process.cwd() });
    }
    return res.sendStatus(404);

})

module.exports = router;