import axios from "axios";

export const axiosConfigChapters = async (courseID) => {

    try {
        let response =  await axios({
            method: "get",
            url: `https://udemy.com/api-2.0/courses/${courseID}/public-curriculum-items/`,
            params: {
                page_size: 10000,
            },
        })

        return response.data
    } catch (err) {
        console.log(`Failed to get course data...`)
        return null
    }
}

export const axiosConfigDescription = async (courseID) => {
    try {
        let response = await axios({
            method: "get",
            url: `https://udemy.com/api-2.0/courses/${courseID}`,
        })

        return response.data
    } catch (err) {
        console.log(`Failed to get course data...`)
        return null
    }
}
