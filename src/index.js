import { axiosConfigChapters, axiosConfigDescription } from "./axios.config.js"
import readline from "readline"
import { RockApi } from 'rock.so-sdk';

// Authenticating rock bot
const rockApi = process.env.ROCK_BOT_API_KEY ? new RockApi(process.env.ROCK_BOT_API_KEY) : (() => {
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

// Function to process the course link for the first udemy request
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
        }),
        locale: response.locale.title
    }

    return courseDesc
}

// Function that will parse the api response to get a simplified object with just the information that will be used 
function chaptersParsedData(respose) {
    const responseArray = respose.results

    const filterChapter = responseArray.filter(item => item._class === 'chapter')

    let numbered = 1
    let chapterNames = []
    for (const item in filterChapter) {
        const nameSection = `Sectio ${numbered}: ` + filterChapter[item]['title']
        chapterNames.push(nameSection)
        numbered++
    }
    
    const filterLectures = responseArray.filter(item => item._class === 'lecture')
    
    const lectureQauntity = filterLectures.length

    return {chapterNames, lectureQauntity}
}

// Gets the link for the course and check if it works
const courseURL = process.argv[2]

if (!courseURL) {
    console.log("You have to add the course URL as an argument!\n\nusage: \n       npm run app [course url]\n\n")
    process.exit(1)
}

const axiosResponseMain = await axiosConfigDescription(linkProcesser(courseURL))

if (!axiosResponseMain) {
    console.log("Check if the course link is valid... Do not keep the course coupon code in the link")
    process.exit(1)
} else {
    const courseDescriptionMain = parseCourseData(axiosResponseMain)

    const axiosResponseChapters = await axiosConfigChapters(courseDescriptionMain.id)
    const chapterResponse = chaptersParsedData(axiosResponseChapters)
    const courseChapterArray = chapterResponse.chapterNames
    const lectureQauntity = chapterResponse.lectureQauntity

    function arrayToString(array) {
        return array.join(', ');
    }

    const instructors = arrayToString(courseDescriptionMain.instructors)

    const inputVideoTime = await askQuestion("\nWhat is the total video hours in your course's 'By the numbers' section? (number only) \n -> ")
    const inputSkillLevel = await askQuestion("\nWhat is the 'skill level' as in your course's 'By the numbers' section? \n -> ")

    // The payload that is gonna be sent to rock for the task
    const taskPayload = {
        body: [{
            text: `𝗟𝗶𝗻𝗸: ${courseDescriptionMain.url}
𝗦𝗸𝗶𝗹𝗹 𝗹𝗲𝘃𝗲𝗹: ${inputSkillLevel}
𝗟𝗮𝗻𝗴𝘂𝗮𝗴𝗲: ${courseDescriptionMain.locale}
𝗟𝗲𝗰𝘁𝘂𝗿𝗲𝘀: ${lectureQauntity}
𝗧𝗼𝘁𝗮𝗹 𝘃𝗶𝗱𝗲𝗼 𝘁𝗶𝗺𝗲: ${inputVideoTime}h
𝗜𝗻𝘀𝘁𝗿𝘂𝗰𝘁𝗼𝗿(𝘀): ${courseDescriptionMain.instructors}
𝗧𝗲𝗰𝗵𝗻𝗼𝗹𝗼𝗴𝗶𝗲𝘀:

𝗣𝗿𝗼𝗷𝗲𝗰𝘁𝘀 𝗮𝗻𝗱 𝗥𝗲𝗽𝗼𝘀𝗶𝘁𝗼𝗿𝗶𝗲𝘀: 
                ` }],
        listId: 3,
        priority: 0,
        title: courseDescriptionMain.title,
        owners: [process.env.ROCK_USER_ID],
        checkList: courseChapterArray,
        labels: ["CURSO"],
        watchersIds: process.env.ROCK_WATCHER_LIST,
    }

    console.log("\n\nHow the course is going to look:\n")

    console.log("𝗧𝗮𝘀𝗸 𝘁𝗶𝘁𝗹𝗲: " + "'" + courseDescriptionMain.title + "'\n")
    console.log("𝗧𝗮𝘀𝗸 𝗱𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻:\n")
    console.log(taskPayload.body[0].text)



    const answer = await askQuestion('Is the information on the task correct?\n\n Want to confirm the task creation? (Y/n) \n -> ');
    const normalized = answer.trim().toLowerCase();

    if (normalized === '' || normalized === 'y' || normalized === 'yes') {
        try {
            await rockApi.createTask(taskPayload);
            console.log("\n\n---------- Task creation successful! ----------\n\n")
            console.log("\n\nRemember to always update your course description and checklist!!\n\n")
        } catch (error) {
            console.error("\n\nThere was an error creating your task:", error.message + "\n\n");
        }
    } else {
        console.log("\n\n---------- Task creation canceled! ----------\n\n")
    }
    rl.close();
}