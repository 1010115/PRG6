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
                    href: req.protocol + '://' + req.get('host') + req.baseUrl + '?start=' + (pages - 1) * limit + '&limit=' + limit
                },
                next: {
                    page: page + 1,
                    href: req.protocol + '://' + req.get('host') + req.baseUrl + '?start=' + (page * limit) + '&limit=' + limit
                },
                prev: {
                    page: page - 1,
                    href: req.protocol + '://' + req.get('host') + req.baseUrl + '?start=' + (page - 2) * limit + '&limit=' + limit
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
        const idol = await Idol.create(req.body);
        res.status(201).json({
            data: idol,
            _links: {
                self: {href: req.protocol + '://' + req.get('host') + req.originalUrl},
                collection: {href: req.protocol + '://' + req.get('host') + '/api/idols'}
            }});
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

        const idol = await Idol.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!idol) {
            return res.status(404).json({message: 'Idol not found'});
        }
        res.status(200).json({
            data: idol,
            _links: {
                self: {href: req.protocol + '://' + req.get('host') + req.originalUrl},
                collection: {href: req.protocol + '://' + req.get('host') + '/api/idols'}
            }});

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
        res.status(200).json({data: {}});
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
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