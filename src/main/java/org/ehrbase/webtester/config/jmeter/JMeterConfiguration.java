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

package org.ehrbase.webtester.config.jmeter;

import org.apache.jmeter.NewDriver;
import org.apache.jmeter.engine.JMeterEngine;
import org.apache.jmeter.engine.StandardJMeterEngine;
import org.apache.jmeter.util.JMeterUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.nio.file.Path;
import java.util.Locale;

/**
 * {@link Configuration} for Apache JMeter.
 *
 * @author Renaud Subiger
 * @since 1.0
 */
@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(JMeterProperties.class)
public class JMeterConfiguration {

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @PostConstruct
    public void initialize() {
        log.info("Initializing Apache JMeter {}", JMeterUtils.getJMeterVersion());
        JMeterUtils.loadJMeterProperties(Path.of(NewDriver.getJMeterDir(), "bin/jmeter.properties").toString());
        JMeterUtils.setLocale(Locale.ENGLISH);
        JMeterUtils.setJMeterHome(NewDriver.getJMeterDir());
    }

    @Bean(destroyMethod = "exit")
    public JMeterEngine jmeterEngine() {
        return new StandardJMeterEngine();
    }
}
