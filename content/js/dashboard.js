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

    var data = {"OkPercent": 97.87279302276112, "KoPercent": 2.1272069772388855};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.887364390555201, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.136, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.576, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.917, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.966, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.115, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 328.2007657945127, 1, 18812, 10.0, 847.0, 1523.9500000000007, 6042.990000000002, 15.04563618941179, 94.77635118678415, 124.50392342528102], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6197.3579999999965, 5011, 18812, 6029.5, 6525.0, 6732.7, 15982.34000000008, 0.32447347688905215, 0.18844494281317206, 0.1635042129636239], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3659999999999983, 1, 12, 2.0, 3.0, 4.0, 7.0, 0.32548396210325137, 0.16709977902080103, 0.11760650974433885], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.6600000000000024, 2, 12, 4.0, 5.0, 5.0, 7.0, 0.3254820551978508, 0.18680572134797743, 0.1373127420365933], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 14.357999999999995, 9, 366, 12.0, 16.0, 22.0, 42.97000000000003, 0.3234510414800084, 0.16826719170587434, 3.5589090667531793], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.86799999999997, 24, 46, 35.0, 41.0, 43.0, 44.0, 0.32542146961637364, 1.3533942059276822, 0.1353804160708742], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.523999999999999, 1, 9, 2.0, 3.0, 4.0, 7.0, 0.32542930634092493, 0.20330115386655576, 0.13760829066955127], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.82799999999999, 22, 51, 31.0, 37.0, 37.0, 38.99000000000001, 0.32542168141477723, 1.3355985885729478, 0.11821959520146205], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 860.6419999999989, 660, 1111, 859.5, 997.9000000000001, 1060.85, 1090.97, 0.32527856856612003, 1.3756710446044742, 0.1581921163534451], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.104000000000001, 3, 16, 6.0, 8.0, 9.0, 12.0, 0.3253617534655907, 0.4838199175972555, 0.1661759736938515], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.925999999999998, 2, 15, 4.0, 5.0, 6.0, 11.0, 0.3236537138292701, 0.31218360320928545, 0.17699812475038207], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 8.329999999999998, 5, 20, 8.0, 10.0, 11.0, 16.0, 0.3254229522109886, 0.5303091158046863, 0.21260542483315564], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.8351683156370656, 2283.37845378861], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.205999999999994, 2, 15, 4.0, 5.0, 6.0, 12.990000000000009, 0.32365601838366187, 0.3251447096400945, 0.18995826860212967], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.544000000000002, 6, 20, 8.0, 11.0, 11.0, 17.99000000000001, 0.32542146961637364, 0.5112390355337465, 0.1935367919886441], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.916000000000006, 4, 17, 7.0, 8.0, 9.0, 14.0, 0.32542019883174145, 0.5036100032135244, 0.1859090003091492], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1598.0579999999984, 1333, 2021, 1579.0, 1786.0, 1860.5, 1953.8500000000001, 0.3250806199937585, 0.49641778934613284, 0.17904831023093729], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 12.609999999999998, 7, 80, 11.0, 15.0, 18.0, 62.7800000000002, 0.32343639526256246, 0.16825957238312467, 2.6077059368044098], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.719999999999994, 8, 24, 12.0, 14.900000000000034, 16.0, 20.0, 0.3254252820298207, 0.5891055659682606, 0.27139960044283873], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 8.421999999999999, 5, 25, 8.0, 11.0, 11.0, 16.0, 0.3254252820298207, 0.550969790730391, 0.2332638252049691], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 64.0, 64, 64, 64.0, 64.0, 64.0, 64.0, 15.625, 7.3699951171875, 2130.9814453125], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 1.021733893171806, 4212.430306993392], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.4459999999999984, 1, 21, 2.0, 3.0, 4.0, 9.0, 0.3236526663153957, 0.27204207658625407, 0.13685703565875618], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 579.9240000000002, 451, 732, 569.5, 678.9000000000001, 693.0, 712.99, 0.3235609304059266, 0.28492004546516414, 0.14977332130118087], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.3480000000000003, 1, 13, 3.0, 4.0, 5.0, 9.990000000000009, 0.3236614656426881, 0.293226541300174, 0.1580378250208438], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 778.5180000000009, 613, 978, 764.0, 896.9000000000001, 915.95, 956.94, 0.3235201058040154, 0.30605191571621854, 0.17092224339841047], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 83.0, 83, 83, 83.0, 83.0, 83.0, 83.0, 12.048192771084338, 5.706419427710843, 793.3334902108434], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 24.874000000000027, 16, 662, 23.0, 28.0, 33.89999999999998, 79.81000000000017, 0.32329983084952846, 0.16818852821469954, 14.747397557599099], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.466000000000008, 19, 249, 29.0, 34.0, 38.94999999999999, 94.0, 0.32357265629853593, 73.18262674806083, 0.09985249940462632], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 1.0994005503144655, 0.8598663522012578], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.7980000000000023, 1, 15, 3.0, 4.0, 4.0, 7.990000000000009, 0.32543205987429213, 0.35362451888937846, 0.13951628348126388], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.5579999999999985, 2, 19, 3.0, 5.0, 5.0, 7.990000000000009, 0.325430789006948, 0.3339193206225491, 0.1198119213433783], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8699999999999988, 1, 12, 2.0, 3.0, 3.0, 6.990000000000009, 0.32548502150479536, 0.18458242855278292, 0.12618901712637084], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.71600000000008, 66, 125, 92.0, 113.0, 115.94999999999999, 118.0, 0.3254631992251372, 0.29644802788015406, 0.10615694193476155], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 83.88600000000001, 59, 409, 81.0, 94.0, 100.94999999999999, 344.6900000000003, 0.32350503470885517, 0.16829528031226001, 95.65829048778737], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 213.39599999999987, 12, 355, 262.0, 334.90000000000003, 338.0, 345.0, 0.3254261292449398, 0.18137104123181602, 0.1363357514121867], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 441.3399999999999, 330, 578, 434.0, 515.0, 537.9, 570.99, 0.32539182056072824, 0.174996610840819, 0.13854573609812257], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.613999999999995, 4, 293, 6.0, 8.0, 13.0, 29.0, 0.3232423535405058, 0.14574631548162786, 0.23454010613339435], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 417.22400000000016, 310, 541, 418.0, 487.0, 508.95, 531.98, 0.3253651410295204, 0.1673565170231042, 0.1309086309610961], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.5799999999999996, 2, 15, 3.0, 5.0, 5.0, 9.990000000000009, 0.3236507808075087, 0.1987133617202039, 0.16182539040375435], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.265999999999998, 2, 49, 4.0, 5.0, 6.0, 10.0, 0.32364135359759727, 0.18954194938087407, 0.15265505252699169], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 682.7920000000008, 546, 915, 682.5, 818.0, 843.0, 865.99, 0.32350022062715045, 0.2956078041435849, 0.14247910107699693], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 254.9119999999999, 178, 379, 252.0, 304.90000000000003, 317.0, 332.95000000000005, 0.3235791477831269, 0.2865160635609756, 0.13303400509443009], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.674000000000005, 3, 34, 4.0, 6.0, 6.0, 11.0, 0.3236581134615883, 0.21578577211070404, 0.15139866830869217], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 991.6720000000004, 818, 8674, 942.0, 1092.0, 1120.0, 1158.93, 0.3234941509022576, 0.24316082313571938, 0.178806337315115], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 135.95399999999987, 117, 172, 136.0, 154.0, 157.0, 162.99, 0.325499430050498, 6.293426582749116, 0.16402119717388375], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 183.47199999999987, 159, 271, 175.5, 207.0, 214.0, 217.99, 0.3254663770449866, 0.630816770688433, 0.23265760546575215], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.538000000000001, 5, 16, 7.0, 9.0, 10.0, 15.0, 0.32535751910987387, 0.26553176981964133, 0.2008065938256253], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.4959999999999996, 5, 28, 7.0, 9.0, 10.0, 13.990000000000009, 0.32536005971007814, 0.2706175941949909, 0.20589191278528382], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.607999999999999, 6, 30, 8.0, 10.0, 12.0, 15.990000000000009, 0.32535328486436993, 0.2633042194335469, 0.1985798857814758], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 10.156000000000004, 7, 22, 10.0, 12.900000000000034, 13.0, 18.99000000000001, 0.3253547668377599, 0.29094786478613777, 0.2262232363168799], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.8780000000000046, 5, 38, 8.0, 9.0, 10.0, 15.970000000000027, 0.32531835654371366, 0.24421432994015446, 0.17949694477265454], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1623.1099999999994, 1402, 1990, 1594.5, 1824.9, 1890.95, 1966.97, 0.3250180710047479, 0.2716027475971414, 0.2069450998975543], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 100.0, 2.1272069772388855], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
