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
package org.ehrbase.webtester.web;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

/**
 * @author Renaud Subiger
 * @since 1.0
 */
public class HttpHeadersUtils {

    private HttpHeadersUtils() {}

    public static HttpHeaders generateFileHeaders(String filename, MediaType contentType) {
        var headers = new HttpHeaders();
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        headers.setContentDispositionFormData("attachment", filename);
        headers.setContentType(contentType);
        return headers;
    }
}
