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

import org.ehrbase.webtester.exception.WebTesterException;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

/**
 * @author Stefan Spiska
 */
@Service
@ConditionalOnProperty(prefix = "loader", name = "enabled", havingValue = "false")
public class LoaderServiceDummyImp implements LoaderService {
    @Override
    public void load(LoaderRequestDto properties1) {
        throw new WebTesterException("Loader not enabled");
    }

    @Override
    public ExecutionState isRunning() {
        throw new WebTesterException("Loader not enabled");
    }
}
