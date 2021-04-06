<?php
namespace Lib;

class Telemetry {
    private ?\ApplicationInsights\Telemetry_Client $telemetryClient;

    function __construct($conf, ?int $userId) {
        if(!$conf) {
            $this->telemetryClient = null;
            return;
        }

        $this->telemetryClient = new \ApplicationInsights\Telemetry_Client();
        $context = $this->telemetryClient->getContext();
        $context->setInstrumentationKey($conf['instrumentationKey']);
        $context->getSessionContext()->setId(session_id());
        $context->getUserContext()->setId($userId);
        $context->getLocationContext()->setIp($conf['location']);

        if(isset($_SERVER['HTTP_TRACEPARENT'])) {
            $traceParent = parseTraceParent($_SERVER['HTTP_TRACEPARENT']);
            if($traceParent) {
                $context->getOperationContext()->setId($traceParent['trace-id']);
                $context->getOperationContext()->setParentId($traceParent['parent-id']);
            }
        }

        $startTime = hrtime(true);
        $tc = $this->telemetryClient;

        register_shutdown_function(function() use ($tc, $startTime) {
            $now = hrtime(true);
            $code = http_response_code();
            $success = $code >= 200 && $code < 300;
    
            session_write_close();
            ignore_user_abort(true);
            fastcgi_finish_request();

            $tc->trackRequest("api", $_SERVER['REQUEST_METHOD'] . ' ' . $_SERVER['REQUEST_URI'], $now, 0, $code, $success, [], [
                "duration" => (time() - $startTime) / 1e+6
            ]);
            $tc->flush();
        });

        set_exception_handler(function($e) use ($tc) {
            http_response_code(500);
            $tc->trackException($e);

            error_log($e);
        });
    }
    
    function trackEvent($text, $properties, $measurements) {
        if(!$this->telemetryClient) {
            return;
        }

        $this->telemetryClient->trackEvent($text, $properties, $measurements);
    }

    function trackException($error, $properties, $measurements) {
        if(!$this->telemetryClient) {
            return;
        }

        $this->telemetryClient->trackException($error, $properties, $measurements);
    }

    function trackDependency($action, $type, $content, $time, $resultCode, $success) {
        if(!$this->telemetryClient) {
            return;
        }

        $this->telemetryClient->trackDependency($action, $type, $content, $time, $resultCode, $success);
    }
}

function parseTraceParent($headerValue) {
    if(!$headerValue) {
        return null;
    }

    $parts = explode('-', $headerValue);
    if(count($parts) !== 4 || $parts[0] !== '00') {
        return null;
    }

    return [
        "version" => $parts[0],
        "trace-id" => $parts[1],
        "parent-id" => $parts[2],
        "trace-flags" => $parts[3]
    ];
}