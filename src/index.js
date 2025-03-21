import { axiosConfigChapters, axiosConfigDescription } from "./axios.config.js"
import readline from "readline"
import { RockApi, ListIdStatusEnum, PriorityEnum } from 'rock.so-sdk'

// Authenticating rock bot
const rockApi = process.env.ROCK_BOT_TOKEN ? new RockApi(process.env.ROCK_BOT_TOKEN) : (() => {
    console.log("The Rock.so bot token was not set...")
    process.exit(1)
})

// Initializing readline for the user confirmation input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function askQuestion(query) {
    return new Promise((resolve) => rl.question(query, resolve));
}

// Function to process the user link for the first udemy request
function linkProcesser(link) {
    if (link.slice(-1) === "/") {
        link = link.slice(0, -1)
    }
    return link.split('/').pop()
}

// Function that will parse the api response to get a simplified object with just the information that will be used 
function parseCourseData(response) {
    const courseDesc = {
        url: "http://udemy.com" + response.url,
        id: response.id,
        title: "CURSO - " + response.title,
        instructors: response.visible_instructors.map(item => {
            return item.title
        })
    }

    return courseDesc
}

// Function that will parse the api response to get a simplified object with just the information that will be used 
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
    const courseDescriptionMain = parseCourseData(axiosResponseMain)

    const axiosResponseChapters = await axiosConfigChapters(courseDescriptionMain.id)
    const courseChapterArray = chaptersParsedData(axiosResponseChapters)

    console.log("Task title: " + "'" + courseDescriptionMain.title + "'")
    console.log("Task description:")
    console.log("   Link: " + courseDescriptionMain.url)
    console.log("   Course ID: " + courseDescriptionMain.id)
    const instructors = ""
    instructors += courseDescriptionMain.instructors.forEach(element => {
        return element
    })
    console.log("   Instructors: " + instructors)



    const answer = await askQuestion('Is the information on the task correct?\n\n Want to confirm the task creation? (y/N) \n -> ');

    if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
        try {
            await rockApi.createTask({
                body: [{ text: "hello world" }],
                listId: ListIdStatusEnum.DOING,
                priority: PriorityEnum.MEDIUM,
                title: courseDescriptionMain.title,
                owners: ["abcd123"], //Optional
                checkList: ["abcd123"], //Optional
                labels: ["abcd123"], //Optional
                watchersIds: ["abcd123"], //Optional,
            });
            console.log("\n\n---------- Task creation successful! ----------\n\n")
        } catch (error) {
            console.error("There was an error creating your task:", error.message);
        }
    } else {
        console.log("\n\n---------- Task creation canceled! ----------\n\n")
    }
    rl.close();
}