var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var basePBWorksURL = "pbworks.com";
var corsProxyURL = "https://cors-anywhere.herokuapp.com/";
var adminKey = "5VXfJkL9eybJ3xuycKYU";
var workspaceName = "159356group7";
var PBWorks = /** @class */ (function () {
    function PBWorks(workspaceName, adminKey) {
        this.workspaceName = workspaceName;
        this.baseRequestURL = workspaceName + "." + basePBWorksURL + "/api_v2/op/";
        this.adminKey = adminKey;
    }
    PBWorks.prototype.operation = function (name, inputs) {
        return __awaiter(this, void 0, void 0, function () {
            var inputsString, _i, _a, key, requestString, response, text, jsonString, json;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        inputsString = "/admin_key/" + this.adminKey;
                        for (_i = 0, _a = Object.keys(inputs); _i < _a.length; _i++) {
                            key = _a[_i];
                            inputsString += "/" + key;
                            inputsString += "/" + inputs[key];
                        }
                        requestString = "https://" + this.baseRequestURL + name + inputsString;
                        return [4 /*yield*/, fetch(corsProxyURL + requestString, { mode: 'cors' })];
                    case 1:
                        response = _b.sent();
                        return [4 /*yield*/, response.text()];
                    case 2:
                        text = _b.sent();
                        jsonString = text.substring(11, text.length - 3);
                        json = JSON.parse(jsonString);
                        return [2 /*return*/, json];
                }
            });
        });
    };
    PBWorks.prototype.operationPost = function (name, inputs) {
        return __awaiter(this, void 0, void 0, function () {
            var requestString, response, text, jsonString, json;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestString = "https://" + this.baseRequestURL;
                        inputs['op'] = name;
                        return [4 /*yield*/, fetch(corsProxyURL + requestString, {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(inputs)
                            })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.text()];
                    case 2:
                        text = _a.sent();
                        jsonString = text.substring(11, text.length - 3);
                        json = JSON.parse(jsonString);
                        return [2 /*return*/, json];
                }
            });
        });
    };
    PBWorks.prototype.getPage = function (inputs) {
        return __awaiter(this, void 0, void 0, function () {
            var json;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.operation("GetPage", inputs)];
                    case 1:
                        json = _a.sent();
                        return [2 /*return*/, {
                                name: json['name'],
                                html: json['html'],
                                oid: json['oid']
                            }];
                }
            });
        });
    };
    PBWorks.prototype.putPage = function (inputs) {
        return __awaiter(this, void 0, void 0, function () {
            var json;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.operation("PutPage", inputs)];
                    case 1:
                        json = _a.sent();
                        return [2 /*return*/, json['success']];
                }
            });
        });
    };
    return PBWorks;
}());
var pbworks = new PBWorks(workspaceName, adminKey);
pbworks.getPage({
    oid: 134815806
}).then(function (pageInfo) {
    console.log(pageInfo);
});
pbworks.putPage({
    page: "This is a new page",
    html: encodeURIComponent("<H1>This is a page</H1>")
}).then(function (success) {
    console.log(success);
});
