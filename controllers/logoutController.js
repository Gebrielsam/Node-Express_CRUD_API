const User = require('../model/User');


const handleLogout = async (req, res) => {
    // on client, also delete the access token

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;

    // Is refresh token in db?
    const foundUser = await User.findOne({ refreshToken }).exec();
    if(!foundUser) {
        res.clearCookie('jwt', {httpOnly: true});
        return res.sendStatus(204);
    }

    // Delete refreshToken in db
    foundUser.refreshToken = '';
    const result = await foundUser.save();

    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }); // secure: true - only serve on https
    res.sendStatus(204);
}

module.exports = { handleLogout }