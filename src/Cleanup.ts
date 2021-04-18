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

export type CleanupOperation = () => void;
export interface CleanupContext {
    _addCleanupOp: (op: CleanupOperation) => void;
}

let _currentCleanupContext: CleanupContext | null = null;
const _cleanupContextStack: (CleanupContext | null)[] = [];

export const pushCleanupContext = (ctx: CleanupContext): void => {
    _cleanupContextStack.push(_currentCleanupContext);
    _currentCleanupContext = ctx;
};

export const popCleanupContext = (): void => {
    if (process.env.NODE_ENV !== 'production' && _cleanupContextStack.length === 0) {
        throw new Error('cleanup context underflow');
    }
    _currentCleanupContext = _cleanupContextStack.pop()!;
};

export const addCleanupOp = (op: CleanupOperation): void => {
    if (process.env.NODE_ENV !== 'production' && !_currentCleanupContext) {
        throw new Error('cleanup context underflow');
    }

    _currentCleanupContext!._addCleanupOp(op);
};
