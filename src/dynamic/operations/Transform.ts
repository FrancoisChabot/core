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

import { dynamic } from '../Dynamic';
import { Reader, isDynamic } from '../Reader';
import { DynamicValue } from '../Value';

/** Creates a value, *potentially* dynamic, as a transformation of its arguments.
 * If the passed value is dynamic, the callback will be invoked whenever it changes.
 */
export const transform = <T, U>(v: Reader<T>, cb: (v: T) => U): U | DynamicValue<U> => {
    // TODO: transform needs to be able to handle a LIST of readers, not just a single one.
    if (isDynamic(v)) {
        const result = dynamic(cb(v.value));

        v.addListener((newVal) => (result.value = cb(newVal)));

        return result;
    } else {
        return cb(v);
    }
};
