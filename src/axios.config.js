import axios from "axios";

export const axiosConfig = (courseID) => axios({
    url: `udemy.com/api-2.0/courses/${courseID}/public-curriculum-items/`
})