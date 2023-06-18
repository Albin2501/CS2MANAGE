// ------------------------------- EXPORTED FUNCTIONS -------------------------------

function profileDTOToProfile(profileDTO) {
    const profile = {
        id: profileDTO.id,
        name: profileDTO.name,
        description: profileDTO.description
    }

    return profile;
}

module.exports = { profileDTOToProfile };
