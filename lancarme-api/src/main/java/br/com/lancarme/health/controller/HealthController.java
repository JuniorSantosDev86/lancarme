package br.com.lancarme.health.controller;

import br.com.lancarme.health.dto.HealthResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/health")
public class HealthController {

    private final String appVersion;

    public HealthController(@Value("${lancarme.app.version}") String appVersion) {
        this.appVersion = appVersion;
    }

    @GetMapping
    public HealthResponse getHealth() {
        return new HealthResponse("UP", "lancarme-api", appVersion);
    }
}
