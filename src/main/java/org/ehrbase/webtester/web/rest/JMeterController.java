/*
 * Copyright 2022 vitasystems GmbH and Hannover Medical School.
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

import org.ehrbase.webtester.exception.WebTesterException;
import org.ehrbase.webtester.service.JMeterService;
import org.ehrbase.webtester.web.HttpHeadersUtils;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.io.InputStream;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * REST API for JMeter.
 *
 * @author Renaud Subiger
 * @since 1.0
 */
@RestController
@RequestMapping(path = "/rest/jmeter")
public class JMeterController {

    private final JMeterService jmeterService;

    public JMeterController(JMeterService jmeterService) {
        this.jmeterService = jmeterService;
    }

    // JMeter

    @GetMapping
    public ResponseEntity<Map<String, Object>> status() {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("active", jmeterService.isActive());
        return ResponseEntity.ok(body);
    }

    @PostMapping(path = "/stop")
    public ResponseEntity<Map<String, Object>> stop(@RequestParam(required = false) boolean immediate) {
        jmeterService.stopTest(immediate);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Test Plan

    @GetMapping(path = "/test-plans")
    public ResponseEntity<List<String>> listTestPlans() {
        return ResponseEntity.ok(jmeterService.listTestPlans());
    }

    @PostMapping(path = "/test-plans")
    public ResponseEntity<Void> uploadTestPlan(@RequestPart MultipartFile file) {
        String testPlanId;

        try (InputStream in = file.getInputStream()) {
            testPlanId = jmeterService.saveTestPlan(in, file.getOriginalFilename());
        } catch (IOException e) {
            throw new WebTesterException("An error occurred while reading the uploaded file", e);
        }

        var headers = new HttpHeaders();
        headers.setLocation(ServletUriComponentsBuilder.fromCurrentRequest()
                .pathSegment("{testPlanId}")
                .build(testPlanId));
        return new ResponseEntity<>(headers, HttpStatus.CREATED);
    }

    @GetMapping(path = "/test-plans/{testPlanId}")
    public ResponseEntity<InputStreamResource> downloadTestPlan(@PathVariable String testPlanId) {
        InputStream stream = jmeterService.getTestPlan(testPlanId);

        var filename = jmeterService.getTestPlanFilename(testPlanId);
        var headers = HttpHeadersUtils.generateFileHeaders(filename, MediaType.APPLICATION_XML);
        return ResponseEntity.ok()
                .headers(headers)
                .body(new InputStreamResource(stream));
    }

    @PostMapping(path = "/test-plans/{testPlanId}/start")
    public ResponseEntity<String> startTest(@PathVariable String testPlanId,
                                            @RequestBody(required = false) Map<String, Object> parameters) {
        String executionId = jmeterService.startTest(testPlanId, parameters);

        var headers = new HttpHeaders();
        headers.setLocation(ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/rest/jmeter/test-executions/{executionId}")
                .build(executionId));
        return new ResponseEntity<>(executionId, headers, HttpStatus.ACCEPTED);
    }

    // Test Execution

    @GetMapping(value = "/test-executions/{testExecutionId}/logfile")
    public ResponseEntity<InputStreamResource> downloadLogFile(@PathVariable String testExecutionId) {
        InputStream stream = jmeterService.getLogFile(testExecutionId);

        var headers = HttpHeadersUtils.generateFileHeaders(JMeterService.LOG_FILE, MediaType.TEXT_PLAIN);
        return ResponseEntity.ok()
                .headers(headers)
                .body(new InputStreamResource(stream));
    }

    @PostMapping(value = "/test-executions/{testExecutionId}/generate-report")
    public ResponseEntity<Void> generateReport(@PathVariable String testExecutionId) {
        jmeterService.generateReport(testExecutionId);
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

    @GetMapping(value = "/test-executions/{testExecutionId}/report")
    public ResponseEntity<InputStreamResource> downloadReport(@PathVariable String testExecutionId) {
        InputStream stream = jmeterService.getReport(testExecutionId);

        var headers = HttpHeadersUtils.generateFileHeaders(JMeterService.REPORT_FILE, MediaType.APPLICATION_OCTET_STREAM);

        return ResponseEntity.ok()
                .headers(headers)
                .body(new InputStreamResource(stream));
    }
}
