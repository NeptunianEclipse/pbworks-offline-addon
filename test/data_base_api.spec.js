const assert = chai.assert;


describe('database api test', function () {
    describe("open indexDB test", () => {
        it('should return indexDB object', function (done) {
            init_database()
                .then((db) => {
                    assert.isTrue(db instanceof IDBDatabase, "database type error: " + db);
                    done()
                })
                .catch(e => {
                    done(e);
                });
        });
    });

    describe("open an object storage in indexDB test", () => {
        it('should return storage object', function (done) {
            init_database()
                .then(open_storage)
                .then((storage) => {
                    assert.isTrue(storage instanceof IDBObjectStore, "storage type error:" + storage);
                    done()
                })
                .catch(e => {
                    done(e);
                });
        });
    });


    describe("insert data,  get data and remove data test", () => {
        it('test insert function, insert a data', function (done) {
            let test_obj1 = { oid: 101, html: "<h1>test</h1>" };

            insert(test_obj1)
                .then(e => {
                    assert.equal(test_obj1.oid, e.target.result, "oid can not consist with return oid!")
                    done();
                })
                .catch(e => {
                    done(e);
                });
        });


        it("get data test", function (done) {
            get_data_oid(101)
                .then(e => {
                    assert.equal(e[0].oid, 101, "oid can not consist with return oid!");
                    done();
                })
                .catch(e => {
                    done(e);
                })
        })
        
        it("remove data test", function (done) {
            remove_data(101)
                .then(e => {
                    console.log(e);
                    assert.equal(e.target.readyState, "done", "oid can not consist with return oid!");
                    done();
                })
                .catch(e => {
                    done(e);
                });
        });
    });



});