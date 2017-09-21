export class CustKey {
    private sum: number = Math.floor(Math.random() * 1000) + 1;

    get sumValue() {
        return this.sum;
    }
}