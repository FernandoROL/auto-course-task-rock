import axios from "axios";

export const axiosConfig = (courseID) => axios({
    method: "get",
    url: `https://udemy.com/api-2.0/courses/${courseID}/public-curriculum-items/`,
    params: {
        page_size: 'max',
    },
})