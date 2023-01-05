import axios from "axios";
import { login } from './login.js';


let userProfiles = async(address, accessToken) => {
    let url = "https://api.lens.dev/";
    let config = {
        headers: {
            "referer": "https://claim.lens.xyz/",
            "origin": "https://claim.lens.xyz",
            "content-type": "application/json",
            "x-access-token": `Bearer ${accessToken}`,
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36"
        }
    };
    let payload = {
        "operationName": "UserProfiles",
        "variables": {
            "ownedBy": `${address}`
        },
        "query": "query UserProfiles($ownedBy: [EthereumAddress!]) {\n  profiles(request: {ownedBy: $ownedBy}) {\n    items {\n      ...ProfileFields\n      interests\n      stats {\n        totalFollowing\n        __typename\n      }\n      isDefault\n      dispatcher {\n        canUseRelay\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  userSigNonces {\n    lensHubOnChainSigNonce\n    __typename\n  }\n}\n\nfragment ProfileFields on Profile {\n  id\n  name\n  handle\n  bio\n  ownedBy\n  isFollowedByMe\n  stats {\n    totalFollowers\n    totalFollowing\n    __typename\n  }\n  attributes {\n    key\n    value\n    __typename\n  }\n  picture {\n    ... on MediaSet {\n      original {\n        url\n        __typename\n      }\n      __typename\n    }\n    ... on NftImage {\n      uri\n      __typename\n    }\n    __typename\n  }\n  followModule {\n    __typename\n  }\n  __typename\n}"
    };
    try{
        let res = await axios.post(url, payload, config);
        return {
            "id": res.data.data.profiles.items[1].id,
            "name": res.data.data.profiles.items[1].name,
            "handle": res.data.data.profiles.items[1].handle,
            "totalFollowers": res.data.data.profiles.items[1].stats.totalFollowers,
            "totalFollowing": res.data.data.profiles.items[1].stats.totalFollowing,
        }
    }catch(err){
        console.log(`${address}---获取个人信息失败: ${err}`);
        return false
    };
}

let getUserProfiles = async(pk) => {
    let loginResult = await login(pk);
    let result = await userProfiles(loginResult.walletAddress, loginResult.accessToken);
    return result;
}

export {
    getUserProfiles
}