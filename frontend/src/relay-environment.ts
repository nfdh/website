import { Network, RecordSource, Environment, Store, RequestParameters, CacheConfig, UploadableMap } from "relay-runtime";

let fetchRelay;
if (process.env.SSR) {
    fetchRelay = function (params: RequestParameters, variables: any, cacheConfig: CacheConfig, uploadables?: UploadableMap | null): Promise<any> {
        return new Promise(function(resolve, reject) {
            const https = require('https');

            const body = JSON.stringify({
                query: params.text,
                variables
            });

            const options = {
                hostname: 'localhost',
                port: 443,
                path: '/query',
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Content-Length": body.length,
                    "Cookie": "PHPSESSID=" + require("./index.server").CurrentRequestInfo.sessionId
                }
            };

            const req = https.request(options, res => {
                if (req.statusCode !== 200) {
                    reject();
                }
                else {
                    const chunks = [];
                    res.on('data', chunk => {
                        chunks.push(chunk);
                    });

                    res.on("end", function() {
                        const result = chunks.join();
                        resolve(JSON.parse(result));
                    });
                }
            });

            req.on('error', error => {
                reject(error);
            });

            req.write(body);
            req.end();
        });
    };
}
else {
    let URL;
    if (process.env.WEBPACK_DEV_SERVER) {
        URL = "http://localhost:8081/query.php";
    }
    else {
        URL = "/query";
    }

    function checkCache(hash: string) {
        const ssr_data = (window as any).__SSR_DATA__;

        if (ssr_data && ssr_data[hash]) {
            const data = ssr_data[hash];
            delete ssr_data[hash];
            return data;
        }

        return false;
    }

    if ("fetch" in window) {
        fetchRelay = async function(params: RequestParameters, variables: any, cacheConfig: CacheConfig, uploadables?: UploadableMap | null) {
            const cached = checkCache[params.id];
            if(cached) {
                return cached;
            }

            let body: string | FormData;
            let headers: HeadersInit = {};
        
            if (uploadables) {
                const formData = new FormData();
                formData.append("query", params.text!);
                formData.append("variables", JSON.stringify(variables));
                for (let key of Object.keys(uploadables)) {
                    formData.append(key, uploadables[key]);
                }
                body = formData;
            }
            else {
                body = JSON.stringify({
                    query: params.text,
                    variables
                });
                headers["Content-Type"] = "application/json";
            }
        
            const response = await fetch(URL, {
                method: 'POST',
                headers: headers,
                body: body
            });
        
            // Get the response as JSON
            return await response.json();
        };
    }
    else {
        fetchRelay = function(params: RequestParameters, variables: any, cacheConfig: CacheConfig, uploadables?: UploadableMap | null): Promise<any> {
            return new Promise(function (resolve, reject) {
                const cached = checkCache[params.id];
                if(cached) {
                    resolve(cached);
                    return;
                }
                
                const request = new XMLHttpRequest();
                request.onreadystatechange = function () {
                    if (request.readyState === 4) {
                        const json = JSON.parse(request.responseText);
                        resolve(json);
                    }
                };
                request.onerror = function () {
                    reject(request);
                };
                request.open("POST", URL);
        
                if (uploadables) {
                    const formData = new FormData();
                    formData.append("query", params.text!);
                    formData.append("variables", JSON.stringify(variables));
                    for (let key of Object.keys(uploadables)) {
                        formData.append(key, uploadables[key]);
                    }
                    request.send(formData);
                }
                else {
                    request.setRequestHeader("Content-Type", "application/json");
                    request.send(JSON.stringify({
                        query: params.text!,
                        variables
                    }));
                }
            });
        };
    }
}

const source = new RecordSource();
const store = new Store(source);
const network = Network.create(fetchRelay); 

export default new Environment({
    network,
    store,
});
