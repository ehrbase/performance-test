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

/**
 * @author Stefan Spiska
 */
public interface LoaderService {
    void load(LoaderRequestDto properties1);

    ExecutionState isRunning();

    class ExecutionState {
        private boolean done;
        private LoaderPhase phase;
        private boolean success;

        public ExecutionState(boolean done, LoaderPhase phase, boolean success) {
            this.done = done;
            this.phase = phase;
            this.success = success;
        }

        public boolean isDone() {
            return done;
        }

        public void setDone(boolean done) {
            this.done = done;
        }

        public LoaderPhase getPhase() {
            return phase;
        }

        public void setPhase(LoaderPhase phase) {
            this.phase = phase;
        }

        public boolean isSuccess() {
            return success;
        }

        public void setSuccess(boolean success) {
            this.success = success;
        }
    }
}
