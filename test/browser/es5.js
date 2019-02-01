requirejs.config({});

function createTr(data) {
    var r = document.createElement("tr");
    for (var i = 0; i < data.length; i++) {
        var e = document.createElement("td");
        e.textContent = data[i] || "";
        r.appendChild(e);
    }
    return r;
}
function buildstr(s) {
    if (!s || typeof s !== "object") {
        return s;
    }
    var r = [];
    for (var i in s) {
        var p = buildstr(s[i]);
        if (p && p !== true) {
            r.push(p);
        }
    }
    return r.join("\n");
}

requirejs(['../../build/schematron-browser'], function (schematron) {
    /** @type {HTMLButtonElement} */
    var btn = document.getElementById("btn");
    /** @type {HTMLDivElement} */
    var status = document.getElementById("status");
    /** @type {HTMLInputElement} */
    var sch = document.getElementById("sch");
    /** @type {HTMLInputElement} */
    var xml = document.getElementById("xml");
    /** @type {HTMLTableSectionElement} */
    var results = document.getElementById("results");

    /** @type {import("../../esm/browser").validate} */
    var validate = schematron.validate;

    btn.onclick = function () {
        btn.disabled = true;
        status.textContent = "Running validation...";
        while (results.hasChildNodes()) {
            results.removeChild(results.lastChild);
        }

        /** @type {import("../../esm/browser").IValidateOptions} */
        const options = {
            resourceDir: window.location.href
        };

        validate(xml.value, sch.value, options).then(function (r) {
            r.errors.forEach(function (e) {
                var d = ["🔴", e.assertionId, e.description];
                results.appendChild(createTr(d)).className = "err";
            });
            r.ignored.forEach(function (e) {
                var d = ["⚠", e.assertionId, buildstr(e.errorMessage)];
                results.appendChild(createTr(d)).className = "ign";
            });
            r.warnings.forEach(function (e) {
                var d = ["🔸", e.assertionId, e.description];
                results.appendChild(createTr(d)).className = "warn";
            });
            r.passed.forEach(function (e) {
                var d = ["✓", e.assertionId, e.description];
                results.appendChild(createTr(d)).className = "pass";
            });

            status.textContent = JSON.stringify({
                errors: r.errors.length,
                ignored: r.ignored.length,
                warnings: r.warnings.length,
                passed: r.passed.length
            });
        }).catch(function (e) {
            console.error(e);
            status.textContent = e.toString();
        }).then(function () {
            btn.disabled = false;
        });
    };

    status.textContent = "";
    btn.disabled = false;
    btn.click();
});