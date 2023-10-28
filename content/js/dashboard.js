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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8948096149755371, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.196, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.658, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.98, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.609, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.118, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 319.80391406083896, 1, 19754, 9.0, 821.0, 1503.0, 5955.990000000002, 15.47445447692657, 97.4775884160492, 128.05243134877267], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6118.065999999999, 4954, 19754, 5945.0, 6450.6, 6649.3, 19144.01000000011, 0.3342201307469152, 0.1941055214418925, 0.1684156127591877], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.376, 1, 7, 2.0, 3.900000000000034, 4.0, 6.0, 0.33529638188380234, 0.1721373641798181, 0.12115201298535827], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.618, 2, 12, 3.0, 5.0, 5.0, 7.0, 0.335294583114833, 0.19243747992423682, 0.1414524022515702], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.410000000000018, 7, 380, 11.0, 15.900000000000034, 19.0, 64.97000000000003, 0.33302805761385396, 0.17324939118308216, 3.6642843018899343], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 31.79599999999999, 20, 62, 31.0, 40.0, 42.0, 47.99000000000001, 0.33520691652543283, 1.3940908666758067, 0.13945131488265075], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2740000000000005, 1, 7, 2.0, 3.0, 4.0, 6.0, 0.335212984273818, 0.20941318180644938, 0.1417453341704719], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 27.51200000000002, 17, 55, 27.0, 35.0, 36.0, 38.0, 0.3352116358663042, 1.3757786075895266, 0.12177610209205582], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 803.7380000000005, 605, 1092, 784.0, 987.6000000000001, 1055.6999999999998, 1078.98, 0.3350739307120723, 1.4170976781973423, 0.16295587645958204], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.442000000000001, 3, 16, 5.0, 7.0, 8.0, 11.990000000000009, 0.3351480482988555, 0.49837234826674837, 0.17117424732451314], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.7939999999999965, 2, 13, 4.0, 5.0, 5.949999999999989, 9.0, 0.3331008289547229, 0.3212959177410834, 0.1821645158346141], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.2840000000000025, 5, 24, 7.0, 10.0, 11.0, 17.0, 0.33521972647411197, 0.5462739353170073, 0.21900585645623136], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.9656633649553571, 2640.15633719308], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.994000000000004, 2, 19, 4.0, 5.0, 6.0, 10.0, 0.33310282617761844, 0.334634969059744, 0.19550273294213738], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.345999999999993, 5, 22, 7.0, 9.0, 11.0, 14.990000000000009, 0.33521837801235616, 0.5266300360275952, 0.19936327364211415], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.305999999999995, 4, 15, 6.0, 8.0, 8.949999999999989, 11.0, 0.3352177037855465, 0.5187723118808529, 0.19150620772904756], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1561.7379999999994, 1301, 1951, 1541.5, 1757.0, 1823.9, 1910.0, 0.3348578294113668, 0.5113481801062972, 0.18443341385547937], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.930000000000016, 7, 91, 11.0, 15.0, 19.94999999999999, 37.97000000000003, 0.33301009153781397, 0.17324004478819227, 2.684893863023625], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.642000000000005, 7, 20, 10.0, 13.0, 15.0, 18.99000000000001, 0.3352204007090582, 0.6068373134749885, 0.27956857637259347], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.308, 5, 24, 7.0, 9.900000000000034, 11.0, 14.990000000000009, 0.33522017596377474, 0.5675532922560117, 0.24028477456778385], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 89.0, 89, 89, 89.0, 89.0, 89.0, 89.0, 11.235955056179774, 5.299771769662922, 1532.3911516853934], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 1.010603894335512, 4166.543266612201], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3739999999999974, 1, 18, 2.0, 3.0, 4.0, 7.980000000000018, 0.3331678599628851, 0.28003994994985826, 0.14088055016008716], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 556.1740000000001, 436, 712, 545.5, 649.0, 662.0, 688.94, 0.33303293762359687, 0.2932608693208726, 0.15415782464217276], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.3260000000000027, 1, 19, 3.0, 4.0, 5.0, 8.990000000000009, 0.3331452173339454, 0.3018185054422603, 0.16266856315134054], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 760.4820000000002, 616, 936, 743.5, 882.0, 896.95, 919.0, 0.3329544311906384, 0.31497684281121413, 0.17590658913489782], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 93.0, 10.752688172043012, 5.092825940860215, 708.028813844086], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 25.684000000000005, 16, 1279, 22.0, 28.0, 32.0, 76.99000000000001, 0.33272865445863054, 0.1730936342936104, 15.177495556408818], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 31.057999999999993, 20, 220, 29.0, 37.0, 43.94999999999999, 111.99000000000001, 0.3331516546310079, 75.34911469424507, 0.10280851842128759], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 1.0446495268924303, 0.8170443227091634], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.5919999999999983, 1, 11, 2.0, 3.0, 4.0, 7.0, 0.33523545932956933, 0.3642771952642628, 0.14371910805242277], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3540000000000023, 2, 11, 3.0, 4.0, 5.0, 7.0, 0.3352341107412361, 0.3439783520477776, 0.1234211520990684], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.7699999999999998, 1, 8, 2.0, 3.0, 3.0, 5.0, 0.335297506124209, 0.19014708474745057, 0.12999327141729586], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 89.93599999999996, 65, 126, 89.0, 109.0, 112.0, 116.98000000000002, 0.3352736738417468, 0.30538389485247625, 0.10935684283510101], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 81.812, 55, 335, 79.0, 91.90000000000003, 104.94999999999999, 305.84000000000015, 0.3330939498147331, 0.1732836699275454, 98.4936690082061], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 211.90400000000017, 12, 374, 265.0, 337.0, 340.95, 363.9200000000001, 0.3352302897998809, 0.18683523309735356, 0.14044315851967668], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 413.20600000000013, 305, 544, 400.0, 488.0, 498.0, 517.99, 0.3352019725965683, 0.18027253743032828, 0.14272271489463262], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.265999999999994, 4, 267, 6.0, 8.0, 11.0, 29.970000000000027, 0.33267330948731055, 0.14999862668299427, 0.24138307514557783], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 387.13199999999995, 283, 490, 382.5, 453.90000000000003, 464.0, 477.99, 0.33517366017681083, 0.1724016782731719, 0.13485502733676374], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.2940000000000023, 2, 16, 3.0, 4.0, 5.0, 9.0, 0.3331656399612195, 0.20455524365236163, 0.16658281998060975], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.100000000000001, 1, 25, 4.0, 5.0, 5.949999999999989, 8.0, 0.33316097805402, 0.19511715834841442, 0.15714526601571452], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 606.4899999999997, 453, 869, 583.0, 756.9000000000003, 825.9, 841.0, 0.3330260612874521, 0.30431232012429865, 0.14667456410218838], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 239.98399999999987, 176, 321, 233.0, 283.0, 290.0, 299.0, 0.3331376704748744, 0.29497974335573574, 0.13696382741203333], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.330000000000002, 2, 37, 4.0, 5.0, 6.0, 10.990000000000009, 0.33310593301639413, 0.22208471829064694, 0.15581810733872345], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 996.4919999999998, 809, 9852, 933.0, 1086.9, 1110.9, 1149.8400000000001, 0.33288261027901556, 0.2502178456619737, 0.18399566154094024], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 133.84399999999994, 114, 167, 131.5, 152.0, 154.0, 157.99, 0.3352993049245409, 6.482904005275935, 0.16895941537213194], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 179.31199999999984, 155, 248, 172.0, 202.0, 205.95, 216.99, 0.33527547238637684, 0.6498286941405917, 0.23966957596369906], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.56, 4, 27, 6.0, 9.0, 10.0, 12.990000000000009, 0.3351442293190875, 0.2735189295744674, 0.2068468290328743], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.332000000000001, 4, 18, 6.0, 8.0, 9.0, 12.990000000000009, 0.33514580182962794, 0.2787568660901489, 0.21208445272031146], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 7.694000000000006, 5, 22, 8.0, 9.0, 10.0, 13.0, 0.335141308981519, 0.27122554117780723, 0.2045540215951654], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.043999999999999, 6, 18, 9.0, 11.0, 13.0, 17.0, 0.3351417582609092, 0.29969986275107147, 0.23302825379078843], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.231999999999992, 5, 41, 7.0, 9.0, 10.0, 13.0, 0.335079095420474, 0.2515416517975318, 0.1848825087036795], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1619.4480000000003, 1411, 2072, 1588.0, 1856.7, 1910.9, 1956.99, 0.3347638910276582, 0.27974688397585684, 0.21315044624026674], "isController": false}]}, function(index, item){
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
