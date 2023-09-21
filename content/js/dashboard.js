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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.892724952137843, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.216, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.645, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.981, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.12, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 322.95932780259625, 1, 18057, 9.0, 839.0, 1496.0, 6047.970000000005, 15.322386133256847, 96.51967061432958, 126.79405282776413], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6176.755999999996, 4922, 18057, 6035.0, 6492.8, 6689.0, 15793.690000000077, 0.330573704051908, 0.19198778079756856, 0.16657815555740677], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.359999999999999, 1, 19, 2.0, 3.0, 4.0, 5.0, 0.33164129942367376, 0.17026088625001906, 0.11983132889331961], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.4560000000000013, 2, 21, 3.0, 4.0, 5.0, 7.0, 0.3316395396577878, 0.19033972055886567, 0.13991043079312923], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.27599999999999, 8, 361, 11.0, 16.0, 19.94999999999999, 48.90000000000009, 0.3295739926570915, 0.17145250159019454, 3.626279468034619], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.074000000000005, 24, 56, 33.0, 39.0, 41.0, 44.0, 0.3315616887099929, 1.3789307415294276, 0.13793484315474314], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.221999999999999, 1, 30, 2.0, 3.0, 4.0, 6.990000000000009, 0.3315698239629491, 0.20713723836654116, 0.14020481814058294], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.56400000000001, 21, 65, 29.5, 35.0, 36.0, 40.98000000000002, 0.3315575113027956, 1.360781316725949, 0.1204486271529687], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 850.8859999999999, 673, 1091, 858.0, 991.9000000000001, 1054.9, 1073.0, 0.33142081428768383, 1.401647885394351, 0.1611792631985025], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.529999999999994, 3, 13, 5.0, 7.0, 8.0, 11.990000000000009, 0.3315045333244932, 0.49295436322122954, 0.1693133505163183], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.743999999999996, 2, 17, 4.0, 4.900000000000034, 5.0, 10.0, 0.32976353316563756, 0.3180768938896796, 0.18033943219995804], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.51, 5, 18, 7.0, 9.0, 10.0, 14.0, 0.3315528942909907, 0.5402984670237491, 0.2166102405084695], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.9243956997863247, 2527.32914329594], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.005999999999996, 2, 24, 4.0, 5.0, 6.0, 10.990000000000009, 0.329766360533562, 0.3312831569770318, 0.19354451433659253], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.798000000000002, 5, 23, 8.0, 9.900000000000034, 11.0, 13.990000000000009, 0.33155157516837847, 0.5208694672745333, 0.1971825285913501], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.4700000000000015, 4, 20, 6.0, 8.0, 9.0, 11.0, 0.3315504759075531, 0.5130970260502524, 0.18941116055265486], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1552.2039999999986, 1302, 1920, 1523.5, 1747.0, 1824.0, 1898.98, 0.33121225008379673, 0.5057811597446619, 0.18242549711646616], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.417999999999997, 7, 86, 10.0, 14.0, 16.0, 32.99000000000001, 0.32955683174607775, 0.1714435740619659, 2.657051955952752], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.784000000000008, 8, 31, 10.0, 13.0, 15.0, 20.99000000000001, 0.3315572914421748, 0.6002061198430407, 0.27651360048009493], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.518000000000002, 5, 19, 7.0, 9.0, 10.949999999999989, 13.0, 0.33155487299459035, 0.5613476551361828, 0.23765749685354426], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 79.0, 79, 79, 79.0, 79.0, 79.0, 79.0, 12.658227848101266, 5.970628955696203, 1726.3647151898733], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 1.0128104530567685, 4175.640522652839], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2899999999999983, 1, 16, 2.0, 3.0, 4.0, 7.0, 0.3297796280613443, 0.27719201530144494, 0.13944783100640828], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 553.662, 413, 734, 540.0, 640.9000000000001, 655.0, 686.94, 0.3296685183048445, 0.2902982418365833, 0.1526004664809534], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.125999999999999, 2, 16, 3.0, 4.0, 5.0, 8.990000000000009, 0.3297624457293455, 0.29875382668708117, 0.161016819203782], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 758.8620000000008, 593, 969, 738.0, 879.0, 891.95, 919.96, 0.32962309576737575, 0.3118253799812642, 0.17414657696303737], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 54.0, 54, 54, 54.0, 54.0, 54.0, 54.0, 18.51851851851852, 8.77097800925926, 1219.3829571759259], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 25.57799999999997, 17, 1358, 22.0, 26.0, 29.94999999999999, 57.97000000000003, 0.32926385163634253, 0.17129115859882427, 15.019447763606994], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.95799999999998, 22, 267, 29.0, 35.0, 40.0, 107.96000000000004, 0.3296952560808993, 74.56737890767181, 0.10174189543121502], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 1.2027845470183487, 0.9407253440366973], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.676, 1, 19, 2.0, 3.0, 4.0, 7.0, 0.33158169775134555, 0.36030690518056613, 0.142152700500821], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.2940000000000005, 2, 11, 3.0, 4.0, 5.0, 7.990000000000009, 0.33158015850857897, 0.3402290901821768, 0.12207589820091237], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.7739999999999991, 1, 9, 2.0, 3.0, 3.0, 5.0, 0.3316423992868362, 0.1880742750877526, 0.12857620362975974], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 90.81199999999997, 66, 127, 90.0, 110.0, 114.0, 118.99000000000001, 0.3316219430260237, 0.3020577172654322, 0.10816575094794133], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 84.46000000000001, 59, 349, 82.0, 94.0, 104.89999999999998, 306.94000000000005, 0.3296343958988207, 0.1714839248430281, 97.470701888871], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 207.4719999999999, 12, 369, 261.0, 335.0, 337.0, 346.99, 0.33157729995278334, 0.18479929771098927, 0.13891275554662508], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 413.46799999999996, 320, 551, 404.0, 487.0, 496.95, 515.97, 0.33153222924260134, 0.17829893942011035, 0.14116020698220136], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.050000000000005, 4, 252, 6.0, 8.0, 10.0, 27.99000000000001, 0.3292133381442376, 0.14843856479939058, 0.23887256859489114], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 387.75200000000024, 298, 496, 385.0, 455.0, 463.0, 479.98, 0.331515962825126, 0.1705202859175997, 0.1333833756679218], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.3820000000000014, 2, 25, 3.0, 4.0, 5.0, 10.0, 0.32977788799687635, 0.20247524996339464, 0.16488894399843818], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.075999999999999, 2, 23, 4.0, 5.0, 5.0, 9.990000000000009, 0.32977332041501317, 0.1931331620957886, 0.15554737671919078], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 669.8420000000001, 535, 875, 675.0, 808.0, 830.0, 844.0, 0.32961874976926686, 0.3011987894009773, 0.1451738829550189], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 242.19200000000004, 174, 323, 234.0, 283.0, 289.95, 304.98, 0.3297067785735434, 0.29194182929728274, 0.13555327517525564], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.458000000000005, 3, 39, 4.0, 5.0, 6.0, 10.0, 0.329768100476383, 0.21985935534788226, 0.15425675793768306], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 981.0539999999995, 817, 8601, 922.5, 1080.9, 1111.85, 1143.92, 0.3295941970327294, 0.24774604433404504, 0.1821780425005125], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.10799999999998, 117, 168, 134.0, 149.90000000000003, 151.0, 158.0, 0.3316217230799434, 6.411799145468853, 0.16710625889575273], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 181.4620000000001, 160, 255, 177.0, 202.0, 204.0, 211.99, 0.33159137331883176, 0.6426881977925962, 0.23703602077088362], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.927999999999999, 5, 17, 7.0, 9.0, 10.0, 15.0, 0.3315005771425048, 0.270545261058362, 0.2045980124551397], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.778000000000003, 5, 23, 7.0, 8.0, 9.0, 14.990000000000009, 0.33150233543395313, 0.2757264200316916, 0.20977882164179845], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.099999999999994, 5, 17, 8.0, 10.0, 10.0, 14.0, 0.3314959617161944, 0.2682754086267846, 0.20232907819591942], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.495999999999995, 7, 28, 9.0, 11.0, 12.0, 18.980000000000018, 0.3314972803963116, 0.2964407955387759, 0.23049420277556043], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.522000000000001, 5, 28, 7.0, 9.0, 10.0, 15.990000000000009, 0.33147156802625255, 0.24883350493892636, 0.18289202728011006], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1618.1199999999994, 1404, 1990, 1592.0, 1835.3000000000002, 1899.9, 1964.98, 0.3311613563839299, 0.27673641042118424, 0.21085664488508038], "isController": false}]}, function(index, item){
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
