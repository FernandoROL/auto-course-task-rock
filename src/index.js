import { axiosRequestConfig } from "./axios.config.js"

const response = await axiosRequestConfig(1108858)

const parsedData = () => {
    const resArr = response.data.results

    const filterChapter = resArr.filter(item => item._class === 'chapter')

    let chapterNames = []
    for(const item in filterChapter) {
        chapterNames.push(filterChapter[item]['title'])
    }

    return chapterNames
}

console.log(parsedData())