const Job = require('../models/job');

exports.searchJob = (req, res) => {
    const valueSearch = req.body;
    const textSearch = valueSearch.textSearch.toString();
    const career = valueSearch.career.toString();
    const location = valueSearch.location.toString();
    const conditionSearch = [];
    if (textSearch != '') {
        conditionSearch.push({
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
        }, )
    }

    if (career != '') {
        conditionSearch.push({
            'career': Number(career)
        })
    }

    if (location != '') {
        conditionSearch.push({
            'location': Number(location)
        });
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
                $unwind: '$resCompany'
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
                $unwind: '$resLocation'
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
                $unwind: '$resCareer'
            },
            {
                $match: {
                    $or: conditionSearch
                }
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

                }
            }
        ], (err, resSearch) => {
            if (err) {
                console.log(err);
            } else {
                if (resSearch) {
                    const data = [];
                    resSearch.forEach(job => {
                        data.push({
                            jobId: job.jobId,
                            jobTitle: job.jobTitle,
                            postedDate: job.postedDate,
                            salaryType: job.salaryType,
                            salaryCurrency: job.salaryCurrency,
                            salary: job.salary,
                            companyName: job.resCompany.companyName,
                            image: job.resCompany.image,
                            location: job.resLocation.cityName
                        })
                    });
                    res.send({ 'statusCode': 200, 'statusText': 'Success', data });
                }
            }
        });
}