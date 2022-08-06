export async function http<T>(request: RequestInfo): Promise<T> {
    return fetch(request).then(async (response) => {
        if (!response.ok) {
            if (response.status === 401) {
                debugger
                window.location.reload();
            }
            throw new Error(response.statusText);
        }
        return response.json() as Promise<T>;
    }).catch((error: Error) => {
        throw error;
    });
}

export async function doHttpJson<T>(
    method: string,
    path: string,
    data: Record<string, any> = {}
): Promise<T> {
    return http<T>(new Request(path, {
        method: method,
        // credentials: 'include',
        headers: {
            "Content-type": "application/json",
        } as any,
        body: JSON.stringify(data)
    })).then(errorFilter);
}


function errorFilter(res: any) {
    if (res.code !== 0) {
        throw new Error(res.message);
    }
    return res;
}

export async function get<T>(
    path: string,
    args: RequestInit = {
        method: 'get',
        headers: {
            "Content-type": "application/json",
        } as any,
        // credentials: 'include',
    }): Promise<T> {
    return http<T>(new Request(path, args)).then(errorFilter);
}

export async function post<T>(path: string, data: Record<string, any> = {}): Promise<T> {
    return doHttpJson("post", path, data)
}


export function objectToQueryString(obj: Record<string, any>) {
    const qs = new URLSearchParams();
    const keys = Object.keys(obj);
    for (let key of keys) {
        const value = obj[key];
        if (value === undefined) {
            continue
        }
        qs.set(key, Array.isArray(value) ? value.join() : value);
    }
    return qs.toString();
}

export interface Response<T> {
    data: T;
    success: boolean;
    message: string;
    error?: string;
}

export interface ResultList<T> {
    list: T[];
    total: number;
}