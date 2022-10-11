import {
    AddOperation,
    CopyOperation,
    MoveOperation,
    Operation,
    RemoveOperation,
    ReplaceOperation, TestOperation
} from "fast-json-patch";

// Adapted from https://github.com/cujojs/jiff

const inverses = {
    test: invertTest,
    add: invertAdd,
    replace: invertReplace,
    remove: invertRemove,
    move: invertMove,
    copy: invertCopy
};

export function inverseOperation(p: Operation[]) {
    let pr: Operation[] = [];
    let c: any, i: number, inverse, skip = 0;
    for(i = p.length - 1; i>= 0; i -= skip) {
        c = p[i] as any;
        inverse = inverses[c.op as keyof typeof inverses];
        if(typeof inverse === 'function') {
            skip = inverse(pr, c, i, p);
        }
    }
    return pr;
}

function invertTest(pr: Operation[], c: TestOperation<any>) {
    pr.push(c);
    return 1;
}

function invertAdd(pr: Operation[], c: AddOperation<any>) {
    pr.push({
        op: 'test',
        path: c.path,
        value: c.value
    });

    pr.push({
        op: 'remove',
        path: c.path
    });

    return 1;
}

function invertReplace(pr: Operation[], c: ReplaceOperation<any>, i: number, p: Operation[]) {
    let prev = p[i-1];
    if(prev === void 0 || prev.op !== 'test' || prev.path !== c.path) {
        throw new Error('cannot invert replace w/o test');
    }

    pr.push({
        op: 'test',
        path: prev.path,
        value: c.value
    });

    pr.push({
        op: 'replace',
        path: prev.path,
        value: prev.value
    });

    return 2;
}

function invertRemove(pr: Operation[], c: RemoveOperation, i: number, p: Operation[]) {
    let prev = p[i-1];
    if (prev === void 0 || prev.op !== 'test' || prev.path !== c.path) {
        throw new Error('cannot invert remove w/o test');
    }

    pr.push({
        op: 'add',
        path: prev.path,
        value: prev.value
    });

    return 2;
}

function invertMove(pr: Operation[], c: MoveOperation) {
    pr.push({
        op: 'move',
        path: c.from,
        from: c.path
    });

    return 1;
}

function invertCopy(pr: Operation[], c: CopyOperation) {
    // See https://github.com/cujojs/jiff/issues/9
    // This needs more thought. We may have to extend/amend JSON Patch.
    // At first glance, this seems like it should just be a remove.
    // However, that's not correct.  It violates the involution:
    // invert(invert(p)) ~= p.  For example:
    // invert(copy) -> remove
    // invert(remove) -> add (DOH! this should be copy!)
    throw new Error('cannot invert copy');
    return 0;
}