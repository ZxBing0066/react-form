class Store {
    constructor(key) {
        this.key = key;
        this.map = {};
    }
    destory() {
        this.map = {};
    }
}

export default Store;
