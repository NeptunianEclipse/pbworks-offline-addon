(function () {

  const DB_NAME = 'save-local-files';
  const DB_VERSION = 1;
  const DB_STORE_NAME = 'stores';

  var db;

  function initDb() {
    console.debug("initDb ...");
    var req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onsuccess = function (evt) {
      db = this.result;
      console.debug("initDb DONE");
    };
    req.onerror = function (evt) {
      console.error("initDb:", evt.target.errorCode);
    };

    req.onupgradeneeded = function (evt) {
      console.debug("initDb.onupgradeneeded");
      var store = evt.currentTarget.result.createObjectStore(
        DB_STORE_NAME, { keyPath: 'id', autoIncrement: true });

      store.createIndex('oid', 'oid', { unique: true });
      store.createIndex('title', 'title', { unique: false });
    };
  }

  function getFile(key, success_callback) {
    var tx = db.transaction(DB_STORE_NAME, 'readonly');
    var store = tx.objectStore(DB_STORE_NAME);
    var req = store.get(key);
    req.onsuccess = function(evt) {
      var value = evt.target.result;
      if (value)
        success_callback(value.file);
    };
  }

  function display() {
    console.debug("display");
    var pub_msg = $('#pub-msg');
    pub_msg.empty();
    var pub_list = $('#pub-list');
    pub_list.empty();

    var tx = db.transaction(DB_STORE_NAME, 'readonly');
    var store = tx.objectStore(DB_STORE_NAME);
    var req;

    req = store.count();
    // Requests are executed in the order in which they were made against the
    // transaction, and their results are returned in the same order.
    // Thus the count text below will be displayed before the actual pub list
    // (not that it is algorithmically important in this case).
    req.onsuccess = function(evt) {
      pub_msg.append('<p>There are <strong>' + evt.target.result +
                     '</strong> record(s) in the object store.</p>');
    };
    req.onerror = function(evt) {
      console.error("add error", this.error);
      displayActionFailure(this.error);
    };

    var i = 0;
    var article_id;
    var file_presence;
    var presence_html;
    req = store.openCursor();
    req.onsuccess = function(evt) {
      var cursor = evt.target.result;
      if (cursor) {
        presence_html = "<span class='presence-no'>No file</span>";
        file_presence = cursor.value.file != null;
        console.debug("cursor.value:", cursor.value);
        if (file_presence) {
          article_id = 'pub-article-' + i;
          presence_html = '<article id="' + article_id + '"/>';
          getFile(cursor.key, function(file) {
            console.debug("file:", file);

            // Note that here it is not possible to set a link to the file to
            // make  it possible to download it.
            // The only possible options are:
            // * display the file if it is an image
            // * getting text/other info from the file and display them
            var obj_url = window.URL.createObjectURL(file);
            $('#' + article_id).attr('src', obj_url);
            window.URL.revokeObjectURL(obj_url);
          });
        }
        pub_list.append('<li>' +
                        '[' + cursor.key + '] ' +
                        '(id: ' + cursor.value.oid + ') ' +
                        cursor.value.title +  ' / ' +
                        presence_html +
                        '</li>');

        // Move on to the next object in store
        cursor.continue();

        // This counter serves only to create distinct ids
        i++;
      } else {
        console.debug("No more entries!");
      }
    };
  };

  function addStore(oid, title, file) {
    console.debug("addStore arguments:", arguments);
    if (!db) {
      console.error("addStore: the db is not initialized");
      return;
    }
    var tx = db.transaction(DB_STORE_NAME, 'readwrite');
    var store = tx.objectStore(DB_STORE_NAME);
    var req = store.add({ oid: oid, title: title,
                          file: file });
    req.onsuccess = function (evt) {
      console.debug("Insertion in DB successful");
      display();
    };
    req.onerror = function() {
      console.error("add error", this.error);
      displayActionFailure(this.error);
    };
  }

  function displayActionSuccess(msg) {
    msg = typeof msg !== 'undefined' ? "Success: " + msg : "Success";
    $('#action-status').html('<span class="action-success">' + msg + '</span>');
  }
  function displayActionFailure(msg) {
    msg = typeof msg !== 'undefined' ? "Failure: " + msg : "Failure";
    $('#action-status').html('<span class="action-failure">' + msg + '</span>');
  }
  function resetActionStatus() {
    console.debug("resetActionStatus ...");
    $('#action-status').empty();
    console.debug("resetActionStatus DONE");
  }

  function addEventListeners() {
    console.debug("addEventListeners");
    initDb();
    $('#register-form-reset').click(function(evt) {
      resetActionStatus();
    });

    $('#add-button').click(function(evt) {
      console.debug("add ...");
      var title = $('#pub-title').val();
      var oid = $('#pub-oid').val();
      if (!title || !oid) {
        displayActionFailure("Required field(s) missing");
        return;
      }

      var file_input = $('#pub-file');
      var selected_file = file_input.get(0).files[0];
      console.debug("selected_file:", selected_file);
      file_input.val(null);
      var content_url = $('#pub-content-url').val();
      if (selected_file) {
        addStore(oid, title, selected_file);
      } else {
        addStore(oid, title);
        displayActionSuccess();
      }

    });

    $('#delete-button').click(function(evt) {
      console.debug("delete ...");
      var k = $('#pub-oid-to-delete').val();
      console.debug("delete k:", k);
      var tx = db.transaction(DB_STORE_NAME, 'readwrite');
      var store = tx.objectStore(DB_STORE_NAME);

      // Warning: The exact same key used for creation needs to be passed for
      // the deletion. If the key was a Number for creation, then it needs to be
      // a Number for deletion.
      k = Number(k);

      var req = store.get(k);
      req.onsuccess = function(evt) {
        var record = evt.target.result;
        console.debug("record:", record);
        if (typeof record !== 'undefined') {
          req = store.delete(k);
          req.onsuccess = function(evt) {
            console.debug("evt:", evt);
            console.debug("evt.target:", evt.target);
            console.debug("evt.target.result:", evt.target.result);
            console.debug("delete successful");
            displayActionSuccess("Deletion successful");
            display();
          };
          req.onerror = function (evt) {
            console.error("delete:", evt.target.errorCode);
          };
        } else {
          displayActionFailure("No matching record found");
        }
      };
      req.onerror = function (evt) {
        console.error("delete:", evt.target.errorCode);
      };

    });

    var search_button = $('#search-list-button');
    search_button.click(function(evt) {
      display();
    });

  }

  addEventListeners();
})(); // Immediately-Invoked Function Expression (IIFE)