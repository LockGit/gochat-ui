import {objectToQueryString, post, get} from "./http";
import {ApiHost} from "./env";


export interface Response<T> {
    code: number,
    data: T;
    success?: boolean;
    error?: string
}

export async function userLogin(params: any) {
    return await post<Response<any>>(ApiHost + "/user/login", params);
}

export async function userLogout(params: any) {
    return await post<Response<any>>(ApiHost + "/user/logout", params);
}

export async function userRegister(params: any) {
    return await post<Response<any>>(ApiHost + "/user/register", params);
}

export async function checkAuth(params: { authToken: string }) {
    if (params.authToken === '') {
        return
    }
    return await post<Response<any>>(ApiHost + "/user/checkAuth", params);
}

export async function getRoomInfo(params: any) {
    return await post<Response<any>>(
        ApiHost + `/push/getRoomInfo`,
        params,
    )
}

export async function pushRoom(params: {
    op: number | 5,
    msg: string,
    roomId: number,
    authToken: string,
}) {
    return await post<Response<any>>(
        ApiHost + `/push/pushRoom`,
        params,
    )
}


export async function getOnlineUserList(params: any) {
    const queryString = objectToQueryString(params);
    return await get<Response<any>>(
        ApiHost + `/user/register/${queryString}`,
    )
}


export function getAuthToken() {
    return localStorage.getItem("authToken");
}

export function setAuthToken(token: string) {
    return localStorage.setItem("authToken", token);
}

export function clearAuthToken() {
    return localStorage.setItem("authToken", "");
}
