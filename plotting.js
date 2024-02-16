document.addEventListener("DOMContentLoaded", function() {
    function calculateTDistributionMGF(degreesOfFreedom, t) {
        return Math.pow(1 - 2 * t / degreesOfFreedom, -degreesOfFreedom / 2);
    }

    function calculatePoissonMGF(mean, t) {
        return Math.exp(mean * (Math.exp(t) - 1));
    }

    function calculateNormalMGF(mean, standardDeviation, t) {
        return Math.exp(mean * t + (Math.pow(standardDeviation, 2) * Math.pow(t, 2)) / 2);
    }

function calculateMomentForX(distributionType, mean, standardDeviation, degreesOfFreedom, xValue, momentOrder) {
    var moment = 0;
    var t = 0; 

    if (distributionType === 'normal') {
        moment = calculateNormalMGF(mean, standardDeviation, t);
    } else if (distributionType === 't') {
        moment = calculateTDistributionMGF(degreesOfFreedom, t);
    } else if (distributionType === 'poisson') {
        moment = calculatePoissonMGF(mean, t);
    }

    moment *= Math.pow(xValue, momentOrder);

    return moment;
}


function plotDistributionAndMGF() {
    var mean = parseFloat(document.getElementById('mean').value);
    var standardDeviation = parseFloat(document.getElementById('standardDeviation').value);
    var degreesOfFreedom = parseFloat(document.getElementById('sampleSize').value);
    var distributionType = document.getElementById('distributionType').value;
    var xValue = parseFloat(document.getElementById('xValue').value);

    if (isNaN(mean) || isNaN(xValue)) {
        alert("Please enter valid numerical values for mean and x.");
        return;
    }

    var canvasMGF = document.getElementById('mgfPlot');
    var ctxMGF = canvasMGF.getContext('2d');
    ctxMGF.clearRect(0, 0, canvasMGF.width, canvasMGF.height);

    var canvasDistribution = document.getElementById('distributionPlot');
    var ctxDistribution = canvasDistribution.getContext('2d');
    ctxDistribution.clearRect(0, 0, canvasDistribution.width, canvasDistribution.height);

    var MGF_values = [];
    var t_values = [];
    var dx = 0.1;
    var MGF, t;
    var distributionLabel;

    for (var i = -50; i <= 50; i++) {
        t = i / 10;
        t_values.push(t);

        if (distributionType === 't') {
            MGF = calculateTDistributionMGF(degreesOfFreedom, t);
            distributionLabel = 't-Distribution';
        } else if (distributionType === 'poisson') {
            MGF = calculatePoissonMGF(mean, t);
            distributionLabel = 'Poisson Distribution';
        } else if (distributionType === 'normal') {
            MGF = calculateNormalMGF(mean, standardDeviation, t);
            distributionLabel = 'Normal Distribution';
        }

        MGF_values.push(MGF);
    }

    var maxMGF = Math.max(...MGF_values);

    ctxMGF.beginPath();
    ctxMGF.strokeStyle = 'blue';

    for (var j = 0; j < t_values.length; j++) {
        var x = (t_values[j] + 5) * 20;
        var y = canvasMGF.height - (MGF_values[j] / maxMGF) * canvasMGF.height;
        if (j === 0) {
            ctxMGF.moveTo(x, y);
        } else {
            ctxMGF.lineTo(x, y);
        }
    }
    ctxMGF.stroke();

    ctxMGF.beginPath();
    ctxMGF.strokeStyle = 'black';
    ctxMGF.moveTo(0, canvasMGF.height);
    ctxMGF.lineTo(canvasMGF.width, canvasMGF.height);
    ctxMGF.moveTo(0, canvasMGF.height);
    ctxMGF.lineTo(0, 0);
    ctxMGF.stroke();

    ctxMGF.font = '12px Arial';
    ctxMGF.fillStyle = 'black';
    ctxMGF.fillText('t', canvasMGF.width / 2, canvasMGF.height - 5);
    ctxMGF.fillText('MGF', 5, 10);
    ctxMGF.fillText(distributionLabel + ' (MGF)', canvasMGF.width / 2, 20);

    var x, y, dx = 0.1;
    ctxDistribution.beginPath();
    ctxDistribution.strokeStyle = 'red';
    ctxDistribution.lineWidth = 2;

    if (distributionType === 'poisson') {
        var lambda = mean;
        for (x = 0; x <= 20; x++) {
            y = (Math.pow(lambda, x) * Math.exp(-lambda)) / factorial(x);
            ctxDistribution.lineTo(x * 20, canvasDistribution.height - y * 50);
        }
    } else {
        var variance = Math.pow(standardDeviation, 2);
        for (x = -10; x <= 10; x += dx) {
            if (distributionType === 'normal') {
                var z = (x - mean) / Math.sqrt(variance);
                y = (1 / Math.sqrt(2 * Math.PI * variance)) * Math.exp(-0.5 * Math.pow(z, 2));
            } else if (distributionType === 't') {
                y = (1 / (Math.sqrt(degreesOfFreedom) * beta(0.5, degreesOfFreedom / 2))) * Math.pow(1 + (x * x) / degreesOfFreedom, -(degreesOfFreedom + 1) / 2);
            }
            ctxDistribution.lineTo((x + 10) * 20, canvasDistribution.height - y * 50);
        }
    }
    ctxDistribution.stroke();

    ctxDistribution.beginPath();
    ctxDistribution.strokeStyle = 'black';
    ctxDistribution.moveTo(0, canvasDistribution.height);
    ctxDistribution.lineTo(canvasDistribution.width, canvasDistribution.height);
    ctxDistribution.moveTo(0, canvasDistribution.height);
    ctxDistribution.lineTo(0, 0);
    ctxDistribution.stroke();

    ctxDistribution.font = '12px Arial';
    ctxDistribution.fillStyle = 'black';
    ctxDistribution.fillText('x', canvasDistribution.width / 2, canvasDistribution.height - 5);
    ctxDistribution.fillText('Probability Density', 5, 10);
    ctxDistribution.fillText('Distribution Curve', canvasDistribution.width / 2, 20);

    var xValue = parseFloat(document.getElementById('xValue').value);
    for (var momentOrder = 1; momentOrder <= 4; momentOrder++) {
        var momentResult = calculateMomentForX(distributionType, mean, standardDeviation, degreesOfFreedom, xValue, momentOrder);
        document.getElementById('momentResult' + momentOrder).innerText = 'Moment of order ' + momentOrder + ' for x = ' + xValue + ': ' + momentResult;
    }

    if (distributionType === 't') {

        var pdf_values = [];
        var t_values_pdf = [];
        var dx_pdf = 0.1;
        var pdf;

        for (var i = -10; i <= 10; i += dx_pdf) {
            var t_pdf = i / 10;
            t_values_pdf.push(t_pdf);
            pdf = calculateTPDF(degreesOfFreedom, t_pdf);
            pdf_values.push(pdf);
        }

        var maxPDF = Math.max(...pdf_values);

        ctxDistribution.beginPath();
        ctxDistribution.strokeStyle = 'green';

        for (var j = 0; j < t_values_pdf.length; j++) {
            var x_pdf = (t_values_pdf[j] + 10) * 20;
            var y_pdf = canvasDistribution.height - (pdf_values[j] / maxPDF) * canvasDistribution.height;
            if (j === 0) {
                ctxDistribution.moveTo(x_pdf, y_pdf);
            } else {
                ctxDistribution.lineTo(x_pdf, y_pdf);
            }
        }
        ctxDistribution.stroke();
    }
}

    function factorial(n) {
        if (n === 0 || n === 1)
            return 1;
        for (var i = n - 1; i >= 1; i--) {
            n *= i;
        }
        return n;
    }

    function handleDistributionTypeChange() {
        var distributionType = document.getElementById('distributionType').value;
        var standardDeviationBox = document.getElementById('standardDeviationBox');
        var sampleSizeBox = document.getElementById('sampleSizeBox');

        if (distributionType === 'normal') {
            standardDeviationBox.style.display = 'block';
            sampleSizeBox.style.display = 'none'; 
        } else if (distributionType === 't') {
            standardDeviationBox.style.display = 'block';
            sampleSizeBox.style.display = 'block';
        } else if (distributionType === 'poisson') {
            standardDeviationBox.style.display = 'none';
            sampleSizeBox.style.display = 'none';
        }
    }


    document.getElementById('plotButton').addEventListener('click', plotDistributionAndMGF);

    document.getElementById('distributionType').addEventListener('change', handleDistributionTypeChange);

    document.getElementById('standardDeviationBox').style.display = 'none';
    document.getElementById('sampleSizeBox').style.display = 'none';
});
