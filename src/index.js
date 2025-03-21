import { axiosConfigChapters, axiosConfigDescription } from "./axios.config.js"

function linkProcesser(link) {
    if (link.slice(-1) === "/") {
        link = link.slice(0, -1)
    }
    return link.split('/').pop()
}

function parseCourseData(response) {
    const courseDesc = {
        url: "http://udemy.com" + response.url,
        id: response.id,
        title: response.title,
        instructors: response.visible_instructors.map(item => {
            return item.title
        })
    }

    return courseDesc
}

function chaptersParsedData(respose) {
    const responseArray = respose.results

    const filterChapter = responseArray.filter(item => item._class === 'chapter')

    let chapterNames = []
    for (const item in filterChapter) {
        const nameSection = "Section: " + filterChapter[item]['title']
        chapterNames.push(nameSection)
    }

    return chapterNames
}

const courseURL = process.argv[2]

const axiosResponseMain = await axiosConfigDescription(linkProcesser(courseURL))

if (!axiosResponseMain) {
    console.log("Check if the course link is valid... Do not keep the course coupon code in the link")
} else {
    const courseID = axiosResponseMain.id

    const axiosResponseChapters = await axiosConfigChapters(courseID)

    const courseChapterArray = chaptersParsedData(axiosResponseChapters)
    const courseDescriptionMain = parseCourseData(axiosResponseMain)

    console.log(courseDescriptionMain)
    console.log(courseChapterArray)
}