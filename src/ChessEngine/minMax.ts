export class MinMaxNode<T> {
    private min: boolean;
    private _children: MinMaxNode<T>[];
    private depth: number;
    private value: T;

    private _score: number | undefined;

    constructor(min: boolean, depth: number, value: T, score?: number) {
        this.min = min;
        this._children = [];
        this.depth = depth;
        this._score = score;
        this.value = value;
    }

    resolve(): { score: number; resultArray: T[]; numberOfPositions: number } {
        // console.log(this.value, this.depth);
        let resultArray: T[] = [];
        let numberOfChildren = this._children.length;
        let result = this.min
            ? Number.MAX_SAFE_INTEGER
            : Number.MIN_SAFE_INTEGER;
        let numberOfPositions = 1;

        if (this._children.length > 0) {
            for (let i = 0; i < numberOfChildren; i++) {
                const childValue = this._children[i].resolve();
                numberOfPositions += childValue.numberOfPositions;
                if (this.min) {
                    if (childValue.score < result) {
                        result = childValue.score;
                        resultArray = childValue.resultArray;
                    }
                } else {
                    if (childValue.score > result) {
                        result = childValue.score;
                        resultArray = childValue.resultArray;
                    }
                }
            }
            return {
                score: result,
                resultArray: [this.value, ...resultArray],
                numberOfPositions: numberOfPositions,
            };
        } else if (this._score != null)
            return {
                score: this._score,
                resultArray: [this.value],
                numberOfPositions: 1,
            };
        else {
            console.log(this);
            throw Error("zesral sie min max");
        }
    }

    set children(children: MinMaxNode<T>[]) {
        this._children = children;
    }

    set score(score: number) {
        this._score = score;
    }
}
