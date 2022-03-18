var zipkin = require("appmetrics-zipkin")({
  host: "jaeger-collector.default.svc.cluster.local",
  port: 9411,
  serviceName: "nodeserver",
});
var perm = require("appmetrics-prometheus").attach();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

// health checker
const health = require("@cloudnative/health-connect");
let healthcheck = new health.HealthChecker();

// liveness check
let pingcheck = new health.PingCheck("example.com");
healthcheck.registerLivenessCheck();
// readiness check with ping check
healthcheck.registerReadinessCheck(pingcheck);

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// liveness & readiness checker middleware
app.use("/live", health.LivenessEndpoint(healthcheck));
app.use("/ready", health.ReadinessEndpoint(healthcheck));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
