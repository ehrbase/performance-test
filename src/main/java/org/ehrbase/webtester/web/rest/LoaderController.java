package org.ehrbase.webtester.web.rest;

import org.ehrbase.webtester.service.LoaderService;
import org.ehrbase.webtester.service.LoaderProperties;
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
 public ResponseEntity<Void> load(@RequestBody LoaderProperties properties){

    loaderService.load(properties);

    return ResponseEntity.ok().build();
  }




}
