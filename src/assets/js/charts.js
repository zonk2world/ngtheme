"use strict";

var Charts = function() {};

Charts.prototype.init = function () {};

/*
 * Pie charts
 */
Charts.prototype.pieChart = function(id, data) {
    var chartWrap = document.getElementById(id),
        responsiveWrap = document.createElement('div');

    responsiveWrap.classList.add('chart-responsive');
    function calculateSectors(data) {
        var sectors = [],
            l = data.size / 2,
            a = 0, // Angle
            aRad = 0, // Angle in Radian
            aCalc,
            z = 0, // Size z
            x = 0, // Side x
            y = 0, // Side y
            X = 0, // SVG X coordinate
            Y = 0, // SVG Y coordinate
            R = 0, // Rotation
            arcSweep;

        data.sectors.map( function(item, key ) {
            a = (360 * item.percentage)/100;
            aCalc = ( a > 180 ) ? 360 - a : a;
            aRad = aCalc * Math.PI / 180;
            z = Math.sqrt( 2*l*l - ( 2*l*l*Math.cos(aRad) ) );
            if( aCalc <= 90 ) {
                x = l*Math.sin(aRad);
            }
            else {
                x = l*Math.sin((180 - aCalc) * Math.PI/180 );
            }

            y = Math.sqrt( z*z - x*x );
            Y = y;

            if( a <= 180 ) {
                X = l + x;
                arcSweep = 0;
            }
            else {
                X = l - x;
                arcSweep = 1;
            }

            sectors.push({
                percentage: item.percentage,
                name: item.name,
                color: item.color,
                arcSweep: arcSweep,
                L: l,
                X: X,
                Y: Y,
                R: R
            });

            R = R + a;
        });
        return sectors;
    }

    var sectors = calculateSectors(data);

    var newSVG = document.createElementNS( "http://www.w3.org/2000/svg","svg" );

    newSVG.setAttributeNS(null, 'style', "width: "+ data.size+"px; height: " + data.size+ "px");

    if(document.body.contains(chartWrap)){
        responsiveWrap.appendChild(newSVG);
        chartWrap.appendChild(responsiveWrap);
    }

    sectors.map( function(sector) {
        var newSector = document.createElementNS( "http://www.w3.org/2000/svg","path" );
        newSector.setAttributeNS(null, 'fill', sector.color);
        newSector.setAttributeNS(null, 'd', 'M' + sector.L + ',' + sector.L + ' L' + sector.L + ',0 A' + sector.L + ',' + sector.L + ' 1 '+ sector.arcSweep +',1 ' + sector.X + ', ' + sector.Y + ' z');
        newSector.setAttributeNS(null, 'transform', 'rotate(' + sector.R + ', '+ sector.L+', '+ sector.L+')');
        var label = document.createElement('p'),
            icon =  document.createElement('i');
        icon.classList.add('fa','fa-circle', 'm-r-5');
        icon.style.color = sector.color;
        label.appendChild(icon);
        label.innerHTML += sector.name + ": " + sector.percentage + "%";

        if(document.body.contains(chartWrap) && data.labels == true){
            chartWrap.appendChild(label);
        }
        newSVG.appendChild(newSector);
    });
};


/*
 * Stacked area charts
 */
Charts.prototype.generateAreaChart = function(id, data) {
    var responsiveWrap = document.createElement('div'),
        chartWrap = document.getElementById(id),
        percentageWidth,
        marginFromLeft,
        marginFromBottom = 20,
        marginFromTop = 10,
        x,
        y,
        d,
        chartWidth =  data.width,
        chartHeight =  data.height,
        newSVG = document.createElementNS( "http://www.w3.org/2000/svg","svg" );


    responsiveWrap.classList.add('chart-responsive');
    if(document.body.contains(chartWrap)){
        var parentWidth = chartWrap.parentNode.offsetWidth,
            parentHeight = chartWrap.parentNode.offsetHeight;
    }

    //check if chart width set with percentage
    if( chartWidth.toString().indexOf('%') !==  -1 ){
        percentageWidth = true;
        chartWidth = chartWidth.substring(0, chartWidth.length - 1)*parentWidth/100;
        marginFromLeft = chartWidth*6/100;
        x = (chartWidth - 3*marginFromLeft) / (data.xAxis.categories.length - 1); // X axis step
        newSVG.setAttributeNS(null, 'style', "width: " + chartWidth + "px; height: " + chartHeight + "px");
    }
    else{
        percentageWidth = false;
        marginFromLeft = chartWidth*6/100;
        x = (chartWidth - 3*marginFromLeft) / (data.xAxis.categories.length - 1); // X axis step
        newSVG.setAttributeNS(null, 'style', "width: " + chartWidth + "px; height: " + chartHeight + "px");
    }

    //check if chart height set with percentage
    if( chartHeight.toString().indexOf('%') !==  -1 ){
        chartHeight = chartHeight.substring(0, chartHeight.length - 1)*parentHeight/100;
        y = (chartHeight - marginFromBottom - marginFromTop)/ (data.yAxis.labels.length - 1);  // Y axis step
        newSVG.setAttributeNS(null, 'style', "width: " + chartWidth + "px; height: " + chartHeight+ "px");
    }

    else{
        y = (chartHeight - marginFromBottom - marginFromTop)/ (data.yAxis.labels.length - 1);  // Y axis step
        newSVG.setAttributeNS(null, 'style', "width: " + chartWidth + "px; height: " + chartHeight + "px");
    }

    var yMax =  calculateSteps(data.yAxis.labels.length, y)[calculateSteps(data.yAxis.labels.length, y).length - 1],
        xMax = calculateSteps(data.xAxis.categories.length, x)[calculateSteps(data.xAxis.categories.length, x).length - 1],
        yUnit = yMax/data.yAxis.labels[data.yAxis.labels.length - 1]; // unit in Y axis


    function calculateSeries(data) {
        var series = [];

        data.series.map( function(item, key) {

            series.push({
                name: item.name,
                data: item.data,
                color: item.color
            });
        });

        return series;
    }

    var series = calculateSeries(data);

    // generating markers

    var markersWrapper = document.createElementNS( "http://www.w3.org/2000/svg","g" );
    markersWrapper.setAttributeNS(null, 'class', 'markers');

    // generating points wrapper

    var pointsWrapper = document.createElementNS( "http://www.w3.org/2000/svg","g" );
    pointsWrapper.setAttributeNS(null, 'class', 'circles');

    // generating grids

    var xGrid = document.createElementNS( "http://www.w3.org/2000/svg","g" ),
        yGrid = document.createElementNS( "http://www.w3.org/2000/svg","g" );

    xGrid.setAttributeNS(null, 'class', 'grid x-grid');
    yGrid.setAttributeNS(null, 'class', 'grid y-grid');

    for (var i=0; i< data.xAxis.categories.length; i++){
        var xline = document.createElementNS( "http://www.w3.org/2000/svg","line" );
        xline.setAttributeNS(null, 'x1', calculateSteps(data.xAxis.categories.length, x)[i] + marginFromLeft);
        xline.setAttributeNS(null, 'x2', calculateSteps(data.xAxis.categories.length, x)[i] + marginFromLeft);
        xline.setAttributeNS(null, 'y1', marginFromTop);
        xline.setAttributeNS(null, 'y2', yMax);
        xGrid.appendChild(xline);
    }

    for (var i=0; i< data.yAxis.labels.length; i++){
        var yline = document.createElementNS( "http://www.w3.org/2000/svg","line" );
        yline.setAttributeNS(null, 'x1', marginFromLeft);
        yline.setAttributeNS(null, 'x2', xMax + marginFromLeft);
        yline.setAttributeNS(null, 'y1', marginFromTop + calculateSteps(data.yAxis.labels.length, y)[i]);
        yline.setAttributeNS(null, 'y2', marginFromTop + calculateSteps(data.yAxis.labels.length, y)[i]);
        yGrid.appendChild(yline);
    }

    newSVG.appendChild(xGrid);
    newSVG.appendChild(yGrid);

    series.map( function(serie) {

        var newSerie = document.createElementNS( "http://www.w3.org/2000/svg","path" ),
            points =  document.createElementNS( "http://www.w3.org/2000/svg","g" ),
            LX = calculateSteps(data.xAxis.categories.length, x),
            LY = [];

        LX.unshift(0);

        LY[0] = yMax + marginFromTop;

        points.setAttributeNS(null, 'class', 'points');

        for(var i=0; i < serie.data.length; i++){
            LY.push( marginFromTop + yMax - yUnit*serie.data[i]);

            var tooltipInfoItem =  document.createElementNS( "http://www.w3.org/2000/svg","text" );
            tooltipInfoItem.textContent =  serie.name + ": " + serie.data[i];
            tooltipInfoItem.setAttributeNS(null, 'fill', '#616161');
            tooltipInfoItem.setAttributeNS(null, 'class', 'marker marker-'+id);
            tooltipInfoItem.setAttributeNS(null, 'y', marginFromTop + yMax - yUnit*serie.data[i] + 3);
            tooltipInfoItem.setAttributeNS(null, 'x', calculateSteps(data.xAxis.categories.length, x)[i] + marginFromLeft + marginFromLeft/4);
            tooltipInfoItem.setAttributeNS(null, 'fill-opacity', 0);
            markersWrapper.appendChild(tooltipInfoItem);

            var circle = document.createElementNS( "http://www.w3.org/2000/svg","circle" );
            circle.setAttributeNS(null, 'cx', calculateSteps(data.xAxis.categories.length, x)[i] + marginFromLeft);
            circle.setAttributeNS(null, 'cy',  marginFromTop + yMax - yUnit*serie.data[i]);
            circle.setAttribute('data-value', serie.data[i]);
            circle.setAttribute('fill', '#ffffff');
            points.appendChild(circle);
            if(data.tooltips == true){
                pointsWrapper.appendChild(points);
            }
        }
        d = 'M';
        var L = [],
            lastX = calculateSteps(data.xAxis.categories.length, x)[calculateSteps(data.xAxis.categories.length, x).length - 1] + marginFromLeft,
            lastY = yMax - yUnit*serie.data[serie.data.length - 1],
            closeY = marginFromTop + yMax;

        for(var i=0; i < LX.length; i++){
            LX[i] = marginFromLeft + LX[i] + "," + LY[i];
            L.push(LX[i]);
        }

        L.push( lastX + ',' + lastY);
        L = L.join(' L');

        while(L.charAt(0) === '0') {
            L = L.substr(1);
        }

        d = d + L + ' L' + lastX + ',' + closeY + ' Z';

        newSerie.setAttributeNS(null, 'd', d);
        newSerie.setAttributeNS(null, 'fill', serie.color);

        newSVG.appendChild(newSerie);
        if(window.innerWidth > 1025){
            newSVG.appendChild(pointsWrapper);
        }
        if(data.tooltips == true && window.innerWidth > 1025){
            newSVG.appendChild(markersWrapper);
        }

    });

    // generating labels
    var xlabeltexts = [],
        ylabeltexts = [];

    var xlabels = document.createElementNS( "http://www.w3.org/2000/svg","g" ),
        ylabels = document.createElementNS( "http://www.w3.org/2000/svg","g" );
    xlabels.setAttributeNS(null, 'class', 'labels x-labels');
    ylabels.setAttributeNS(null, 'class', 'labels y-labels');

    for( var i=0; i< data.xAxis.categories.length; i++){
        var xlabeltext = document.createElementNS( "http://www.w3.org/2000/svg","text" );
        xlabeltext.setAttributeNS(null, 'x', calculateSteps(data.xAxis.categories.length, x)[i] + marginFromLeft);
        xlabeltext.setAttributeNS(null, 'y', 10 + yMax + marginFromBottom);
        if(data.labels == true){
            xlabeltext.textContent = data.xAxis.categories[i];
            xlabels.appendChild(xlabeltext);
        }
    }

    for( var i=0; i< data.yAxis.labels.length; i++){
        var ylabeltext = document.createElementNS( "http://www.w3.org/2000/svg","text" );
        ylabeltext.setAttributeNS(null, 'x', marginFromLeft/2);
        var yAxisLabels = calculateSteps(data.yAxis.labels.length, y).reverse();
        ylabeltext.setAttributeNS(null, 'y', yAxisLabels[i] + marginFromBottom/2);
        if(data.labels == true){
            ylabeltext.textContent = data.yAxis.labels[i];
            ylabels.appendChild(ylabeltext);
        }
    }
    newSVG.appendChild(xlabels);
    newSVG.appendChild(ylabels);


    if(document.body.contains(chartWrap)){
        if( percentageWidth ){
            chartWrap.appendChild(newSVG);
        }
        else{
            responsiveWrap.appendChild(newSVG);
            chartWrap.appendChild(responsiveWrap);
        }
    }


    function calculateSteps(n, number) {
        var array = [];
        for (var i = 0; i< n; i++){
            array.push(i*number);
        }
        return array;
    }

    // show tooltips
    if(document.body.contains(chartWrap)){
        chartWrap.onmouseover = function (e) {
            var pos = this.getBoundingClientRect(),
                posX = pos.left;

            if(e.pageX >= posX && e.pageX <= posX + this.offsetWidth){
                var circle = document.getElementsByTagNameNS("http://www.w3.org/2000/svg", "circle"),
                    CX = [];
                for(var i = 0; i< circle.length; i++){
                    CX.push(circle[i].getAttribute('cx'));
                    for( var j=0; j < CX.length; j++){
                        if(CX[j] >= e.pageX - posX - x/2 && CX[j] <= e.pageX - posX + x/2){
                            circle[i].setAttributeNS(null, 'r', 5);
                        }
                        else {
                            circle[i].setAttributeNS(null, 'r', 0);
                        }
                    }
                }

                var tooltipText = document.getElementsByClassName("marker-"+id),
                    TX = [];
                for(var i = 0; i< tooltipText.length; i++){
                    TX.push(tooltipText[i].getAttribute('x'));
                    for( var j=0; j < TX.length; j++){
                        if(TX[j] >= e.pageX - posX - x/2 && TX[j] <= e.pageX - posX + x/2 && data.tooltips == true){
                            tooltipText[i].setAttributeNS(null, 'fill-opacity', 1);
                        }
                        else {
                            tooltipText[i].setAttributeNS(null, 'fill-opacity', 0);
                        }
                    }
                }
            }
        }
    }
};

/*
 * Draw stacked area chart
 */
Charts.prototype.areaChart = function (id, data) {

    if(document.body.contains(document.getElementById(id))){

        var drawChart = function() {
            setTimeout(function () {
                document.getElementById(id).innerHTML = '';
                charts.generateAreaChart(id, data);
            }, 200);
        };
        drawChart();

        window.addEventListener("resize", function () {
            drawChart();
        });
    }
};


/*
 * Column charts
 */
Charts.prototype.generateColumnChart = function(id, data) {
    var responsiveWrap = document.createElement('div'),
        chartWrap = document.getElementById(id),
        percentageWidth,
        marginFromLeft,
        marginFromBottom = 20,
        marginFromTop = 10,
        x,
        y,
        barWidth = data.barWidth,
        chartWidth =  data.width,
        chartHeight =  data.height,
        newSVG = document.createElementNS( "http://www.w3.org/2000/svg","svg" );
    responsiveWrap.classList.add('chart-responsive');
    if(document.body.contains(chartWrap)){
        var parentWidth = chartWrap.parentNode.offsetWidth,
            parentHeight = chartWrap.parentNode.offsetHeight;
    }

    //check if chart width set with percentage
    if( chartWidth.toString().indexOf('%') !==  -1 ){
        percentageWidth = true;
        chartWidth = chartWidth.substring(0, chartWidth.length - 1)*parentWidth/100;
        marginFromLeft = chartWidth*6/100;
        x = (chartWidth - 3*marginFromLeft) / (data.xAxis.categories.length - 1); // X axis step
        newSVG.setAttributeNS(null, 'style', "width: " + chartWidth + "px; height: " + chartHeight + "px");
    }
    else{
        percentageWidth = false;
        marginFromLeft = chartWidth*6/100;
        x = (chartWidth - 3*marginFromLeft) / (data.xAxis.categories.length - 1); // X axis step
        newSVG.setAttributeNS(null, 'style', "width: " + chartWidth + "px; height: " + chartHeight + "px");
    }

    //check if chart height set with percentage
    if( chartHeight.toString().indexOf('%') !==  -1 ){
        chartHeight = chartHeight.substring(0, chartHeight.length - 1)*parentHeight/100;
        y = (chartHeight - marginFromBottom - marginFromTop) / (data.yAxis.labels.length - 1);  // Y axis step
        newSVG.setAttributeNS(null, 'style', "width: " + chartWidth + "px; height: " + chartHeight+ "px");
    }

    else{
        y = (chartHeight - marginFromBottom - marginFromTop) / (data.yAxis.labels.length - 1);  // Y axis step
        newSVG.setAttributeNS(null, 'style', "width: " + chartWidth + "px; height: " + chartHeight + "px");
    }

    var yMax =  calculateSteps(data.yAxis.labels.length, y)[calculateSteps(data.yAxis.labels.length, y).length - 1],
        xMax = calculateSteps(data.xAxis.categories.length, x)[calculateSteps(data.xAxis.categories.length, x).length - 1],
        yUnit = yMax/data.yAxis.labels[data.yAxis.labels.length - 1]; // unit in Y axis


    function calculateSeries(data) {
        var series = [];

        data.series.map( function(item, key) {
            series.push({
                name: item.name,
                data: item.data,
                color: item.color
            });
        });

        return series;
    }

    var series = calculateSeries(data);

    // generating markers
    var markersWrapper = document.createElementNS( "http://www.w3.org/2000/svg","g" );
    markersWrapper.setAttributeNS(null, 'class', 'markers');

    // generating grids
    var xGrid = document.createElementNS( "http://www.w3.org/2000/svg","g" ),
        yGrid = document.createElementNS( "http://www.w3.org/2000/svg","g" );

    xGrid.setAttributeNS(null, 'class', 'grid x-grid');
    yGrid.setAttributeNS(null, 'class', 'grid y-grid');

    for (var i=0; i< data.xAxis.categories.length; i++){
        var xline = document.createElementNS( "http://www.w3.org/2000/svg","line" );
        xline.setAttributeNS(null, 'x1', calculateSteps(data.xAxis.categories.length, x)[i] + marginFromLeft);
        xline.setAttributeNS(null, 'x2', calculateSteps(data.xAxis.categories.length, x)[i] + marginFromLeft);
        xline.setAttributeNS(null, 'y1', marginFromTop);
        xline.setAttributeNS(null, 'y2', yMax);
        xGrid.appendChild(xline);
    }

    for (var i=0; i< data.yAxis.labels.length; i++){
        var yline = document.createElementNS( "http://www.w3.org/2000/svg","line" );
        yline.setAttributeNS(null, 'x1', marginFromLeft);
        yline.setAttributeNS(null, 'x2', xMax + marginFromLeft + barWidth);
        yline.setAttributeNS(null, 'y1', marginFromTop + calculateSteps(data.yAxis.labels.length, y)[i]);
        yline.setAttributeNS(null, 'y2', marginFromTop + calculateSteps(data.yAxis.labels.length, y)[i]);
        yGrid.appendChild(yline);
    }

    newSVG.appendChild(xGrid);
    newSVG.appendChild(yGrid);

    series.map(function(serie) {
        for(var i=0; i < serie.data.length; i++){
            var tooltipInfoItem =  document.createElementNS( "http://www.w3.org/2000/svg","text" );
            tooltipInfoItem.textContent =  serie.name + ": " + serie.data[i];
            tooltipInfoItem.setAttributeNS(null, 'fill', '#616161');
            tooltipInfoItem.setAttributeNS(null, 'class', 'marker marker-'+id);
            tooltipInfoItem.setAttributeNS(null, 'y',  yMax - yUnit*serie.data[i] + 3);
            tooltipInfoItem.setAttributeNS(null, 'x', calculateSteps(data.xAxis.categories.length, x)[i] + marginFromLeft);
            tooltipInfoItem.setAttributeNS(null, 'fill-opacity', 0);
            markersWrapper.appendChild(tooltipInfoItem);

            var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
            rect.setAttributeNS(null, 'x',  calculateSteps(serie.data.length, x)[i] + marginFromLeft);
            rect.setAttributeNS(null, 'y',  -(marginFromTop + yMax));
            rect.setAttributeNS(null, 'height', yUnit*serie.data[i]);
            rect.setAttributeNS(null, 'width', barWidth);
            rect.setAttributeNS(null, 'transform', 'scale(1,-1)');
            rect.setAttributeNS(null, 'fill', serie.color);
            newSVG.appendChild(rect);
        }
        if(data.tooltips == true && window.innerWidth > 1025){
            newSVG.appendChild(markersWrapper);
        }

    });

    // generating labels
    var xlabeltexts = [],
        ylabeltexts = [];

    var xlabels = document.createElementNS( "http://www.w3.org/2000/svg","g" ),
        ylabels = document.createElementNS( "http://www.w3.org/2000/svg","g" );
    xlabels.setAttributeNS(null, 'class', 'labels x-labels');
    ylabels.setAttributeNS(null, 'class', 'labels y-labels');

    for( var i=0; i< data.xAxis.categories.length; i++){
        var xlabeltext = document.createElementNS( "http://www.w3.org/2000/svg","text" );
        xlabeltext.setAttributeNS(null, 'x', calculateSteps(data.xAxis.categories.length, x)[i] + barWidth / 2 + marginFromLeft);
        xlabeltext.setAttributeNS(null, 'y', 10 + yMax + marginFromBottom);
        if(data.labels == true){
            xlabeltext.textContent = data.xAxis.categories[i];
            xlabels.appendChild(xlabeltext);
        }
    }

    for( var i=0; i< data.yAxis.labels.length; i++){
        var ylabeltext = document.createElementNS( "http://www.w3.org/2000/svg","text" );
        ylabeltext.setAttributeNS(null, 'x', marginFromLeft/2);
        var yAxisLabels = calculateSteps(data.yAxis.labels.length, y).reverse();
        ylabeltext.setAttributeNS(null, 'y', yAxisLabels[i] + marginFromBottom/2);
        if(data.labels == true){
            ylabeltext.textContent = data.yAxis.labels[i];
            ylabels.appendChild(ylabeltext);
        }
    }

    newSVG.appendChild(xlabels);
    newSVG.appendChild(ylabels);

    if(document.body.contains(chartWrap)){
        if( percentageWidth ){
            chartWrap.appendChild(newSVG);
        }
        else{
            responsiveWrap.appendChild(newSVG);
            chartWrap.appendChild(responsiveWrap);
        }
    }

    function calculateSteps(n, number) {
        var array = [];
        for (var i = 0; i< n; i++){
            array.push(i*number);
        }
        return array;
    }

    // show tooltips
    if(document.body.contains(chartWrap)){
        chartWrap.onmouseover = function (e) {
            var pos = this.getBoundingClientRect(),
                posX = pos.left;

            if(e.pageX >= posX && e.pageX <= posX + this.offsetWidth){

                var tooltipText = document.getElementsByClassName("marker-"+id),
                    TX = [];
                for(var i = 0; i< tooltipText.length; i++){
                    TX.push(tooltipText[i].getAttribute('x'));
                    for( var j=0; j < TX.length; j++){
                        if(TX[j] >= e.pageX - posX - x/2 && TX[j] <= e.pageX - posX + x/2 && data.tooltips == true){
                            tooltipText[i].setAttributeNS(null, 'fill-opacity', 1);
                        }
                        else {
                            tooltipText[i].setAttributeNS(null, 'fill-opacity', 0);
                        }
                    }
                }
            }
        }
    }
};

/*
 * Draw column charts
 */
Charts.prototype.columnChart = function (id, data) {
    if(document.body.contains(document.getElementById(id))){
        var drawChart = function() {
            setTimeout(function () {
                document.getElementById(id).innerHTML = '';
                charts.generateColumnChart(id, data);
            }, 300);
        };
        drawChart();


        window.addEventListener("resize", function () {
            drawChart();
        });
    }
};

var charts = new Charts();
charts.init();
