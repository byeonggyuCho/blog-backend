const { ADMIN_PASS: adminPass } = process.env;

exports.login = (req,res) => {

    const { password } = req.params;

    console.log(req)
    console.log(adminPass, password)
    if(adminPass === password ) {
        // 로그인에 성공하면 logged 값을 true로 설정한다.
        req.session.logged = true;
        res.send({
            success: true
        })

    } else {
        req.status = 401; // Unathorized
        console.log('ctrl: 2')
        res.send({
            success: false
        })
    }
};

exports.check = (req,res) => {
    let result  = {
        // ! 문자를 두 번 입력하여 값이 존재하지 않을 때도 false를 반환하도록 설정한다.
        logged: !!req.session.logged
    };

    res.send(result);
};

exports.logout = (req) => {
    req.session = null;
    req.status = 204; // No Content
};