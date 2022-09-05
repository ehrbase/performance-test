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
package org.ehrbase.webtester.config.jooq;

import com.zaxxer.hikari.HikariDataSource;
import javax.sql.DataSource;
import org.jooq.ExecuteContext;
import org.jooq.SQLDialect;
import org.jooq.impl.*;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.jdbc.datasource.TransactionAwareDataSourceProxy;
import org.springframework.jdbc.support.SQLErrorCodeSQLExceptionTranslator;
import org.springframework.jdbc.support.SQLExceptionTranslator;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableTransactionManagement
@ConditionalOnProperty(prefix = "loader", name = "enabled", havingValue = "true")
public class PersistenceConfig {

    @Value("${spring.jooq.sql-dialect}")
    private String sqlDialect;

    static class ExceptionTranslator extends DefaultExecuteListener {
        @Override
        public void exception(ExecuteContext context) {
            SQLDialect dialect = context.configuration().dialect();
            SQLExceptionTranslator translator = new SQLErrorCodeSQLExceptionTranslator(dialect.name());
            context.exception(
                    translator.translate("Access database using Jooq", context.sql(), context.sqlException()));
        }
    }

    public TransactionAwareDataSourceProxy transactionAwareDataSource(DataSource dataSource) {
        return new TransactionAwareDataSourceProxy(dataSource);
    }

    protected static <T> T createDataSource(DataSourceProperties properties, Class<? extends DataSource> type) {
        return (T) properties.initializeDataSourceBuilder().type(type).build();
    }

    @Bean
    public ExceptionTranslator exceptionTransformer() {
        return new ExceptionTranslator();
    }

    // ------------------- Primary DataSource and DSL (Non-transactional-writes)-------------------

    @Bean("nonTransactionalWritesDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.hikari")
    HikariDataSource nonTransactionalWritesDataSource(DataSourceProperties properties) {
        HikariDataSource dataSource = (HikariDataSource) createDataSource(properties, HikariDataSource.class);
        dataSource.setPoolName("nonTransactionalWrites-pool");
        dataSource.setTransactionIsolation("TRANSACTION_READ_COMMITTED");

        return dataSource;
    }

    @Bean
    @Primary
    public DataSourceTransactionManager nonTransactionalWritesTransactionManager(
            @Qualifier("nonTransactionalWritesDataSource") DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }

    @Bean
    @Primary
    public DataSourceConnectionProvider nonTransactionalWritesConnectionProvider(
            @Qualifier("nonTransactionalWritesDataSource") DataSource dataSource) {
        return new DataSourceConnectionProvider(transactionAwareDataSource(dataSource));
    }

    @Bean
    @Primary
    public DefaultConfiguration nonTransactionalWritesConfiguration(
            @Qualifier("nonTransactionalWritesConnectionProvider") DataSourceConnectionProvider dataSource) {
        DefaultConfiguration jooqConfiguration = new DefaultConfiguration();
        jooqConfiguration.set(dataSource);
        jooqConfiguration.set(new DefaultExecuteListenerProvider(exceptionTransformer()));
        //        jooqConfiguration.set(new PerformanceListener());
        SQLDialect dialect = SQLDialect.valueOf(sqlDialect);
        jooqConfiguration.set(dialect);
        return jooqConfiguration;
    }

    @Bean
    @Primary
    public DefaultDSLContext nonTransactionalWritesDsl(
            @Qualifier("nonTransactionalWritesConfiguration") DefaultConfiguration cfg) {
        return new DefaultDSLContext(cfg);
    }

    // ------------------- Secondary DataSource and DSL (transactional-writes)-------------------

    @Bean("transactionalWritesDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.hikarisecond")
    HikariDataSource transactionalWritesDataSource(DataSourceProperties properties) {
        HikariDataSource dataSource = (HikariDataSource) createDataSource(properties, HikariDataSource.class);
        dataSource.setPoolName("transactionalWrites-pool");
        dataSource.setTransactionIsolation("TRANSACTION_READ_COMMITTED");

        return dataSource;
    }

    @Bean
    public DataSourceTransactionManager transactionalWritesTransactionManager(
            @Qualifier("transactionalWritesDataSource") DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }

    @Bean
    public DataSourceConnectionProvider transactionalWritesConnectionProvider(
            @Qualifier("transactionalWritesDataSource") DataSource dataSource) {
        return new DataSourceConnectionProvider(transactionAwareDataSource(dataSource));
    }

    @Bean
    public DefaultDSLContext transactionalWritesDsl(
            @Qualifier("transactionalWritesConfiguration") DefaultConfiguration cfg) {
        return new DefaultDSLContext(cfg);
    }

    @Bean
    public DefaultConfiguration transactionalWritesConfiguration(
            @Qualifier("transactionalWritesConnectionProvider") DataSourceConnectionProvider dataSource) {
        DefaultConfiguration jooqConfiguration = new DefaultConfiguration();
        jooqConfiguration.set(dataSource);
        jooqConfiguration.set(new DefaultExecuteListenerProvider(exceptionTransformer()));
        //        jooqConfiguration.set(new PerformanceListener());
        SQLDialect dialect = SQLDialect.valueOf(sqlDialect);
        jooqConfiguration.set(dialect);
        return jooqConfiguration;
    }
}
