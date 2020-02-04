module.exports = {
    "port": 3000,
    "appEndpoint": "http://localhost:3000",
    "apiEndpoint": "http://localhost:3000",
    "jwt_secret": "secretKey",
    "jwt_expiration_in_seconds": 36000,
    "environment": "dev",
    // "permissionLevels": {
    //     "NORMAL_USER": 1,
    //     "PAID_USER": 4,
    //     "ADMINISTRATOR": 1
    // }
    "SMTP_HOST": {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'lengockhoa95@gmail.com',
            pass: 'Khoale95'
        },
        from: '"I2I" <khoa.ln@i2icorp.net>'
    },
};