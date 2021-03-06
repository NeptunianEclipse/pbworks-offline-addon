const basePBWorksURL = "pbworks.com";
const corsProxyURL = "https://cors-anywhere.herokuapp.com/";
// const adminKey = "5VXfJkL9eybJ3xuycKYU";
// const adminKey = getAdminKey();
// const workspaceName = "159356group7";


interface IDict<V> {
    [key: string]: V;
}

interface PageInfo {
    name: string;
    oid: number;
}

class PBWorks {

    readonly workspaceName: string;
    readonly baseRequestURL: string;
    readonly adminKey: string;

    constructor(workspaceName: string, adminKey: string) {
        this.workspaceName = workspaceName;
        this.baseRequestURL = `${workspaceName}.${basePBWorksURL}/api_v2/?op=`;
        this.adminKey = adminKey;
    }

    async operation(name: string, inputs: IDict<any>): Promise<object> {
        let inputsString = `&admin_key=${this.adminKey}`;
        if (inputs !== null) {
            for (let key of Object.keys(inputs)) {
                inputsString += "&" + key;
                inputsString += "=" + inputs[key];
            }
        }
        console.log("requestString :");
        let requestString = "http://" + this.baseRequestURL + name + inputsString;
        console.log(requestString);
        let response = await fetch(corsProxyURL + requestString, {mode: 'cors'});
        let text = await response.text();
        let jsonString = text.substring(11, text.length - 3);
        let json = JSON.parse(jsonString);
        return json;
    }

    async operationPost(name: string, inputs: IDict<any>): Promise<object> {
        let requestString = "https://" + this.baseRequestURL;

        inputs['op'] = name;

        let response = await fetch(corsProxyURL + requestString, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(inputs)
        });
        let text = await response.text();

        let jsonString = text.substring(11, text.length - 3);
        let json = JSON.parse(jsonString);

        return json;
    }

    // @ts-ignore
    async getPage(
        inputs: {
            page?: string;
            oid?: number;
            raw?: boolean;
            verbose?: boolean;
        }
    ): Promise<object> {
        let json = await this.operation("GetPage", inputs);
        return json;
    }

    async putPage(
        inputs: {
            page: string,
            html: string
        }
    ): Promise<boolean> {
        let json = await this.operation("PutPage", inputs);
        return json['success'];
    }

    async getAllPages(): Promise<object> {
        let pageInfoArray: PageInfo[] = [];
        let json = await this.operation("GetCurrentPages", null);
        let pages = json['pages'];

        for (let pageName of Object.keys(pages)) {
            pageInfoArray.push({
                name: pageName,
                oid: pages[pageName]
            });
        }
        return pageInfoArray;
    }

    async createPage(
        inputs:{
            page: string
        }
    ): Promise<object>{

        return null;
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