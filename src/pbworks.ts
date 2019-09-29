const basePBWorksURL = "pbworks.com";
const corsProxyURL = "https://cors-anywhere.herokuapp.com/";

interface PageInfo {
    name: string;
    oid: number;
}

/**
 * Provides functions for interacting with the PBWorks web API
 */
export default class PBWorks {

    readonly workspaceName: string;
    readonly baseRequestURL: string;
    readonly adminKey: string;

    constructor(workspaceName: string, adminKey: string) {
        this.workspaceName = workspaceName;
        this.baseRequestURL = `${workspaceName}.${basePBWorksURL}/api_v2/op/`;
        this.adminKey = adminKey;
    }

    /**
     * Performs an API operation using a GET request and returns the response JSON parsed as an object
     * @param name - name of the operation e.g. GetPage
     * @param inputs - a map of input key-value pairs to be slash-separated in the request URL
     */
    async operationGet(name: string, inputs: Map<string, any>): Promise<object> {
        return await this.operation(name, 'GET', inputs, '');
    }

    /**
     * Performs an API operation using a POST request and returns the response JSON parsed as an object
     * @param name - name of the operation e.g. PutPage
     * @param inputs - a map of input key-value pairs to be slash-separated in the request URL
     * @param bodyData - a map of input key-value pairs to be passed as form data in the request body
     */
    async operationPost(name: string, inputs: Map<string, any>, bodyData: Map<string, any>): Promise<object> {
        let formData = new FormData();
        for(let [key, value] of bodyData) {
            formData.append(key, value.toString());
        }
        return await this.operation(name, 'POST', inputs, formData.toString())
    }

    private async operation(name: string, method: string, inputs: Map<string, any>, body: string) {
        let inputsString = `/admin_key/${this.adminKey}`;
        for(let [key, value] of inputs) {
            inputsString += "/" + key + "/" + value.toString();
        }
        let requestString = "https://" + this.baseRequestURL + name + inputsString;

        let response = await fetch(corsProxyURL + requestString, {
            method: method,
            mode: 'cors',
            body: body
        });
        let text = await response.text();

        let jsonString = text.substring(11, text.length - 3);
        return JSON.parse(jsonString);
    }

    /**
     * Requests from PBWorks and returns the HTML content for the specified page
     * @param page - the name of the page
     * @param oid - the object ID of the page
     * @param raw - whether to return the raw HTML content rather than preprocessed (I don't know what this means)
     */
    async getPageContent(page?: string, oid?: number, raw: boolean = false): Promise<string> {
        if(page == null && oid == null) {
            throw new Error("'page' or 'oid' must be provided");
        }

        let json = await this.operationGet("GetPage", new Map(Object.entries({
            page: page,
            oid: oid,
            raw: raw,
            verbose: true
        })));

        return json['html'];
    }

    /**
     * Updates the specified page on PBWorks with the specified HTML content
     * @param page - the name of the page
     * @param html - the HTML content to save under the page
     * @param createIfMissing - if true, then a page will be created if it doesn't already exist
     */
    async putPageContent(page: string, html: string, createIfMissing: boolean = true): Promise<boolean> {
        let json = await this.operationPost("PutPage", new Map(Object.entries({
                page: page,
                create_if_missing: createIfMissing
            })),
            new Map(Object.entries({
                html: html
            })));
        return json['success'];
    }

    /**
     * Returns a list of all pages on the current wiki
     */
    async getAllPages(): Promise<PageInfo[]> {
        let json = await this.operationGet("GetCurrentPages", new Map());
        let pages = json['pages'];

        let pageInfoArray: PageInfo[] = [];
        for(let pageName of Object.keys(pages)) {
            pageInfoArray.push({
                name: pageName,
                oid: pages[pageName]
            });
        }

        return pageInfoArray;
    }
}

