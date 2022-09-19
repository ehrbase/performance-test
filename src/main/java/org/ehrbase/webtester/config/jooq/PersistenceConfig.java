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
import org.jooq.impl.DataSourceConnectionProvider;
import org.jooq.impl.DefaultConfiguration;
import org.jooq.impl.DefaultDSLContext;
import org.jooq.impl.DefaultExecuteListener;
import org.jooq.impl.DefaultExecuteListenerProvider;
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

    private SQLDialect sqlDialect;
    private boolean keepIndexes;

    public PersistenceConfig(@Value("${spring.jooq.sql-dialect}") String sqlDialect,@Value("${loader.keep-indexes}") boolean keepIndexes){
        this.keepIndexes = keepIndexes;
        this.sqlDialect = SQLDialect.valueOf(sqlDialect);
    }


    static class ExceptionTranslator extends DefaultExecuteListener {
        @Override
        public void exception(ExecuteContext context) {
            SQLDialect dialect = context.configuration().dialect();
            SQLExceptionTranslator translator = new SQLErrorCodeSQLExceptionTranslator(dialect.name());
            context.exception(
                    translator.translate("Access database using Jooq", context.sql(), context.sqlException()));
        }
    }

    protected static <T> T createDataSource(DataSourceProperties properties, Class<? extends DataSource> type) {
        return (T) properties.initializeDataSourceBuilder().type(type).build();
    }

    @Primary
    @Bean
    @ConfigurationProperties(prefix = "spring.datasource.hikari")
    HikariDataSource primaryDataSource(DataSourceProperties properties) {
        HikariDataSource dataSource = (HikariDataSource) createDataSource(properties, HikariDataSource.class);
        dataSource.setPoolName("primary-pool");
        dataSource.setTransactionIsolation("TRANSACTION_READ_COMMITTED");

        if(keepIndexes && SQLDialect.YUGABYTEDB.equals(sqlDialect)){
            dataSource.setConnectionInitSql("SET yb_enable_upsert_mode=true;");
        }else if(SQLDialect.YUGABYTEDB.equals(sqlDialect)){
            dataSource.setConnectionInitSql("SET yb_disable_transactional_writes=true;SET yb_enable_upsert_mode=true;");
        }

        return dataSource;
    }

    @Bean("secondaryDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.hikarisecond")
    HikariDataSource secondaryDataSource(DataSourceProperties properties) {
        HikariDataSource dataSource = (HikariDataSource) createDataSource(properties, HikariDataSource.class);
        dataSource.setPoolName("secondary-pool");
        dataSource.setTransactionIsolation("TRANSACTION_READ_COMMITTED");

        return dataSource;
    }

    public TransactionAwareDataSourceProxy transactionAwareDataSource(DataSource dataSource) {
        return new TransactionAwareDataSourceProxy(dataSource);
    }

    @Bean
    public DataSourceTransactionManager transactionManager(DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }

    @Bean
    public DataSourceConnectionProvider connectionProvider(DataSource dataSource) {
        return new DataSourceConnectionProvider(transactionAwareDataSource(dataSource));
    }

    @Bean
    public ExceptionTranslator exceptionTransformer() {
        return new ExceptionTranslator();
    }

    @Bean
    @Primary
    public DefaultDSLContext dsl(DefaultConfiguration cfg) {
        return new DefaultDSLContext(cfg);
    }

    @Bean
    public DefaultConfiguration configuration(DataSourceConnectionProvider dataSource) {
        DefaultConfiguration jooqConfiguration = new DefaultConfiguration();
        jooqConfiguration.set(dataSource);
        jooqConfiguration.set(new DefaultExecuteListenerProvider(exceptionTransformer()));
        SQLDialect dialect = sqlDialect;
        jooqConfiguration.set(dialect);
        return jooqConfiguration;
    }
}
