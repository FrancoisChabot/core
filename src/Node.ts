/**
 * Copyright 2021 Francois Chabot
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { CleanupOperation } from './Cleanup';

export class IPNode {
    _probed_pnodetype?: number;
    _cleanup?: CleanupOperation[];
    data?: unknown;
}

IPNode.prototype._probed_pnodetype = 1;

export interface PNode<PayloadT> extends IPNode {
    data: PayloadT;
}

export const dispose = (node: IPNode): void => {
    if (node._cleanup) {
        node._cleanup.forEach((c) => c());
        delete node._cleanup;
    }
};

export const onDispose = (node: IPNode, lst: CleanupOperation): void => {
    if (!node._cleanup) {
        node._cleanup = [];
    }

    node._cleanup!.push(lst);
};

export type AsPNode<T> = T extends PNode<infer U> ? PNode<U> : PNode<T>;
export type Unwrap<T> = T extends PNode<infer U> ? U : T;

export const isPNode = (what: unknown): what is IPNode => {
    return what !== null && typeof what === 'object' && !!(what as IPNode)._probed_pnodetype;
};
