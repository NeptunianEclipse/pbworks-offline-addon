var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const basePBWorksURL = "pbworks.com";
const corsProxyURL = "https://cors-anywhere.herokuapp.com/";
/**
 * Provides functions for interacting with the PBWorks web API
 */
class PBWorks {
    constructor(workspaceName, adminKey) {
        this.workspaceName = workspaceName;
        this.baseRequestURL = `${workspaceName}.${basePBWorksURL}/api_v2/?op=`;
        this.adminKey = adminKey;
    }
    /**
     * Performs an API operation using a GET request and returns the response JSON parsed as an object
     * @param name - name of the operation e.g. GetPage
     * @param inputs - a map of input key-value pairs to be slash-separated in the request URL
     */
    operationGet(name, inputs) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.operation(name, 'GET', inputs, '');
        });
    }
    /**
     * Performs an API operation using a POST request and returns the response JSON parsed as an object
     * @param name - name of the operation e.g. PutPage
     * @param inputs - a map of input key-value pairs to be slash-separated in the request URL
     * @param bodyData - a map of input key-value pairs to be passed as form data in the request body
     */
    operationPost(name, inputs, bodyData) {
        return __awaiter(this, void 0, void 0, function* () {
            let formData = new FormData();
            for (let [key, value] of bodyData) {
                formData.append(key, value.toString());
            }
            return yield this.operation(name, 'POST', inputs, formData.toString());
        });
    }
    operation(name, method, inputs, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let response;
            let inputsString = `&admin_key=${this.adminKey}`;
            for (let [key, value] of inputs) {
                inputsString += "&" + key + "=" + value.toString();
            }
            let requestString = "https://" + this.baseRequestURL + name + inputsString;
            if (body === '') {
                response = yield fetch(corsProxyURL + requestString, {
                    method: method,
                    mode: 'cors',
                    headers: new Headers({
                        'X-Requested-With': 'XMLHttpRequest'
                    })
                });
            }
            else {
                response = yield fetch(corsProxyURL + requestString, {
                    method: method,
                    mode: 'cors',
                    body: body
                });
            }
            let text = yield response.text();
            console.log(text);
            let jsonString = text.substring(11, text.length - 3);
            return JSON.parse(jsonString);
        });
    }
    /**
     * Requests from PBWorks and returns the HTML content for the specified page
     * @param oid - the object ID of the page
     * @param raw - whether to return the raw HTML content rather than preprocessed (I don't know what this means)
     */
    getPageContent(oid, raw = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (oid === null) {
                throw new Error("'oid' must be provided");
            }
            let json = yield this.operationGet("GetPage", new Map(Object.entries({
                oid: oid,
                raw: raw,
                verbose: true
            })));
            return json;
        });
    }
    /**
     * Updates the specified page on PBWorks with the specified HTML content
     * @param page - the name of the page
     * @param author the uid of author
     * @param html - the HTML content to save under the page
     * @param createIfMissing - if true, then a page will be created if it doesn't already exist
     */
    putPageContent(page, author, html, createIfMissing = true) {
        return __awaiter(this, void 0, void 0, function* () {
            let json = yield this.operationGet("PutPage", new Map(Object.entries({
                page: page,
                create_if_missing: createIfMissing,
                uid: author,
                html: encodeURIComponent(html)
            })));
            return json['success'];
        });
    }
    /**
     * Returns a list of all pages on the current wiki
     */
    getAllPages() {
        return __awaiter(this, void 0, void 0, function* () {
            let json = yield this.operationGet("GetCurrentPages", new Map());
            let pages = json['pages'];
            let pageInfoArray = [];
            for (let pageName of Object.keys(pages)) {
                pageInfoArray.push({
                    name: pageName,
                    oid: pages[pageName]
                });
            }
            return pageInfoArray;
        });
    }
    /**
     *
     * @param email user's email
     */
    getUserInfo(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.operationGet("GetUserInfo", new Map(Object.entries({
                email: email
            })));
        });
    }
}
