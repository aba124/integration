// plotting.js

document.addEventListener("DOMContentLoaded", function() {
    // Function to calculate z or t statistic
    function calculateStat(mean, variance, distribution, xValue) {
        if (distribution === 'normal') {
            return (xValue - mean) / Math.sqrt(variance);
        } else if (distribution === 't') {
            return (xValue - mean) / Math.sqrt(variance);
        }
    }

    // Function to display result
    function displayResult(statistic) {
        var resultDiv = document.getElementById('result');
        resultDiv.innerHTML = '';

        var p = document.createElement('p');
        p.textContent = 'The z or t statistic is: ' + statistic.toFixed(4);
        resultDiv.appendChild(p);
    }

    // Function to plot distribution curve
    function plotDistribution(mean, variance, distribution) {
        var canvas = document.getElementById('distributionPlot');
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var x, y, dx = 0.1;
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;

        for (x = -10; x <= 10; x += dx) {
            var z = (x - mean) / Math.sqrt(variance);
            y = (1 / Math.sqrt(2 * Math.PI * variance)) * Math.exp(-0.5 * Math.pow(z, 2));
            y *= 200; // Scale factor for better visualization
            if (x === -10) {
                ctx.moveTo(canvas.width / 2 + x * 20, canvas.height - y);
            } else {
                ctx.lineTo(canvas.width / 2 + x * 20, canvas.height - y);
            }
        }
        ctx.stroke();

        // Draw ticks
        drawTicks(canvas);
    }

    // Function to calculate MGF
    function calculateMGF(mean, variance, t) {
        return Math.exp(mean * t + 0.5 * variance * Math.pow(t, 2));
    }

    // Function to plot MGF
    function plotMGF(mean, variance) {
        var canvas = document.getElementById('mgfPlot');
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var t, MGF;
        ctx.beginPath();
        ctx.strokeStyle = 'blue';

        for (var i = -500; i <= 500; i++) {
            t = i / 100;
            MGF = calculateMGF(mean, variance, t);
            var x = i + canvas.width / 2;
            var y = -MGF * 50 + canvas.height / 2;
            if (i === -500) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();

        // Draw ticks
        drawTicks(canvas);
    }

    // Function to draw ticks on axes
    function drawTicks(canvas) {
        var ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.strokeStyle = 'black';

        // X-axis ticks
        for (var i = -10; i <= 10; i++) {
            ctx.moveTo(canvas.width / 2 + i * 20, canvas.height - 5);
            ctx.lineTo(canvas.width / 2 + i * 20, canvas.height + 5);
        }

        // Y-axis ticks for MGF plot
        if (canvas.id === 'mgfPlot') {
            for (var j = -10; j <= 10; j++) {
                ctx.moveTo(5, canvas.height / 2 + j * 20);
                ctx.lineTo(canvas.width - 5, canvas.height / 2 + j * 20);
            }
        }

        ctx.stroke();
    }

    // Function to handle calculation
    function handleCalculation() {
        var mean = parseFloat(document.getElementById('mean').value);
        var variance = parseFloat(document.getElementById('variance').value);
        var distribution = document.getElementById('distribution').value;
        var xValue = parseFloat(document.getElementById('xValue').value);

        if (isNaN(mean) || isNaN(variance) || isNaN(xValue)) {
            alert("Please enter valid numerical values for mean, variance, and x.");
            return;
        }

        var statistic = calculateStat(mean, variance, distribution, xValue);
        displayResult(statistic);
        plotDistribution(mean, variance, distribution);
        plotMGF(mean, variance);
    }

    // Add event listener to the Calculate button
    document.getElementById('calculateButton').addEventListener('click', handleCalculation);
});
