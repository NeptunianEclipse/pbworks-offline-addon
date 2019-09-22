const assert = require('chai').assert;

const api = require('../data_base_api');
const mocha = require('mocha');
const describe = mocha.describe;

describe('database api test', function() {
    describe("open indexDB test", ()=>{
        it('should return indexDB object', function () {
            api.init_database()
                .then((db)=>{
                    assert.isTrue(db instanceof IDBDatabase, "database type error: " + db);
                    done()
                })
                .catch((e) =>{
                    assert.isTrue(false, "fail,error code：" + e.target.errorCode);
                    done();
                });
        });
    });

    describe("open an object storage in indexDB test", () =>{
        it('should return storage object', function () {
            api.init_database()
                .then(api.open_storage)
                .then((storage) => {
                    assert.isTrue(storage instanceof IDBObjectStore, "storage type error:" + storage);
                    done()
                })
                .catch((e) =>{
                    assert.isTrue(false, "fail,error code：" + e.target.errorCode);
                    done();
                });
        });
    });

    describe("insert data and get data test", () => {
        let test_obj1 = {oid:101, html:"<h1>test</h1>"};
        let test_obj2 = {oid:102, html:"<h1>test</h1>"};
        let test_obj3 = {oid:103, html:"<h1>test</h1>"};

        function resolve(event){
            assert.isTrue(event.target.result, "some errors");
        }

        function reject(event){
            assert.isTrue(false, "fail,error code：" + event.target.errorCode)
        }

        it('should return a message that inert successfully', function (){


        })
    })
});