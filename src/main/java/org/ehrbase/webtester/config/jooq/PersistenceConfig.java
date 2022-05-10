package org.ehrbase.webtester.config.jooq;

import javax.sql.DataSource;
import org.jooq.ExecuteContext;

import org.jooq.SQLDialect;
import org.jooq.impl.DataSourceConnectionProvider;
import org.jooq.impl.DefaultConfiguration;
import org.jooq.impl.DefaultDSLContext;
import org.jooq.impl.DefaultExecuteListener;
import org.jooq.impl.DefaultExecuteListenerProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
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

  static class ExceptionTranslator extends DefaultExecuteListener {
    @Override
    public void exception(ExecuteContext context) {
      SQLDialect dialect = context.configuration().dialect();
      SQLExceptionTranslator translator
          = new SQLErrorCodeSQLExceptionTranslator(dialect.name());
      context.exception(translator
          .translate("Access database using Jooq", context.sql(), context.sqlException()));
    }
  }



  @Autowired
  private DataSource dataSource;
  public TransactionAwareDataSourceProxy transactionAwareDataSource() {
    return new TransactionAwareDataSourceProxy(dataSource);
  }

  @Bean
  public DataSourceTransactionManager transactionManager() {
    return new DataSourceTransactionManager(dataSource);
  }

  @Bean
  public DataSourceConnectionProvider connectionProvider() {
    return new DataSourceConnectionProvider(transactionAwareDataSource());
  }

  @Bean
  public ExceptionTranslator exceptionTransformer() {
    return new ExceptionTranslator();
  }

  @Bean
  @Primary
  public DefaultDSLContext dsl() {
    return new DefaultDSLContext(configuration());
  }

  @Bean
  public DefaultConfiguration configuration() {
    DefaultConfiguration jooqConfiguration = new DefaultConfiguration();
    jooqConfiguration.set(connectionProvider());
    jooqConfiguration.set(new DefaultExecuteListenerProvider(exceptionTransformer()));
//        jooqConfiguration.set(new PerformanceListener());
    SQLDialect dialect = SQLDialect.POSTGRES;
    jooqConfiguration.set(dialect);
    return jooqConfiguration;
  }
}