var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const basePBWorksURL = "pbworks.com";
const corsProxyURL = "https://cors-anywhere.herokuapp.com/";
// interface PageInfo {
//     name: string;
//     oid: number;
//     html: string;
// }
class PBWorks {
    constructor(workspaceName, adminKey) {
        this.workspaceName = workspaceName;
        this.baseRequestURL = `${workspaceName}.${basePBWorksURL}/api_v2/op/`;
        this.adminKey = adminKey;
    }
    operation(name, inputs) {
        return __awaiter(this, void 0, void 0, function* () {
            let inputsString = `/admin_key/${this.adminKey}`;
            for (let key of Object.keys(inputs)) {
                inputsString += "/" + key;
                inputsString += "/" + inputs[key];
            }
            let requestString = "https://" + this.baseRequestURL + name + inputsString;
            let response = yield fetch(corsProxyURL + requestString, { mode: 'cors' });
            let text = yield response.text();
            let jsonString = text.substring(11, text.length - 3);
            let json = JSON.parse(jsonString);
            return json;
        });
    }
    operationPost(name, inputs) {
        return __awaiter(this, void 0, void 0, function* () {
            let requestString = "https://" + this.baseRequestURL;
            inputs['op'] = name;
            let response = yield fetch(corsProxyURL + requestString, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(inputs)
            });
            let text = yield response.text();
            let jsonString = text.substring(11, text.length - 3);
            let json = JSON.parse(jsonString);
            return json;
        });
    }
    // @ts-ignore
    getPage(inputs) {
        return __awaiter(this, void 0, void 0, function* () {
            let json = yield this.operation("GetPage", inputs);
            return json;
        });
    }
    putPage(inputs) {
        return __awaiter(this, void 0, void 0, function* () {
            let json = yield this.operation("PutPage", inputs);
            return json['success'];
        });
    }
}
// let pbworks = new PBWorks(workspaceName, adminKey);
//
// pbworks.getPage({
//     oid: 134815806
// }).then((pageInfo) => {
//     console.log(pageInfo);
// });
//
// pbworks.putPage({
//     page: "This is a new page",
//     html: encodeURIComponent("<H1>This is a page</H1>")
// }).then((success) => {
//     console.log(success);
// });
