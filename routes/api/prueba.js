var uuidv4 = require('uuid/v4');
var express = require('express');
var router = express.Router();

var fileModel = require('./jsonmodel');
var data = null;

var anuncioTp = {
    'id': '',
    'url': '',
    'nombre':'',
    'year':'',
    'rating':'',
    'fechaIng':''
};

router.get('/', function(req, res, next){
    if(!data){
        fileModel.read(function(err, filedata){
            if(err){
                console.log(err);
                data = [];
                return res.status(500).json({'error':'error al sustraer data'});
            }
            data = JSON.parse(filedata);
            return res.status(200).json(data);
        });
    } else {
        return res.status(200).json(data);
    }

}); 

router.post('/new',function(req, res, next){
    var _thingsData = Object.assign({} , anuncioTp, req.body);
    var dataT = new Date();
    var dataD = new Date();
    dateD.setData(dateT.getDate()+3);
    _thingsData.fechaIng = dateT;
    _thingsData.due = dateD;
    _thingsData.id= uuidv4();
    if(!data){
        data = [];
    }
    data.push(_thingsData);
    fileModel.write(data, function(err){
        if (err){
            console.log(err);
            return res.status(500).json({'error': 'error al obtener data '});

        }

        return res.status(200).json(_thingsData);
    });

});

router.put('/done/:thingId', function(req, res, next){
    var _thingId = req.params.thingId;
    var _thingUdps = req.body;
    var _thingUddated = null;
    var newData = data.map(
        function(doc, i){
            if (doc.id == _thingId){
                _thingUddated = Object,assign(
                    {},
                    doc,
                    {"done":true},
                    _thingUdps
                );
                return _thingUddated;
            }
            return doc;
        }
    );
    data = newData;
    fileModel.write(data, function(err){
        if (err){
            console.log(err);
            return res.status(500).json({ 'error':'error al guardar data '});

        }
        return res.status(200).json(_thingUddated);
    });
});

module.exports = router