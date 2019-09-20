let DB_NAME = 'pbwork_extension';
let OBJ_SPACE_NAME = 'page_list';
let DB_VERSION = 1.0;
let my_db;
let INDEX_STORAGE_NAME = 'index_name';
let INDEX_STORAGE_AUTHOR = 'index_author';

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
                    object_store.createIndex(INDEX_STORAGE_NAME, 'name', {unique:false});
                    object_store.createIndex(INDEX_STORAGE_AUTHOR, 'author.name', {unique: false});
                }
            }

        } else {
            reject("not support");
        }
    });
}

function open_storage(db_instance) {
    return new Promise((resolve, reject) => {
        let transaction = db_instance.transaction([OBJ_SPACE_NAME], 'readwrite');
        let object_store = transaction.objectStore(OBJ_SPACE_NAME);
        console.log("open_storage");
        resolve(object_store);
    });
}

function insert(data) {
    return new Promise((resolve, reject) => {
        init_database()
            .then(open_storage)
            .then(object_storage => {
                object_storage.add(data);
                console.log("insert");
                resolve();
            });
    })
}

function get_data_oid(oid) {
    return new Promise((resolve, reject) => {
        init_database()
            .then(open_storage)
            .then(object_storage => {
                let request = object_storage.get(oid);
                request.onsuccess= e=>{
                    resolve([e.target.result]);
                }
            });
    })
}

function get_data_name(name) {
    return new Promise((resolve, reject) => {
        init_database()
            .then(open_storage)
            .then(object_storage => {
                let keyRange = IDBKeyRange.only(name);
                console.log("begin get all "+name);
                let getAllKeysRequest = object_storage.index(INDEX_STORAGE_NAME).getAll(keyRange);
                getAllKeysRequest.onsuccess=resolve;
                getAllKeysRequest.onerror=reject;
            })
    })
}

function get_data_author(author) {
    return new Promise((resolve, reject) => {
        init_database()
            .then(open_storage)
            .then(object_storage => {
                let keyRange = IDBKeyRange.only(author);
                console.log("begin get all " + author);
                let getAllKeysRequest = object_storage.index(INDEX_STORAGE_AUTHOR).getAll(keyRange);
                getAllKeysRequest.onsuccess=resolve;
                getAllKeysRequest.onerror=reject;
            })
    })
}


