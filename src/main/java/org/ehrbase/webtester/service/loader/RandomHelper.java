/*
 * Copyright (c) 2022 vitasystems GmbH and Hannover Medical School.
 *
 * This file is part of project EHRbase
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.ehrbase.webtester.service.loader;

import java.security.SecureRandom;
import java.util.Random;

/**
 * utility class to get random numbers. uses thread local to allow parallelization
 */
public final class RandomHelper {

    public static ThreadLocal<Random> RND = ThreadLocal.withInitial(SecureRandom::new);

    private RandomHelper() {}

    /**
     * get a random natural number according to a gaussian distribution using the mean and standard deviation provided. the nummber is capped by the provided min and max bound.
     * @param mean
     * @param standardDeviation
     * @param lowerBound
     * @param upperBound
     * @return
     */
    public static long getRandomGaussianWithLimitsLong(
            int mean, int standardDeviation, int lowerBound, int upperBound) {
        return Math.min(
                upperBound,
                Math.max(
                        lowerBound,
                        Math.round(Math.ceil(Math.abs(RND.get().nextGaussian() * standardDeviation + mean)))));
    }

    /**
     * get a random rational number > 0 according to a gaussian distribution using the mean and standard deviation provided. the nummber is capped by the provided min and max bound.
     * @param mean
     * @param standardDeviation
     * @param lowerBound
     * @param upperBound
     * @return
     */
    public static double getRandomGaussianWithLimitsDouble(
            int mean, int standardDeviation, int lowerBound, int upperBound) {
        return Math.min(
                upperBound, Math.max(lowerBound, Math.abs(RND.get().nextGaussian() * standardDeviation + mean)));
    }
}
