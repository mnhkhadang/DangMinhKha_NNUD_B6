let jwt = require('jsonwebtoken')
let userController = require("../controllers/users");
module.exports = {
    checkLogin: function (req, res, next) {
        try {
            let token;
            if (req.cookies.token) {
                token = req.cookies.token
            }
            else {
                let authorizationToken = req.headers.authorization;
                if (!authorizationToken.startsWith("Bearer")) {
                    res.status(403).send({
                        message: "ban chua dang nhap"
                    })
                    return;
                }
                token = authorizationToken.split(' ')[1];
            }
            let result = jwt.verify(token, 'HUTECH');
            if (result.exp > Math.floor(Date.now() / 1000)) {
                req.userId = result.id;
                next();
            } else {
                res.status(403).send({
                    message: "ban chua dang nhap"
                })
            }
        } catch (error) {
            res.status(403).send({
                message: "ban chua dang nhap"
            })
            return;
        }
    },
    checkRole: function (...requiredRole) {
        return async function (req, res, next) {
            try {
                let userId = req.userId;
                let getUser = await userController.FindByID(userId);
                
                // ← thêm kiểm tra null
                if (!getUser) {
                    return res.status(403).send({ message: "user khong ton tai" });
                }

                if (!getUser.role) {
                    return res.status(403).send({ message: "user chua co role" });
                }

                let roleName = getUser.role.name;
                if (requiredRole.includes(roleName)) {
                    next();
                } else {
                    res.status(403).send({ message: "ban khong co quyen" });
                }
            } catch (error) {
                res.status(403).send({ message: "ban khong co quyen" });
            }
        }
    }
    
}