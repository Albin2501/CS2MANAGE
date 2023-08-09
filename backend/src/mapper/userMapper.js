// ------------------------------- EXPORTED FUNCTIONS -------------------------------

function userInfoDTOToUserInfo(userInfoDTO) {
    const userInfo = {
        name: userInfoDTO.name,
        steamId: userInfoDTO.steamId
    };

    return userInfo;
}

module.exports = { userInfoDTOToUserInfo };