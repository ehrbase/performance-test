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

    var data = {"OkPercent": 97.83024888321634, "KoPercent": 2.169751116783663};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.879706445437141, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.364, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.831, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.337, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.94, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.542, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.499, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.97, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.868, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 510, 2.169751116783663, 284.32865347798435, 1, 7180, 26.0, 798.0, 1868.9500000000007, 3756.9900000000016, 17.15390420086379, 114.13837648066911, 142.08864001076088], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 41.01599999999997, 16, 115, 35.0, 67.90000000000003, 76.0, 91.96000000000004, 0.37167978448519373, 0.2158189157970599, 0.1872917664007422], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 13.619999999999994, 4, 108, 11.0, 25.0, 32.0, 54.99000000000001, 0.371527057944103, 3.9690279138495628, 0.1342431752337091], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 13.644, 5, 83, 10.5, 24.0, 28.0, 42.99000000000001, 0.37150580217761836, 3.989144408902691, 0.15672901029368277], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 53.50399999999998, 15, 291, 43.0, 113.0, 127.94999999999999, 171.95000000000005, 0.3693948942237721, 0.19946674961121186, 4.112404095850587], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 65.77200000000005, 26, 155, 56.5, 108.90000000000003, 124.0, 142.97000000000003, 0.371552457633731, 1.5453323896674978, 0.15457162788278264], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 5.326000000000002, 1, 26, 4.0, 12.0, 14.0, 20.0, 0.3715756516879567, 0.23223478230497294, 0.15712134490320825], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 59.59200000000001, 24, 153, 52.0, 97.0, 110.94999999999999, 124.98000000000002, 0.371557703654493, 1.524992556073631, 0.13497994703073377], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1180.7520000000009, 593, 2606, 909.5, 2148.7000000000003, 2334.6499999999996, 2466.95, 0.3712693923285348, 1.5701127628680116, 0.1805587474410257], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 19.894000000000013, 7, 85, 16.0, 33.0, 39.0, 55.950000000000045, 0.37139211133444155, 0.5522259769190945, 0.18968561936319622], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 8.761999999999981, 2, 40, 6.0, 20.0, 24.0, 35.98000000000002, 0.3699625893829616, 0.3569141822753883, 0.20232329106880712], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 32.48600000000001, 11, 109, 25.0, 55.900000000000034, 60.0, 73.97000000000003, 0.3715560470003537, 0.6054244535525217, 0.24274511273753577], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 761.0, 761, 761, 761.0, 761.0, 761.0, 761.0, 1.314060446780552, 0.560785561760841, 1554.2576071780552], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 8.385999999999992, 3, 33, 6.0, 17.0, 20.0, 29.99000000000001, 0.3699666955980623, 0.3717731736039122, 0.2171386563031596], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 33.166000000000004, 12, 114, 26.0, 56.0, 61.89999999999998, 76.98000000000002, 0.37155439036098736, 0.5838193496980748, 0.22097326536117315], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 20.022000000000023, 7, 65, 16.0, 35.0, 40.94999999999999, 52.0, 0.37155715143480506, 0.5750942721771316, 0.21226653670836032], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2980.114, 1525, 6038, 2731.5, 4401.3, 4902.15, 5652.87, 0.3705899792469612, 0.565955317271346, 0.20411401200711532], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 1, 0.2, 52.78000000000002, 9, 463, 40.0, 112.0, 132.0, 191.0, 0.3693708801295457, 0.19926188270738512, 2.9780527210444627], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 37.64999999999999, 14, 96, 32.0, 63.0, 69.94999999999999, 81.98000000000002, 0.3715651587809393, 0.6725888173099573, 0.3098795367176974], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 31.76999999999998, 11, 78, 26.0, 55.0, 61.0, 71.99000000000001, 0.37155963643632695, 0.6289735400307205, 0.2663327862736953], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 176.0, 176, 176, 176.0, 176.0, 176.0, 176.0, 5.681818181818182, 2.6467063210227275, 774.90234375], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 1381.0, 1381, 1381, 1381.0, 1381.0, 1381.0, 1381.0, 0.724112961622013, 0.33164939355539463, 1384.825024891383], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 6.575999999999999, 1, 43, 4.0, 16.0, 20.0, 29.99000000000001, 0.3699001861337736, 0.31083102769923565, 0.15641287167570703], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 585.186, 318, 1379, 462.5, 1137.7, 1213.0, 1308.92, 0.36981974985392124, 0.32550783185775256, 0.17118609514722524], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 7.611999999999994, 2, 48, 5.0, 18.0, 21.94999999999999, 31.99000000000001, 0.36992700600317546, 0.335099678912607, 0.180628420899988], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1635.6540000000002, 909, 3747, 1291.0, 3066.8, 3332.8, 3516.95, 0.3696789338459548, 0.3497393763516386, 0.19530888985416164], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 120.0, 120, 120, 120.0, 120.0, 120.0, 120.0, 8.333333333333334, 3.898111979166667, 548.7223307291667], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 90.13999999999996, 30, 832, 76.0, 152.0, 177.89999999999998, 229.99, 0.3691478075204268, 0.19924969208458504, 16.88490723500171], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 99.06399999999998, 10, 437, 86.0, 184.0, 211.0, 267.8800000000001, 0.36955160825164396, 82.20916672417813, 0.11404131660890575], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 570.0, 570, 570, 570.0, 570.0, 570.0, 570.0, 1.7543859649122808, 0.9200246710526316, 0.7195723684210527], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 6.455999999999998, 1, 32, 4.0, 16.0, 20.0, 25.99000000000001, 0.37152981861171197, 0.4036526350380855, 0.15927889684623198], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 8.280000000000012, 2, 60, 6.0, 17.0, 23.0, 31.980000000000018, 0.371527057944103, 0.381175876868874, 0.13678291098137385], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 5.295999999999999, 1, 29, 4.0, 11.900000000000034, 13.0, 18.99000000000001, 0.37154196603660583, 0.21074339254411875, 0.14404507862942628], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 199.96000000000006, 86, 494, 146.5, 367.0, 392.95, 442.9200000000001, 0.3714875848849132, 0.33845348673603576, 0.12116880210113377], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 9, 1.8, 299.38400000000047, 83, 1197, 252.5, 489.7000000000001, 532.0, 745.7300000000002, 0.36944183987947327, 0.19816225312972655, 109.28767895762724], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 5.281999999999997, 1, 24, 4.0, 11.0, 15.0, 18.99000000000001, 0.3715251255011874, 0.20716879556755663, 0.15564870980469667], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 7.674000000000004, 2, 33, 6.0, 16.0, 20.0, 28.99000000000001, 0.37154721176110406, 0.19986119576711125, 0.1581978362576576], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 45.39199999999997, 7, 389, 31.0, 109.7000000000001, 130.95, 158.98000000000002, 0.3690551671044891, 0.1558883259362376, 0.2677812394127299], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 9.197999999999999, 2, 60, 7.0, 17.900000000000034, 21.94999999999999, 32.99000000000001, 0.37153147503197026, 0.1910607866826029, 0.1494833669073943], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 7.902, 2, 33, 6.0, 17.0, 20.0, 27.0, 0.3698977232795132, 0.2271916151121715, 0.18494886163975663], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 9.491999999999992, 2, 48, 7.0, 20.0, 24.0, 29.99000000000001, 0.36988513586990696, 0.21668767074822584, 0.17446730529801277], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 793.7040000000012, 380, 1856, 620.0, 1534.9, 1647.75, 1750.95, 0.3696111616657044, 0.3377430274240394, 0.1627877284289382], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 28.92599999999997, 7, 168, 25.0, 54.0, 65.0, 92.93000000000006, 0.36966909440683265, 0.3272640060226489, 0.15198309447780914], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 17.817999999999987, 6, 71, 13.0, 32.0, 37.0, 49.99000000000001, 0.369971349418701, 0.24660035639340092, 0.1730627698940994], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 816.3939999999994, 440, 5965, 789.5, 984.9000000000001, 1045.85, 1150.97, 0.369844095919806, 0.27789594168224324, 0.204425545205674], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 248.8319999999999, 143, 615, 192.0, 481.90000000000003, 507.95, 582.94, 0.3715198804003201, 7.1833223750448605, 0.1872111897329738], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 399.57400000000047, 211, 863, 330.5, 687.9000000000001, 742.0, 779.96, 0.3714519835164468, 0.7200299248682646, 0.265530128841835], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 31.158000000000012, 11, 89, 24.0, 53.0, 59.0, 75.97000000000003, 0.3713405318933243, 0.3029964674375201, 0.22918673452791108], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 31.11600000000001, 11, 128, 24.0, 56.0, 60.0, 69.99000000000001, 0.37136011384415646, 0.3087728790324138, 0.23500132204200527], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 31.244000000000003, 12, 78, 24.5, 54.0, 60.0, 70.99000000000001, 0.37132619149291696, 0.3005936287387906, 0.22663952117487604], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 34.04199999999998, 13, 86, 28.0, 59.900000000000034, 64.0, 78.97000000000003, 0.3713339131093497, 0.33216978946109793, 0.25819311145884466], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 31.64000000000001, 11, 81, 24.0, 56.0, 63.0, 72.0, 0.37147875290124904, 0.2788245513743971, 0.2049663040910212], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 3209.022000000004, 1710, 7180, 2977.0, 4584.800000000001, 5531.099999999999, 6349.18, 0.37054466360102717, 0.3096892160849733, 0.2359327350272165], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 98.03921568627452, 2.1272069772388855], "isController": false}, {"data": ["500", 10, 1.9607843137254901, 0.042544139544777704], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 510, "No results for path: $['rows'][1]", 500, "500", 10, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 9, "500", 9, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
