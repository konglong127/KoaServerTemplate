const jwt = require('jsonwebtoken');

class Jwt {
    constructor(data) {
        this.data = data;
    }
    // 生成token
    createToken() {
        let token = jwt.sign({
            data:this.data,
            exp: Math.floor(Date.now() / 1000) + 60 * 600,
        }, 'Whole stack');
        return token;
    }
    // 校验token
    verifyToken() {
        let res;
        try {
            let result = jwt.verify(this.data, 'Whole stack') || {};
            let {exp = 0} = result;
            if (Math.floor(Date.now() / 1000) <= exp) {
                res = result.data || {};
            }
        } catch (e) {
            res = 'err';
        }
        return res;
    }
}

module.exports = Jwt;