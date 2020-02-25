const Job = require('../models/job');
const ObjectId = require('mongodb').ObjectID;
const moment = require('moment');
const common = require('../utils/common');
const paginate = require('jw-paginate');
const RECORD_DISPLAY = 5;

exports.searchJob = (req, res) => {
    const valueRequest = req.body;
    const textSearch = valueRequest.textSearch.toString();
    const careerId = valueRequest.careerId;
    const locationId = valueRequest.locationId;
    const arraySearchCareer = valueRequest.arraySearchCareer;
    const arraySearchLocation = valueRequest.arraySearchLocation;
    let filter = { 'salary': -1 };
    const conditionSearch = {};
    let skip = 0;
    let limit = RECORD_DISPLAY;
    if (valueRequest.page && valueRequest.page != 1) {
        skip = (valueRequest.page - 1) * RECORD_DISPLAY;
    }

    const infoMember = common.getInfoMember(req);

    if (textSearch != '') {
        conditionSearch['$or'] = [];
        conditionSearch['$or'].push({
            'resCompany.companyName': {
                $regex: textSearch,
                $options: 'i'
            }
        }, {
            'resCareer.careerName': {
                $regex: textSearch,
                $options: 'i'
            }
        }, {
            'resLocation.cityName': {
                $regex: textSearch,
                $options: 'i'
            }
        }, {
            'jobTitle': {
                $regex: textSearch,
                $options: 'i'
            }
        });
    }

    if (careerId != '') {
        arraySearchCareer.push(careerId);
    }

    if (locationId != '') {
        arraySearchLocation.push(locationId)
    }

    if (arraySearchCareer.length > 0 || arraySearchLocation.length > 0) {
        conditionSearch['$and'] = [];
    }

    if (arraySearchCareer.length > 0) {
        conditionSearch['$and'].push({ 'career': { '$in': arraySearchCareer } })
    }

    if (arraySearchLocation.length > 0) {
        conditionSearch['$and'].push({ 'location': { '$in': arraySearchLocation } });
    }

    if (valueRequest.filter === 0) {
        filter = { 'postedDate': -1 };
    }

    Job.aggregate(
        [{
                $lookup: {
                    from: 'company',
                    localField: 'company',
                    foreignField: 'companyCode',
                    as: 'resCompany'
                }
            },
            {
                $lookup: {
                    from: 'location',
                    localField: 'location',
                    foreignField: 'cityId',
                    as: 'resLocation'
                }
            },
            {
                $lookup: {
                    from: 'career',
                    localField: 'career',
                    foreignField: 'careerId',
                    as: 'resCareer'
                }
            },
            {
                $lookup: {
                    from: 'save_job',
                    let: {
                        jobId: '$jobId'
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $eq: ['$jobId', '$$jobId']
                            },
                            memberId: infoMember.memberId != '' ? ObjectId(infoMember.memberId) : ''
                        }
                    }],
                    as: 'resSaveJob'
                }
            },
            {
                $match: conditionSearch
            },
            {
                $project: {
                    'jobId': 1,
                    'jobTitle': 1,
                    'salaryType': 1,
                    'salary': 1,
                    'salaryCurrency': 1,
                    'postedDate': 1,
                    'resCompany.companyName': 1,
                    'resCompany.image': 1,
                    'resLocation.cityName': 1,
                    'resSaveJob': 1
                }
            }, {
                $sort: filter
            },
            {
                "$facet": {
                    "totalData": [{
                            "$skip": skip
                        },
                        {
                            "$limit": limit
                        }
                    ],
                    "totalCount": [{
                        "$count": "count"
                    }]
                }
            }

        ], (err, resSearch) => {
            if (err) {
                console.log(err);
            } else {
                if (resSearch) {
                    const data = [];
                    resSearch[0].totalData.forEach(job => {
                        data.push({
                            jobId: job.jobId,
                            jobTitle: job.jobTitle,
                            postedDate: job.postedDate != null ? moment(job.postedDate).format("DD/MM/YYYY") : '',
                            salaryType: job.salaryType,
                            salaryCurrency: job.salaryCurrency,
                            salary: job.salary,
                            companyName: job.resCompany[0].companyName,
                            logoImage: job.resCompany[0].image,
                            location: job.resLocation[0].cityName,
                            saveJob: job.resSaveJob.length > 0 ? true : false
                        });
                    });

                    // get page from query params or default to first page
                    const page = parseInt(valueRequest.page) || 1;

                    const totalItem = resSearch[0].totalCount.length > 0 ? resSearch[0].totalCount[0].count : 0;
                    // get pager object for specified page
                    const pager = paginate(totalItem, page, RECORD_DISPLAY, 5);

                    res.send({ 'statusCode': 200, 'statusText': 'Success', data, pager, totalItem });
                }
            }
        });
}