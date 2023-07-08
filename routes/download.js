var express = require('express');
var router = express.Router();
const JSONdb = require('simple-json-db');

router.post('/download/:file', function(req, res){
    var file = req.params.file;
    var id = req.body.id;
    if (!file) return;

    const db = new JSONdb('accounts.json');
    
    if(!db.has(id)) {
        return res.status(200).send("You are not authorized to download this file.");
    }

    switch (file) {
        case 'lib':
            return res.sendFile('files/lib.zip', { root: process.cwd() });
        case 'jar':
            return res.sendFile(`files/Slice.jar`, { root: process.cwd() });
    }
    return res.sendStatus(404);

})

module.exports = router;