const Rating = require('../models/rating');

exports.getRating = (req, res) => {
    Rating.aggregate([{
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "result"
            }
        },
        {
            $unwind: "$result"
        }
    ], (err, resRating) => {
        if (err) {
            console.log(err);

        } else {
            const data = [];
            const arrayRating = [];
            resRating.forEach(item => {
                arrayRating.push({
                    firstName: item.result.firstName,
                    lastName: item.result.lastName,
                    email: item.result.email,
                    contents: item.contents,
                    rating: item.rating
                });
            });

            for (var i = 0; i < arrayRating.length; i += 5) {
                data.push(arrayRating.slice(i, i + 5));
            }

            res.send({ 'statusCode': 200, 'statusText': 'Success', data });
        }
    });
}