import 'dotenv/config';
import axios from 'axios';
import { login } from './login.js';
import { v4 as uuidv4 } from 'uuid';
import { getUserProfiles } from './profiles.js';

let pk = process.env.PK;
let context = process.env.CONTEXT;

let post1 = async(userProfile) => {
    let url = "https://api.lenster.xyz/metadata/upload";
    let config = {
        headers: {
            "referer": "https://claim.lens.xyz/",
            "origin": "https://claim.lens.xyz",
            "content-type": "application/json",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36"
        }
    };
    let payload = {
        "version": "2.0.0",
        "metadata_id": `${uuidv4()}`,
        "description": `${context}`,
        "content": `${context}`,
        "external_url": `https://lenster.xyz/u/${userProfile.handle}`,
        "image": null,
        "imageMimeType": "image/svg+xml",
        "name": `Post by @${userProfile.handle}`,
        "tags": [],
        "animation_url": null,
        "mainContentFocus": "TEXT_ONLY",
        "contentWarning": null,
        "attributes": [{
            "traitType": "type",
            "displayType": "string",
            "value": "text_only"
        }],
        "media": [],
        "locale": "zh-CN",
        "appId": "Lenster"
    };
    try{
        let res = await axios.post(url, payload, config);
        // console.log(res.data.id);
        return res.data.id;
    }catch(err){
        console.log(`${userProfile.handle}---post1失败: ${err}`);
        return false
    };
}

let post2 = async(arId, userProfile, loginResult) => {
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
        "operationName": "CreatePostViaDispatcher",
        "variables": {
            "request": {
                "profileId": `${userProfile.id}`,
                "contentURI": `https://arweave.net/${arId}`,
                "collectModule": {
                    "revertCollectModule": true
                },
                "referenceModule": {
                    "degreesOfSeparationReferenceModule": {
                        "commentsRestricted": true,
                        "mirrorsRestricted": true,
                        "degreesOfSeparation": 2
                    }
                }
            }
        },
        "query": "mutation CreatePostViaDispatcher($request: CreatePublicPostRequest!) {\n  createPostViaDispatcher(request: $request) {\n    ...RelayerResultFields\n    __typename\n  }\n}\n\nfragment RelayerResultFields on RelayResult {\n  ... on RelayerResult {\n    txHash\n    txId\n    __typename\n  }\n  ... on RelayError {\n    reason\n    __typename\n  }\n  __typename\n}"
    };
    try{
        let res = await axios.post(url, payload, config);
        // console.log(res.data.data.createPostViaDispatcher.txId);
        if(res.data.data.createPostViaDispatcher.txId != ""){
            console.log(`${userProfile.handle}---发帖成功`);
        }
    }catch(err){
        console.log(`${userProfile.handle}---post2失败: ${err}`);
        return false
    };
}

let start = async() => {
    let loginResult = await login(pk);
    let userProfile =  await getUserProfiles(pk);
    let arId = await post1(userProfile);
    await post2(arId, userProfile, loginResult);

}

start()