const Idol = require('../models/Idol');

exports.getIdols = async (req, res, next) => {
    try {
        const total = await Idol.countDocuments();
        const limit = parseInt(req.query.limit) || total;
        let start = parseInt(req.query.start) || 0;
        let page = Math.floor(start / limit) + 1;
        const pages = Math.ceil(total / limit);

        if (page > pages) {
            page = pages;
        }

        let skip = start;

        if (page === pages && total % limit !== 0) {
            skip = total - limit;
        }

        const idols = await Idol.find().skip(skip).limit(limit);


        const pagination = {
            totalPages: pages,
            currentPage: page,
            totalItems: total,
            currentItems: limit
        };



        res.status(200).json({
            idols: idols,
            pagination: pagination,
            _links: {
                first: req.protocol + '://' + req.get('host') + req.baseUrl + '?start=0&limit=' + limit,
                last: req.protocol + '://' + req.get('host') + req.baseUrl + '?start=' + (pages - 1) * limit + '&limit=' + limit,
                next: req.protocol + '://' + req.get('host') + req.baseUrl + '?start=' + (page * limit) + '&limit=' + limit,
                prev: req.protocol + '://' + req.get('host') + req.baseUrl + '?start=' + (page - 2) * limit + '&limit=' + limit,
                self: req.protocol + '://' + req.get('host') + req.originalUrl
            }
        },);

    } catch (error) {
        res.status(400).json({success: false});
    }

}


exports.getIdol = async (req, res, next) => {
    try {
        const idol = await Idol.findById(req.params.id);
        if (!idol) {
            return res.status(400).json({success: false});
        }
        res.status(200).json({
            data: idol,
            _links: {
                self: req.protocol + '://' + req.get('host') + req.originalUrl,
                collection: req.protocol + '://' + req.get('host') + '/idols'
            }

    })

    } catch (error) {
        res.status(400).json({success: false});
    }

}

exports.createIdol = async (req, res, next) => {
    try {
        const idol = await Idol.create(req.body);
        res.status(201).json({success: true, data: idol});
    } catch (error) {
        res.status(400).json({success: false});
    }

}

exports.updateIdol = async (req, res, next) => {
    try {
        const idol = await Idol.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!idol) {
            return res.status(404).json({success: false});
        }
        res.status(200).json({success: true, data: idol});

    } catch (error) {
        res.status(400).json({success: false});
    }
}

exports.deleteIdol = async (req, res, next) => {
    try {
        const idol = await Idol.findByIdAndDelete(req.params.id);
        if (!idol) {
            return res.status(400).json({success: false});
        }
        res.status(200).json({success: true, data: {}});
    } catch (error) {
        res.status(400).json({success: false});
    }
}

exports.optionsIdols = async (req, res, next) => {
    res.set({
        'Allow': 'GET, PUT, DELETE, OPTIONS, POST',
        'Access-Control-Allow-Methods': 'GET, PUT, DELETE, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'content-type': 'application/json, application/x-www-form-urlencoded'
    }).send();
    res.status(204).end()
}

exports.optionsIdol = async (req, res, next) => {

    res.set({
        'Allow': 'GET, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'content-type': 'application/json, application/x-www-form-urlencoded'
    }).send();
    res.status(204).end()
}

module.exports = exports;