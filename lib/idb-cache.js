import {uuidv4} from "./utils.js";
import {openDB, deleteDB, wrap, unwrap} from "../node_modules/idb/with-async-ittr.js";

//
export class IDBCache {
    constructor(name) {

    }

    async open(name, opt) {
        this.db = await openDB(name, 4, opt);
        return this;
    }

    add(storeName, table) {
        this.db.add(storeName, table);
    }

    transaction(storeName, mode = "readwrite") {
        const tx = this.db.transaction([storeName], mode);
        return Promise.all([tx, tx.objectStore(storeName)]);
    }
}