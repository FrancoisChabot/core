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

import { CleanupOperation, popCleanupContext, pushCleanupContext } from '../src/Cleanup';

import { dynamic, isDynamic } from '../src';

let cleanupQueue: CleanupOperation[] = [];
const cleanup = () => {
    cleanupQueue.forEach((v) => v());
    cleanupQueue = [];
};

beforeEach(() => {
    pushCleanupContext({
        _addCleanupOp: (op: CleanupOperation) => cleanupQueue.push(op),
    });
});

afterEach(() => {
    cleanup();
    popCleanupContext();
});

describe('Static Value', () => {
    it('is not seen as dynamic', () => {
        expect(isDynamic(12)).toBeFalsy();
        expect(isDynamic(true)).toBeFalsy();
        expect(isDynamic(undefined)).toBeFalsy();
        expect(isDynamic(null)).toBeFalsy();
        expect(isDynamic('hullo')).toBeFalsy();
        expect(isDynamic({ a: 12 })).toBeFalsy();
    });

    cleanup();
});

describe('Dynamic Value', () => {
    it('Initialized correctly', () => {
        const x = dynamic(12);
        expect(x.value).toBe(12);
    });

    it('is seen as dynamic', () => {
        const x = dynamic(12);
        expect(isDynamic(x)).toBeTruthy();
    });

    it('Reassigns new values', () => {
        const x = dynamic(12);
        expect(x.value).toBe(12);

        x.value = 23;
        expect(x.value).toBe(23);
    });

    it('Notifies of changes', () => {
        const x = dynamic(12);

        let y = 0;
        x.addListener(() => {
            y += 1;
        });

        x.value = 23;
        expect(y).toBe(1);
        expect(x.value).toBe(23);

        // Setting to same value should not trigger notification.
        x.value = 23;
        expect(y).toBe(1);
        expect(x.value).toBe(23);

        x.value += 1;
        expect(y).toBe(2);
        expect(x.value).toBe(24);

        x.value += 2;
        expect(y).toBe(3);
        expect(x.value).toBe(26);
    });

    it('Cleans up correctly', () => {
        const x = dynamic(12);

        let a = 0;
        let b = 0;
        let c = 0;
        x.addListener(() => {
            a += 1;
        });

        x.addListener(() => {
            b += 1;
        });

        x.addListener(() => {
            c += 1;
        });

        x.value = 13;
        expect(a).toBe(1);
        expect(b).toBe(1);
        expect(c).toBe(1);

        x.value = 14;
        expect(a).toBe(2);
        expect(b).toBe(2);
        expect(c).toBe(2);

        cleanup();
        x.value = 15;
        expect(a).toBe(2);
        expect(b).toBe(2);
        expect(c).toBe(2);
    });
});
