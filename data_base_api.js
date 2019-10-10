
/**
 * @Description:
 *
 * This is a database api for PBwork addon.
 * It has contained init_database function, open_storage function, insert function
 * and some get functions.
 * Note: It will have some upload function
 *
 * @author Song Liu, Chengming Liu
 * @date 2019/9/20
 *
 * Here are some example code for tutorial:
 * insert data:
 *
 let p = new Promise(function (resolve, reject) {
            resolve();
        });
 p.then(prepare_storage)
 .then(get_admin_key)
 .then(download_page)
 .then(function (pageInfo) {
                insert(pageInfo)
                    .then(sendResponse({response: true}));
 *
 *
 * get data
 *
 get_data_author("PBworks").then(function (event) {
    console.log(event.target.result);
});
 *
 */

let DB_NAME = 'pbwork_extension';
let OBJ_SPACE_NAME = 'page_list';
let VERSION_STORE_NAME = 'version_control';
let DB_VERSION = 1.0;
let my_db;
let INDEX_STORAGE_NAME = 'index_name';
let INDEX_STORAGE_AUTHOR = 'index_author';
let INDEX_OID = 'index_oid';


/**
 * initialize database
 * if successful, it will call resolve function, pass a database instance
 * to resolve function. Otherwise, it will call reject function
 *
 * for example
 * init_database().then(resolve).catch(reject)
 *
 * @returns {Promise<unknown>}
 */
function init_database() {
    return new Promise((resolve, reject) => {
        window.indexedDB = window.indexedDB || window.mozIndexedDB;
        if (window.indexedDB) {
            const request = window.indexedDB.open(DB_NAME, DB_VERSION);
            request.onsuccess = (event) => {
                console.log('database open successfully！');
                my_db = event.target.result;
                resolve(my_db);
            };
            request.onerror = function (event) {
                reject("fail,error code：" + event.target.errorCode);
            };
            request.onupgradeneeded = function (event) {
                my_db = event.target.result;//获得数据库实例对象
                if (!my_db.objectStoreNames.contains(OBJ_SPACE_NAME)) {
                    let object_store = my_db.createObjectStore(OBJ_SPACE_NAME, {keyPath: "oid"});
                    let version_store = my_db.createObjectStore(VERSION_STORE_NAME, {autoIncrement: true});
                    object_store.createIndex(INDEX_STORAGE_NAME, 'name', {unique: false});
                    object_store.createIndex(INDEX_STORAGE_AUTHOR, 'author.name', {unique: false});
                    version_store.createIndex(INDEX_OID, 'oid', {unique: false});
                    //version_store.createIndex(INDEX_VERSION, 'version', {unique: false});
                }
            }

        } else {
            reject("not support");
        }
    });
}

/**
 * This is designed as a resolve function for init_database()
 * to open or create a storage in database
 *
 * @param db_instance
 * @returns {Promise<unknown>}
 */
function open_storage(db_instance) {
    return new Promise((resolve, reject) => {
        let transaction = db_instance.transaction([OBJ_SPACE_NAME], 'readwrite');
        let object_store = transaction.objectStore(OBJ_SPACE_NAME);
        console.log("open_storage");
        resolve(object_store);
    });
}

function open_version_store(db_instance) {
    return new Promise((resolve, reject) => {
        let transaction = db_instance.transaction([VERSION_STORE_NAME], 'readwrite');
        let object_store = transaction.objectStore(VERSION_STORE_NAME);
        console.log("open_storage");
        resolve(object_store);
    });
}

/**
 *  This is designed as a resolve function for open_storage()
 *  to insert a data to storage
 *  and user should write a function as resolve function
 *  which will be called after insert finish successfully.
 *  and resolve function receive a event object.
 *
 * now insert function can upgrade data
 * if data exists, insert function will upgrade data
 * if data doesn't exist, insert function will insert data.
 * @param data
 * @returns {Promise<unknown>}
 */
function insert(data) {
    return new Promise((resolve, reject) => {
        init_database()
            .then(open_storage)
            .then(object_storage => {
                data.edittime = new Date().toLocaleTimeString();
                let oid = data.oid;
                let request = object_storage.get(oid);
                request.onsuccess = function () {
                    let upload_request = object_storage.put(data);
                    upload_request.onsuccess = resolve;
                    upload_request.onerror = resolve;
                };
                request.onerror = function () {
                    let insert_request = object_storage.add(data);
                    insert_request.onsuccess = resolve;
                    insert_request.onerror = reject;
                }
            });
    })
}

function getOid(oid) {
    return new Promise((resolve, reject) => {
        init_database()
            .then(open_version_store)
            .then(object_storage => {
                let keyRange = IDBKeyRange.only(oid);
                let getAllKeysRequest = object_storage.index(INDEX_OID).getAll(keyRange);
                getAllKeysRequest.onsuccess = resolve;
                getAllKeysRequest.onerror = reject;
            })
    })
}


function insert_version(data) {
    return new Promise((resolve, reject) => {
        init_database()
            .then(open_version_store)
            .then(object_storage => {
                data.edittime = new Date().toLocaleTimeString();
                object_storage.add(data);
                resolve();
            });
    })
}

/**
 * get data from database according to oid
 * once finish, a array which contain data will be passed to resolve function
 * in this case, array will only contain one data object,
 * because oid is primary key
 *
 * if success, resolve function will receive event object
 * and data is located in event.target.result
 *
 * @param oid
 * @returns {Promise<unknown>}
 */
function get_data_oid(oid) {
    return new Promise((resolve, reject) => {
        init_database()
            .then(open_storage)
            .then(object_storage => {
                let request = object_storage.get(oid);
                request.onsuccess = resolve;
                request.onerror = reject;
            });
    })
}


/**
 * get data from database according to name
 * once finish, a array which contain data will be passed to resolve function
 *
 * @param name
 * @returns {Promise<unknown>}
 */


function get_data_name(name) {
    return new Promise((resolve, reject) => {
        init_database()
            .then(open_storage)
            .then(object_storage => {
                let keyRange = IDBKeyRange.lowerBound("");
                console.log("begin get all " + name);
                let getAllKeysRequest = object_storage.index(INDEX_STORAGE_NAME).getAll(keyRange);
                getAllKeysRequest.onsuccess = resolve;
                getAllKeysRequest.onerror = reject;
            })
    })
}

function get_data_name1(name) {
    return new Promise((resolve, reject) => {
        init_database()
            .then(open_storage)
            .then(object_storage => {
                let keyRange = IDBKeyRange.only(name);
                console.log("begin get all " + name);
                let getAllKeysRequest = object_storage.index(INDEX_STORAGE_NAME).getAll(keyRange);
                getAllKeysRequest.onsuccess = resolve;
                getAllKeysRequest.onerror = reject;
            })
    })
}

/**
 * get data from database according to author
 * once finish, a array which contain data will be passed to resolve function
 * @param author
 * @returns {Promise<unknown>}
 */
function get_data_author(author) {
    return new Promise((resolve, reject) => {
        init_database()
            .then(open_storage)
            .then(object_storage => {
                let keyRange = IDBKeyRange.only(author);
                console.log("begin get all " + author);
                let getAllKeysRequest = object_storage.index(INDEX_STORAGE_AUTHOR).getAll(keyRange);
                getAllKeysRequest.onsuccess = resolve;
                getAllKeysRequest.onerror = reject;
            })
    })
}

/**
 * remove data according oid
 * once finish, a array which contain data will be passed to resolve function
 * @param oid
 * @returns {Promise<unknown>}
 */

function remove_data(oid) {
    return new Promise((resolve, reject) => {
        init_database()
            .then(open_storage)
            .then((storage) => {
                let request = storage.delete(oid);
                request.onsuccess = resolve;
                request.onerror = reject;
            })
    });
}


/**
 * upgrade data
 * @param {PBwork page object} data 
 * @returns {Promise<unknown>}
 * 
 * resolve function will receive a object called event
 *  event.target.result is oid number of the object
 */
function upgrade_data(data){
    return new Promise((resolve, reject) => {
        init_database()
        .then(open_storage)
        .then(storage => {
            let request = storage.put(data);
            console.log("begin upgrading data");
            request.onsuccess = resolve;
            request.onerror = reject;
        });
    });
}

// get_data_author("PBworks").then(function (event) {
//     console.log(event.target.result);
// });