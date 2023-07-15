module.exports = {
    files: ["test/**/*.js", "!test/lib/*.js", "!test/change/op/error/*.js"],
    cache: false,
    concurrency: 4,
    failFast: true,
    failWithoutAssertions: false,
    tap: true,
    verbose: true,
    require: ["@babel/register", "./test/_register.js"],
};
