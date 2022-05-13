/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9044444444444445, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.1, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.9, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.8, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.8, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.3, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 225, 0, 0.0, 246.16444444444454, 4, 3886, 31.0, 717.4000000000001, 1640.7999999999972, 2888.5400000000072, 9.888371275380152, 65.12114799870352, 228.6753239128285], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 5, 0, 0.0, 17.0, 11, 22, 17.0, 22.0, 22.0, 22.0, 0.9821253191907287, 10.48687328128069, 0.3548695000982125], "isController": false}, {"data": ["Query participation #1", 5, 0, 0.0, 22.0, 15, 47, 16.0, 47.0, 47.0, 47.0, 0.9763718023823471, 10.484555018551063, 0.4119068541300527], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 5, 0, 0.0, 86.4, 35, 252, 48.0, 252.0, 252.0, 252.0, 0.45433893684688775, 0.24536077351203997, 5.058070195365742], "isController": false}, {"data": ["Query ehr_id, time_created #2", 5, 0, 0.0, 44.0, 32, 53, 46.0, 53.0, 53.0, 53.0, 0.9340556697179152, 3.884905368484962, 0.38858175322249205], "isController": false}, {"data": ["Query ehr_id, time_created #3", 5, 0, 0.0, 7.4, 4, 13, 6.0, 13.0, 13.0, 13.0, 0.942684766214178, 0.5891779788838613, 0.39861572633861236], "isController": false}, {"data": ["Query ehr_id, time_created #1", 5, 0, 0.0, 42.4, 34, 57, 38.0, 57.0, 57.0, 57.0, 0.9297136481963555, 3.8160024056340647, 0.33774753625883225], "isController": false}, {"data": ["Query ehr_id, time_created #4", 5, 0, 0.0, 702.2, 566, 863, 656.0, 863.0, 863.0, 863.0, 0.8526603001364257, 3.6063200780184177, 0.41467268502728516], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 5, 0, 0.0, 21.2, 12, 32, 23.0, 32.0, 32.0, 32.0, 0.8275405494869249, 1.2308049383482291, 0.422659870489904], "isController": false}, {"data": ["Query start_time #5", 5, 0, 0.0, 11.2, 9, 15, 10.0, 15.0, 15.0, 15.0, 0.4896680050925472, 0.4724531142885124, 0.26778719028498676], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 5, 0, 0.0, 24.4, 19, 34, 25.0, 34.0, 34.0, 34.0, 0.9307520476545049, 1.5170167651712585, 0.608079218633656], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 711.0, 711, 711, 711.0, 711.0, 711.0, 711.0, 1.4064697609001406, 0.6002219585091421, 1663.5584234353025], "isController": false}, {"data": ["Query start_time #6", 5, 0, 0.0, 12.4, 8, 23, 10.0, 23.0, 23.0, 23.0, 0.49005194550622366, 0.4924447772713908, 0.2876183781730864], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 5, 0, 0.0, 26.6, 18, 33, 25.0, 33.0, 33.0, 33.0, 0.9285051067780873, 1.4589499187558033, 0.5522066504178273], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 5, 0, 0.0, 18.8, 15, 21, 20.0, 21.0, 21.0, 21.0, 0.929195316855603, 1.4382564230626278, 0.5308391214458279], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 5, 0, 0.0, 1998.4, 1470, 2281, 2111.0, 2281.0, 2281.0, 2281.0, 0.668359844940516, 1.0208152319208663, 0.36812007084614357], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 5, 0, 0.0, 53.4, 43, 76, 47.0, 76.0, 76.0, 76.0, 0.4526115687516973, 0.2444279272653209, 3.6491807730605594], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 5, 0, 0.0, 32.0, 25, 42, 29.0, 42.0, 42.0, 42.0, 0.9298865538404315, 1.6836031941603125, 0.7755108564255161], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 5, 0, 0.0, 22.2, 20, 27, 21.0, 27.0, 27.0, 27.0, 0.9312721177127957, 1.5769783712050662, 0.6675329437511641], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 82.0, 82, 82, 82.0, 82.0, 82.0, 82.0, 12.195121951219512, 5.680735518292683, 1663.2050304878048], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 727.0, 727, 727, 727.0, 727.0, 727.0, 727.0, 1.375515818431912, 0.6299969910591472, 2630.5960926753783], "isController": false}, {"data": ["Query start_time #1", 5, 0, 0.0, 14.4, 7, 32, 10.0, 32.0, 32.0, 32.0, 0.500751126690035, 0.4210417188282424, 0.21174339634451678], "isController": false}, {"data": ["Query start_time #2", 5, 0, 0.0, 390.8, 332, 422, 413.0, 422.0, 422.0, 422.0, 0.4819741661846925, 0.42455146279159434, 0.22310132301908617], "isController": false}, {"data": ["Query start_time #3", 5, 0, 0.0, 10.2, 5, 13, 11.0, 13.0, 13.0, 13.0, 0.502108857200241, 0.4550361518377184, 0.24517034042980518], "isController": false}, {"data": ["Query start_time #4", 5, 0, 0.0, 1077.8, 965, 1236, 992.0, 1236.0, 1236.0, 1236.0, 0.4477478284230321, 0.423698872794842, 0.23655427263365272], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 60.0, 60, 60, 60.0, 60.0, 60.0, 60.0, 16.666666666666668, 7.796223958333334, 1097.4446614583335], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 5, 0, 0.0, 229.2, 78, 762, 106.0, 762.0, 762.0, 762.0, 0.4254232961796988, 0.22974519803454438, 19.458961275844466], "isController": false}, {"data": ["Composition - Get composition by version ID", 5, 0, 0.0, 115.0, 75, 195, 104.0, 195.0, 195.0, 195.0, 0.4676830979328407, 105.83476683074548, 0.14432408100271255], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 352.0, 352, 352, 352.0, 352.0, 352.0, 352.0, 2.840909090909091, 1.4898126775568183, 1.1652166193181819], "isController": false}, {"data": ["Query composer #2", 5, 0, 0.0, 6.4, 6, 7, 6.0, 7.0, 7.0, 7.0, 1.023331968890708, 1.1122739075931232, 0.4387136077568563], "isController": false}, {"data": ["Query composer #1", 5, 0, 0.0, 10.0, 7, 12, 11.0, 12.0, 12.0, 12.0, 1.0224948875255624, 1.0494552019427403, 0.37644587167689164], "isController": false}, {"data": ["Query ehr_status #1", 5, 0, 0.0, 7.0, 5, 9, 7.0, 9.0, 9.0, 9.0, 0.9848335631278313, 0.5587776368918653, 0.3818153560173331], "isController": false}, {"data": ["Query ehr_status #2", 5, 0, 0.0, 165.6, 92, 276, 112.0, 276.0, 276.0, 276.0, 0.9689922480620154, 0.8828806322674418, 0.3160580184108527], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 5, 0, 0.0, 304.6, 254, 401, 274.0, 401.0, 401.0, 401.0, 0.4538440591812653, 0.24509352024144504, 134.25540499909232], "isController": false}, {"data": ["Query ehr_status #3", 5, 0, 0.0, 6.8, 5, 10, 5.0, 10.0, 10.0, 10.0, 1.022704029453876, 0.5702773445489875, 0.4284570592145633], "isController": false}, {"data": ["Query composer #4", 5, 0, 0.0, 446.6, 354, 611, 386.0, 611.0, 611.0, 611.0, 0.9554748710108925, 1.0394521545958342, 0.41055560863749285], "isController": false}, {"data": ["Create EHR", 5, 0, 0.0, 98.4, 24, 334, 45.0, 334.0, 334.0, 334.0, 0.41628507201731746, 0.17602679314794772, 0.3020505942469403], "isController": false}, {"data": ["Query composer #3", 5, 0, 0.0, 6.2, 5, 7, 7.0, 7.0, 7.0, 7.0, 1.0235414534288638, 1.0895118986693961, 0.41581371545547596], "isController": false}, {"data": ["Query ehr_id #4", 5, 0, 0.0, 11.6, 9, 17, 11.0, 17.0, 17.0, 17.0, 0.5002000800320128, 0.3072518069727891, 0.2501000400160064], "isController": false}, {"data": ["Query ehr_id #3", 5, 0, 0.0, 14.2, 7, 27, 13.0, 27.0, 27.0, 27.0, 0.4993009786299181, 0.29255916716596764, 0.23551012956860398], "isController": false}, {"data": ["Query ehr_id #2", 5, 0, 0.0, 497.6, 371, 793, 409.0, 793.0, 793.0, 793.0, 0.46296296296296297, 0.4231770833333333, 0.20390263310185183], "isController": false}, {"data": ["Query ehr_id #1", 5, 0, 0.0, 46.4, 20, 130, 25.0, 130.0, 130.0, 130.0, 0.4752851711026616, 0.4209801271387833, 0.195405329134981], "isController": false}, {"data": ["Query magnitude #1", 5, 0, 0.0, 25.2, 13, 63, 15.0, 63.0, 63.0, 63.0, 0.4905327185323261, 0.32718149097419796, 0.22945817595408616], "isController": false}, {"data": ["Query magnitude #2", 5, 0, 0.0, 1742.8, 538, 3886, 613.0, 3886.0, 3886.0, 3886.0, 0.46541934282788794, 0.3499735292748766, 0.25725326957088335], "isController": false}, {"data": ["Query magnitude #7", 5, 0, 0.0, 80.2, 18, 196, 35.0, 196.0, 196.0, 196.0, 0.7800312012480499, 0.6368223478939158, 0.4814255070202808], "isController": false}, {"data": ["Query magnitude #8", 5, 0, 0.0, 81.4, 16, 200, 29.0, 200.0, 200.0, 200.0, 0.8024394158241053, 0.6676546701974001, 0.5077936928261916], "isController": false}, {"data": ["Query magnitude #5", 5, 0, 0.0, 42.8, 23, 99, 31.0, 99.0, 99.0, 99.0, 0.768403258029814, 0.6220764657292147, 0.4689961291685877], "isController": false}, {"data": ["Query magnitude #6", 5, 0, 0.0, 71.6, 29, 156, 30.0, 156.0, 156.0, 156.0, 0.7686395080707148, 0.6875720599538816, 0.534444657955419], "isController": false}, {"data": ["Query magnitude #3", 5, 0, 0.0, 30.8, 19, 39, 33.0, 39.0, 39.0, 39.0, 0.7264274298997531, 0.5455299742118263, 0.40081200966148484], "isController": false}, {"data": ["Query magnitude #4", 5, 0, 0.0, 2015.4, 1714, 2198, 2078.0, 2198.0, 2198.0, 2198.0, 0.5839075090505664, 0.4881101833469578, 0.3717848592782903], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 225, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
