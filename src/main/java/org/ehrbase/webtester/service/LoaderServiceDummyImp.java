package org.ehrbase.webtester.service;

import org.ehrbase.webtester.exception.WebTesterException;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

/**
 * @author Stefan Spiska
 */
@Service
@ConditionalOnProperty(prefix = "loader", name = "enabled", havingValue = "false")
public class LoaderServiceDummyImp implements LoaderService{
  @Override
  public void load(LoaderProperties properties1) {

    throw new WebTesterException("Loader not enabled");
  }
}
