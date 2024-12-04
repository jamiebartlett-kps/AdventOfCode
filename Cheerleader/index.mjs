import axios from 'axios'
import fs from 'fs'
import geminiService from './geminiService.mjs';
import dotenv from 'dotenv';

dotenv.config();

const leaderBoardId = process.env.LEADERBOARD_ID;
const slackWebhook = process.env.SLACK_WEBHOOK;
const sessionCookie = process.env.SESSION_ID;

const leaderboardLocation = process.env.LEADERBOARD_LOCATION;

const styles = ['sassy', 'enthusiastic', 'sarcastic', 'witty', 'nerdy', 'christmassy'];

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
        challenges[challenge] = newUsers;
    }
    if (Object.keys(challenges).length > 0){
        sendAlerts(challenges);
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

function sendAlerts(challenges){
    const randomIndex = Math.floor(Math.random() * styles.length);
    const style = styles[randomIndex];
    const question = `We're doing an advent calendar of coding challenges at work, below is a JSON representation of each challenge and who has completed them in the last hour. This doesn't mean people haven't done it, they may have finished it earlier. Please give me a ${style} response for our slack channel to update everyone on whose completed challenges this hour. Don't give me options, just a single response please: ${JSON.stringify(challenges, null, 2)}`;
    geminiService.askQuestion(question)
        .then((text) => {
            sendSlack(text);
        })
        .catch(() => {
            const allUsers = [...new Set(Object.keys(challenges).map(key => challenges[key]).flat())]
            const text = `${allUsers.join(",")} have all completed a challenge in the last hour, sorry no witty AI response this time`;
            sendSlack(text);
        });
}

function sendSlack(text){
    const message = {
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "plain_text",
                    text,
                    "emoji": true
                }
            }
        ]
    }
    axios.post(slackWebhook, message);
}