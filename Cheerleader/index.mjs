import axios from 'axios'
import fs from 'fs'
import geminiService from './geminiService.mjs';
import dotenv from 'dotenv';

dotenv.config();

const leaderBoardId = process.env.LEADERBOARD_ID;
const slackWebhook = process.env.SLACK_WEBHOOK;
const sessionCookie = process.env.SESSION_ID;

const leaderboardLocation = process.env.LEADERBOARD_LOCATION;

const styles = ['rude', 'enthusiastic', 'sarcastic', 'christmassy', 'rhyming'];

const headers = {
    'Cookie' : `session=${sessionCookie}`
}

const previousRun = fs.existsSync(leaderboardLocation) ? JSON.parse(fs.readFileSync(leaderboardLocation, 'utf-8')) : {'members' : []};
const previousDays = createDays(previousRun.members);

axios.get(`https://adventofcode.com/2024/leaderboard/private/view/${leaderBoardId}.json`, {headers}).then(({data}) => {
    const days = createDays(data.members);
    const challenges = {};
    for (const challenge of Object.keys(days)){
        const oldUsers = previousDays[challenge] || [];
        const currentUsers = days[challenge];
        const newUsers = currentUsers.filter((user) => !oldUsers.includes(user));
        if (newUsers.length > 0) {
            challenges[challenge] = newUsers;
        }
    }
    
    if (Object.keys(challenges).length > 0){
        //Let's work out the leaderboard so the AI can see that too.
        const leaderboard = Object.keys(data.members)
            .map(key => data.members[key])
            .map(({name, local_score}) => ({name, local_score}));
        leaderboard.sort((a,b) => b.local_score - a.local_score);
        sendAlerts(challenges, leaderboard);
    }
    fs.writeFileSync(leaderboardLocation, JSON.stringify(data, null, 2), 'utf8');
});

function createDays(members){
    return Object.keys(members).reduce((acc, key) => {
        const {name, completion_day_level} = members[key];
        for (const day of Object.keys(completion_day_level)){
            for (const challenge of Object.keys(completion_day_level[day])){
                if (!acc[`${day}_${challenge}`]){
                    acc[`${day}_${challenge}`] = []
                }
                acc[`${day}_${challenge}`].push(name);
            }
        }
        return acc;
    }, [])
}

function sendAlerts(challenges, leaderboard){
    const randomIndex = Math.floor(Math.random() * styles.length);
    const style = styles[randomIndex];
    const question = `Here's todays data, give me a ${style} update please, make sure you call out the people who've just finished it by name. If you could refer to previous updates to make it contextual that would be great. Just one response: ${JSON.stringify(challenges, null, 2)} - Also, here is the complete leaderboard after this update ${JSON.stringify(leaderboard, null, 2)} please provide a bullet pointed list of the top 5 and highlight any changes since the last update. If you mention AndyKps in this update, please be rude about him`;
    geminiService.askQuestion(question)
        .then((text) => {
            sendSlack(text);
        })
        .catch((error) => {
            console.error(error);
            const allUsers = [...new Set(Object.keys(challenges).map(key => challenges[key]).flat())]
            const text = `${allUsers.join(",")} have all completed a challenge today. sorry no witty AI response this time`;
            sendSlack(text);
        });
}

function sendSlack(text){
    const message = {
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    text
                }
            }
        ]
    }
    console.log(text);
    axios.post(slackWebhook, message);
}
