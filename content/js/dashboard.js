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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8695596681557115, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.459, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.997, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.779, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.815, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.499, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.835, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.488, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 490.9062752605841, 1, 26457, 12.0, 1020.0, 1827.9500000000007, 10508.0, 10.111386569858904, 63.78351668690665, 83.77404458850464], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11099.688000000007, 9079, 26457, 10621.0, 12753.6, 13058.85, 25247.350000000093, 0.21775163596804104, 0.12652560879002384, 0.11015170647602075], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.1060000000000008, 2, 21, 3.0, 4.0, 4.0, 8.0, 0.2185393963155132, 0.11219565042678559, 0.07939126506774503], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.566, 2, 17, 4.0, 5.0, 6.0, 11.990000000000009, 0.21853805905859924, 0.12536486977754135, 0.09262257581194537], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.45000000000002, 10, 452, 14.0, 19.900000000000034, 23.94999999999999, 41.0, 0.21735227543923633, 0.12771781020951456, 2.420166645076341], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.856, 27, 97, 46.0, 55.0, 57.0, 64.0, 0.21850014508409635, 0.9087194852256757, 0.09132623251561839], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.5279999999999996, 1, 17, 2.0, 3.0, 4.0, 6.990000000000009, 0.21850616078120322, 0.13651684518620003, 0.0928224413474838], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.37600000000002, 25, 78, 40.0, 49.0, 50.0, 57.950000000000045, 0.21849890379099968, 0.8967527881006372, 0.07980331056429091], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1148.3799999999999, 788, 1677, 1152.0, 1467.6000000000001, 1532.9, 1602.96, 0.21842741001882846, 0.9238370242104941, 0.10665400879825607], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.602000000000001, 4, 28, 6.0, 8.0, 9.0, 14.0, 0.21838676820777841, 0.3247458162281897, 0.11196587237215201], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.322000000000001, 2, 18, 4.0, 5.0, 6.0, 11.990000000000009, 0.217433372978685, 0.20972765314919628, 0.11933355040431737], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.337999999999996, 7, 29, 10.0, 12.0, 14.0, 20.0, 0.21849871282408273, 0.35612729658534586, 0.14317640264156206], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 551.0, 551, 551, 551.0, 551.0, 551.0, 551.0, 1.8148820326678765, 0.8613600272232305, 2146.627935004537], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.798000000000001, 3, 16, 4.0, 6.0, 7.0, 12.0, 0.21743469675035146, 0.21843481141997467, 0.12804015834029486], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 16.007999999999992, 8, 44, 17.0, 20.0, 21.0, 28.980000000000018, 0.21849785347708742, 0.34327378392834673, 0.13037323093212932], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.792000000000007, 5, 22, 7.0, 9.0, 10.0, 16.0, 0.21849766251200645, 0.33814006910097827, 0.12525207802201932], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2215.9519999999966, 1613, 3439, 2145.0, 2832.7000000000003, 3020.65, 3348.8, 0.21823435314246556, 0.3332570706566454, 0.12062562878773], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.143999999999995, 10, 86, 12.0, 18.0, 24.0, 46.99000000000001, 0.2173480237413593, 0.12771531188028645, 1.7527929492735794], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.662000000000003, 9, 28, 15.0, 17.0, 19.0, 25.0, 0.21850043153835227, 0.3955433935028897, 0.18265270448909138], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.209999999999983, 7, 20, 10.0, 12.0, 13.949999999999989, 19.0, 0.2184996676620055, 0.3698747010924546, 0.15704663613206643], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 85.0, 85, 85, 85.0, 85.0, 85.0, 85.0, 11.76470588235294, 6.0431985294117645, 1604.5266544117646], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 726.0, 726, 726, 726.0, 726.0, 726.0, 726.0, 1.3774104683195594, 0.6967759986225895, 2634.222193526171], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.8819999999999997, 2, 19, 3.0, 3.0, 4.0, 10.0, 0.2174537986786637, 0.18283957095930614, 0.09237539299337766], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 701.8819999999994, 541, 968, 679.0, 843.9000000000001, 872.0, 935.9100000000001, 0.21737183539213442, 0.19135089829997834, 0.10104393910806249], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.815999999999998, 2, 20, 4.0, 5.0, 6.0, 12.0, 0.2174387627212548, 0.19699229937903837, 0.10659595594342765], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 949.5800000000006, 741, 1361, 899.0, 1163.8000000000002, 1197.95, 1271.89, 0.2173627636719005, 0.20562644804356123, 0.11526169987679878], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 62.0, 16.129032258064516, 8.316532258064516, 1062.074722782258], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 30.144, 20, 654, 28.0, 35.0, 40.0, 85.86000000000013, 0.21728719543940253, 0.12767956871859656, 9.939191635138295], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 36.70399999999999, 26, 228, 35.0, 43.0, 48.0, 113.80000000000018, 0.21741843438724745, 49.2007767993767, 0.06751861536635223], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1048.0, 1048, 1048, 1048.0, 1048.0, 1048.0, 1048.0, 0.9541984732824427, 0.5003950978053435, 0.3932341364503817], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.1439999999999992, 2, 24, 3.0, 4.0, 4.0, 8.0, 0.2184996676620055, 0.23736660185602357, 0.09409995453021916], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.8059999999999987, 2, 13, 4.0, 5.0, 5.0, 8.990000000000009, 0.21849871282408273, 0.22425990935362403, 0.08087012906281969], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.1719999999999997, 1, 13, 2.0, 3.0, 3.9499999999999886, 7.0, 0.2185399694306291, 0.12392155305647816, 0.08515375761994239], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 204.1320000000001, 87, 399, 217.0, 303.90000000000003, 315.0, 330.99, 0.2185199121899585, 0.19903877665888298, 0.07170184618733012], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 114.57000000000001, 82, 412, 112.0, 130.0, 142.95, 301.99, 0.2173849718290815, 0.12779858695420612, 64.30689029928259], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 267.5300000000003, 17, 607, 339.5, 444.0, 461.6499999999999, 490.97, 0.2184962302845389, 0.12180012612148652, 0.09196472192640259], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 525.7539999999995, 314, 1092, 488.0, 889.5000000000002, 942.95, 1021.97, 0.218524209860162, 0.11751054024210734, 0.09347031632690522], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.816000000000004, 4, 273, 7.0, 10.0, 15.0, 39.0, 0.21726311910755264, 0.10220489951689372, 0.15806740599133468], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 537.2040000000002, 282, 1055, 470.5, 914.8000000000001, 950.0, 1030.99, 0.2184686397006455, 0.11237267306320997, 0.08832618831647193], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.159999999999999, 3, 23, 4.0, 5.0, 6.0, 12.0, 0.21745171810776992, 0.13350983368314068, 0.10915056944081422], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.480000000000002, 2, 39, 4.0, 5.0, 6.0, 10.980000000000018, 0.21744831362309336, 0.12734953922158723, 0.10299065635468778], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 864.8380000000002, 576, 1553, 857.0, 1171.9, 1264.95, 1367.94, 0.21735926748187986, 0.19861839860885722, 0.0961560040715738], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 486.9599999999999, 250, 1025, 389.0, 867.9000000000001, 906.8499999999999, 947.0, 0.21740179634756285, 0.1925003737952136, 0.08980562485841707], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.612000000000001, 3, 40, 5.0, 7.0, 7.949999999999989, 11.990000000000009, 0.21743564231141044, 0.14502787470575523, 0.10213529682791839], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1188.291999999999, 899, 11013, 1087.0, 1422.0, 1440.95, 1692.8700000000001, 0.21734736238108382, 0.16331192144848974, 0.12055986507075743], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 169.39200000000002, 143, 276, 169.0, 188.90000000000003, 191.0, 236.82000000000016, 0.21859920753415285, 4.226607138641301, 0.11058045849872185], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 230.79999999999995, 194, 363, 227.0, 258.0, 261.0, 281.9200000000001, 0.21858019051449407, 0.42365067374611476, 0.156677597497694], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.159999999999988, 6, 25, 9.0, 11.0, 12.0, 15.0, 0.21838505128117774, 0.178290920772524, 0.13521105714088544], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 9.010000000000003, 6, 20, 9.0, 11.0, 12.0, 15.980000000000018, 0.21838571897164785, 0.1815800477019926, 0.1386237473941124], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.184000000000005, 7, 21, 10.0, 12.0, 13.0, 18.99000000000001, 0.21838285746980748, 0.17673443145879314, 0.13371684729840752], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.25800000000001, 8, 24, 12.0, 15.0, 16.0, 20.0, 0.2183838112954222, 0.1953016661156115, 0.15227152467278462], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.564000000000005, 6, 34, 10.0, 12.0, 12.0, 19.980000000000018, 0.2183919191495644, 0.16394536344673988, 0.1209259942947295], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2011.936, 1594, 3138, 1949.0, 2467.5, 2585.95, 2695.59, 0.2181899745197748, 0.18233138974249655, 0.13935180013274678], "isController": false}]}, function(index, item){
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
