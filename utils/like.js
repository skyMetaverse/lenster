import 'dotenv/config';
import axios from 'axios';
import { login } from './login.js';
import { getUserProfiles } from './profiles.js';


let pk = process.env.PK;
let publicationId = process.env.PUBLICATIONID;

let like = async(userProfile, loginResult) => {
    let url = "https://api.lens.dev/";
    let config = {
        headers: {
            "referer": "https://claim.lens.xyz/",
            "origin": "https://claim.lens.xyz",
            "content-type": "application/json",
            "x-access-token": `Bearer ${loginResult.accessToken}`,
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36"
        }
    };
    let payload = {
        "operationName": "AddReaction",
        "variables": {
            "request": {
                "profileId": `${userProfile.id}`,
                "reaction": "UPVOTE",
                "publicationId": `${publicationId}`
            }
        },
        "query": "mutation AddReaction($request: ReactionRequest!) {\n  addReaction(request: $request)\n}"
    };
    try{
        let res = await axios.post(url, payload, config);
        if(res.data.data.addReaction == null){
            console.log(`${userProfile.handle}---点赞成功`);
        }
    }catch(err){
        console.log(`${userProfile.handle}---点赞失败: ${err}`);
        return false
    };
}

let start = async() => {
    let loginResult = await login(pk);
    let userProfile =  await getUserProfiles(pk);
    await like(userProfile, loginResult);
}

start()