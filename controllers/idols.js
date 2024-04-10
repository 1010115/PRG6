const Idol = require('../models/Idol');
const cors = require('cors');

exports.getIdols = async (req, res, next) => {
    try {

        res.set({
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Allow': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type'
        });

        const total = await Idol.countDocuments();
        const limit = parseInt(req.query.limit) || total;
        let start = parseInt(req.query.start) || 1;
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


        const idolsWithLinks = idols.map(idol => {
            idol = idol.toObject(); // Convert idol to a plain object so we can add properties
            idol._links = {
                self: {href: `${req.protocol}://${req.get('host')}${req.baseUrl}/${idol._id}`},
                collection: {href: `${req.protocol}://${req.get('host')}${req.originalUrl}`}
            };
            return idol;
        });

        const pagination = {
            totalPages: pages,
            currentPage: page,
            totalItems: total,
            currentItems: limit,
            _links: {
                first: {
                    page: 1,
                    href: req.protocol + '://' + req.get('host') + req.baseUrl + '?start=0&limit=' + limit
                },
                last: {
                    page: pages,
                    href: req.protocol + '://' + req.get('host') + req.baseUrl + '?start=' + (pages) * limit + '&limit=' + limit
                },
                next: {
                    page: page + 1,
                    href: req.protocol + '://' + req.get('host') + req.baseUrl + '?start=' + (page * limit) + '&limit=' + limit
                },
                previous: {
                    page: page - 1 < 1 ? 1 : page - 1,
                    href: req.protocol + '://' + req.get('host') + req.baseUrl + '?start=' + (start - limit < 0 ? 0 : start - limit) + '&limit=' + limit
                },
            }
        }


        res.status(200).json({
            items: idolsWithLinks,
            _links: {
                self: {href: `${req.protocol}://${req.get('host')}${req.originalUrl}`}
            },
            pagination: pagination
        });
    } catch
        (error) {
        res.status(400).json({
            message: error.message
        })

    }
}

exports.getIdol = async (req, res, next) => {
    try {
        res.set({
            'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS, PUT',
            'Allow': 'GET, DELETE, OPTIONS, PUT',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type'
        });

        const idol = await Idol.findById(req.params.id);
        if (!idol) {
            return res.status(404).json({message: 'Idol not found'});
        }
        res.status(200).json({
            data: idol,
            _links: {
                self: {href: req.protocol + '://' + req.get('host') + req.originalUrl},
                collection: {href: req.protocol + '://' + req.get('host') + '/api/idols'}
            }
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

exports.createIdol = async (req, res, next) => {
    try {
        const idolData = req.body.data ? req.body.data : req.body;
        const idol = await Idol.create(idolData);
        res.status(201).json({
            idol,
            _links: {
                self: {href: req.protocol + '://' + req.get('host') + req.originalUrl},
                collection: {href: req.protocol + '://' + req.get('host') + '/api/idols'}
            }
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        })

    }
}

exports.updateIdol = async (req, res, next) => {
    try {
        if (Object.keys(req.body).length === 0 || Object.values(req.body).some(value => value === '')) {
            return res.status(400).json({
                message: 'Empty values are not allowed'
            });
        }

        let idol = await Idol.findByIdAndUpdate(req.params.id, req.body.data, {
            new: true,
            runValidators: true
        });
        if (!idol) {
            return res.status(404).json({message: 'Idol not found'});
        }

        idol = idol.toObject();
        idol._links = {
            self: {href: req.protocol + '://' + req.get('host') + req.originalUrl},
            collection: {href: req.protocol + '://' + req.get('host') + '/api/idols'}
        };

        res.status(200).json({
            data: idol,
        });

    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

exports.deleteIdol = async (req, res, next) => {
    try {
        const idol = await Idol.findByIdAndDelete(req.params.id);
        if (!idol) {
            return res.status(400).json({message: 'Idol not found'});
        }
        res.status(204).json({data: {}});
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

exports.optionsIdols = async (req, res, next) => {
    res.set({
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Allow': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.status(204).end();
}

exports.optionsIdol = async (req, res, next) => {
    res.set({
        'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS, PUT',
        'Allow': 'GET, DELETE, OPTIONS, PUT',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.status(204).end();
}

module.exports = exports;