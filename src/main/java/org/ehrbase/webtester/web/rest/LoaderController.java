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
package org.ehrbase.webtester.web.rest;

import org.ehrbase.webtester.service.loader.LoaderRequestDto;
import org.ehrbase.webtester.service.loader.LoaderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Stefan Spiska
 */
@RestController
@RequestMapping(path = "/rest/loader")
public class LoaderController {

    private final LoaderService loaderService;

    public LoaderController(LoaderService loaderService) {
        this.loaderService = loaderService;
    }

    @PostMapping("load")
    public ResponseEntity<Void> load(@RequestBody LoaderRequestDto properties) {

        loaderService.load(properties);

        return ResponseEntity.ok().build();
    }

    @PostMapping("resume")
    public ResponseEntity<Void> load() {

        loaderService.load(null);

        return ResponseEntity.ok().build();
    }
}
