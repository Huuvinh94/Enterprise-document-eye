const Question = require('../models/question');
const ObjectId = require('mongodb').ObjectID;
const Transaction = require("mongoose-transactions");

// Require library
var xl = require('excel4node');
var xlsx = require('xlsx');
var fs = require('fs');
var path = require('path');
var mime = require('mime');

exports.getAllQuestion = (req, res) => {
    getAllQuestions((question) => {
        res.send({ 'statusCode': 200, 'statusText': 'Success', data: question });
    })
}

exports.deleteQuestion = (req, res) => {
    Question.findOne({ '_id': ObjectId(req.body._id) }, (err, survey) => {
        if (survey) {
            Question.deleteOne({ '_id': ObjectId(req.body._id) }, (err, done) => {
                if (!err) {
                    res.send({ 'statusCode': 200, 'statusText': ':: Delete successfully!!' });
                } else {
                    res.send({ 'statusCode': 500, 'statusText': ':: Delete error!!' });
                }
            });
        } else {
            res.send({ 'statusCode': 404, 'statusText': ':: Question not found!!' });
        }
    });
}

exports.createQuestion = (req, res) => {
    const questionData = req.body;
    questionData.userCreate = req.email;
    questionData.careerId = ObjectId(questionData.careerId);
    questionData.createdAt = new Date();
    questionData.updatedAt = new Date();
    delete questionData._id
    Question.find({ content: questionData.content.trim(), careerId: questionData.careerId }, (err, questionRes) => {
        if (err) {
            res.send({ 'statusCode': 401, 'statusText': ':: Create question fail' });
        } else if (questionRes.length === 0) {
            const question = new Question(questionData);
            question.save((err, finalRes) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send({ 'statusCode': 200, 'statusText': ':: Create question successfully!!' });
                }
            });
        } else {
            res.send({ 'statusCode': 401, 'statusText': ':: Question already exists' });
        }
    })
}

exports.getQuestById = (req, res) => {
    Question.findOne({ '_id': ObjectId(req.query._id) }, (err, quest) => {
        if (err) {
            console.log(err);
        } else {
            if (!quest) {
                res.send({ 'statusCode': 401, 'statusText': ':: User not exist' });
            } else {
                const data = {
                    careerId: quest.careerId,
                    content: quest.content,
                    _id: quest._id
                }
                res.send({ 'statusCode': 200, 'statusText': 'Success', questDetail: data });
            }
        }
    });
}

exports.editQuest = (req, res) => {
    req.body.careerId = ObjectId(req.body.careerId)
    Question.updateOne({ '_id': ObjectId(req.body._id) }, req.body, (err, done) => {
        if (!err) {
            res.send({ 'statusCode': 200, 'statusText': ':: Update successfully!!' });
        } else {
            res.send({ 'statusCode': 500, 'statusText': 'Internal Server Error' });
        }
    });
}

exports.createFileExcelQuestions = (req, res) => {
    getAllQuestions((question) => {
        if (question != null) {
            try {
                var wb = new xl.Workbook();

                var ws = wb.addWorksheet('Sheet 1');

                var styleHeader = wb.createStyle({
                    font: {
                        color: '#FF0800',
                        size: 15
                    }
                });

                var styleCell = wb.createStyle({
                    font: {
                        color: '#000000',
                        size: 12
                    }
                });
                ws.cell(1, 1)
                    .string('STT')
                    .style(styleHeader);

                ws.cell(1, 2)
                    .string('Nội dung')
                    .style(styleHeader);

                ws.cell(1, 3)
                    .string('Ngành nghề')
                    .style(styleHeader);

                question.forEach((item, i) => {
                    var rowIndex = i + 2;
                    ws.cell(rowIndex, 1)
                        .number(rowIndex - 1)
                        .style(styleCell);

                    ws.cell(rowIndex, 2)
                        .string(item.content)
                        .style(styleCell);

                    ws.cell(rowIndex, 3)
                        .string(item.career[0].careerName)
                        .style(styleCell);
                });

                wb.writeToBuffer().then(buffer => {
                    // Do something with buffer
                    var fileName = `Question_${Date.now()}.xlsx`;

                    var fileContents = Buffer.from(buffer, "base64");
                    fs.writeFile(fileName, fileContents, (err) => {

                        if (err) {
                            console.log(err);

                        } else {
                            var filename = path.basename(fileName);
                            var mimeType = mime.lookup(fileName);

                            res.setHeader('Content-disposition', 'attachment; filename=' + filename);
                            res.setHeader('Content-type', mimeType);

                            var fileStream = fs.createReadStream(fileName);
                            fileStream.pipe(res);
                            fs.unlink(fileName, (err) => {
                                if (err) {
                                    console.log(err);
                                }
                            });
                        }
                    });
                });
            } catch (error) {
                throw new Error(error);
            }

        }
    });
}

exports.readFileExcel = (req, res) => {

    const buffer = req.file.buffer;
    const workbook = xlsx.read(buffer);
    const sheetNames = workbook.SheetNames;

    let rowObject = [];
    sheetNames.forEach(s => {
        // rowObject = xlsx.utils.sheet_to_row_object_array(workbook.Sheets[s]);
        const sheetIndex = workbook.Sheets[s];

        Object.keys(sheetIndex).forEach(function(key, index) {
            const indexVal = index + 2;
            if (sheetIndex['A' + indexVal] && sheetIndex['B' + indexVal] && sheetIndex['C' + indexVal]) {
                rowObject.push({ content: sheetIndex['B' + indexVal].v, careerId: sheetIndex['C' + indexVal].v });
            }
        });

        if (rowObject.length > 0) {
            res.send({ 'statusCode': 200, 'statusText': 'Success', data: rowObject });
        }
    });
}

exports.importQuestion = async(req, res) => {
    const transaction = new Transaction();
    const listQuest = req.body;
    try {
        listQuest.forEach(item => {
            transaction.insert('question', {
                careerId: item.careerId,
                content: item.content,
                userCreate: req.email,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        });
        const final = await transaction.run();
        if (final.length > 0) {
            res.send({ 'statusCode': 200, 'statusText': ':: Create question successfully!!' });
        }

    } catch (error) {
        console.log(error);
        await transaction.rollback().catch(console.error);
        transaction.clean();
    }

}

function getAllQuestions(callback) {
    Question.aggregate([{
        $lookup: {
            from: "career",
            localField: "careerId",
            foreignField: "careerId",
            as: "career"
        }
    }], (err, question) => {
        if (err) {
            console.log(err);
        } else {
            if (question) {
                return callback(question);
            }
        }
    });
}