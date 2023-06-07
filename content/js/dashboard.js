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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8893639651138056, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.178, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.639, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.964, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.023, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 331.43186556052035, 1, 18023, 9.0, 850.0, 1529.9500000000007, 6323.990000000002, 14.949503686653824, 94.17078770464539, 123.70841876124553], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6464.242000000005, 5309, 18023, 6312.0, 6846.0, 7043.65, 15190.600000000068, 0.3223319296852235, 0.1872011932647454, 0.16242507394294467], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.3959999999999972, 1, 10, 2.0, 3.0, 4.0, 5.990000000000009, 0.3234144284232124, 0.16603730387340526, 0.11685872902010604], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.732, 2, 16, 4.0, 5.0, 5.0, 9.980000000000018, 0.3234121273079498, 0.18561771615249528, 0.1364394912080413], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 12.196000000000012, 8, 376, 11.0, 14.900000000000034, 16.0, 31.99000000000001, 0.32159821448671316, 0.16730330550704783, 3.538522541622849], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.907999999999966, 24, 63, 34.0, 40.0, 41.0, 45.0, 0.323363602322268, 1.3448357488729161, 0.13452431112234978], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.313999999999999, 1, 8, 2.0, 3.0, 4.0, 6.0, 0.3233717585214926, 0.20201576918338282, 0.13673825335918582], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.83399999999997, 22, 47, 30.0, 35.0, 36.0, 40.0, 0.32336820320457893, 1.3271706848534335, 0.11747360507041343], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 860.3059999999999, 657, 1091, 864.5, 996.7, 1059.9, 1076.99, 0.32322521880731186, 1.3669869993564585, 0.1571935146152747], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.479999999999998, 3, 17, 5.0, 7.0, 8.0, 12.0, 0.3233278453820377, 0.48079545257976825, 0.16513717103008374], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.9520000000000004, 2, 16, 4.0, 5.0, 5.0, 11.980000000000018, 0.32174204010192786, 0.31033967815339375, 0.1759526781807418], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.569999999999996, 5, 20, 7.0, 9.0, 10.0, 15.0, 0.32336987628515274, 0.526963424077927, 0.2112641086277023], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 547.0, 547, 547, 547.0, 547.0, 547.0, 547.0, 1.8281535648994516, 0.7908906535648994, 2162.321826439671], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.027999999999996, 2, 13, 4.0, 5.0, 6.0, 9.0, 0.32174473159089256, 0.3232246316746749, 0.18883650750598283], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.867999999999995, 5, 16, 8.0, 9.0, 11.0, 13.0, 0.3233677849371405, 0.5080126848693626, 0.19231541115890485], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.537999999999995, 4, 25, 6.0, 8.0, 8.949999999999989, 12.0, 0.32336757580382713, 0.5004334287617996, 0.18473635922386608], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1582.2020000000014, 1343, 1981, 1552.5, 1806.0, 1858.85, 1927.99, 0.32304270043022826, 0.49330576278296123, 0.17792586234633667], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 10.646000000000004, 7, 69, 10.0, 13.0, 15.0, 38.99000000000001, 0.32158994066665597, 0.1672990012622405, 2.5928188966249133], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.820000000000006, 8, 26, 11.0, 13.0, 14.0, 19.99000000000001, 0.32337196766021625, 0.5853885255580268, 0.26968716834162565], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.518000000000009, 5, 16, 7.0, 9.0, 10.0, 13.0, 0.3233715493830394, 0.5474926649227239, 0.23179171606167082], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 62.0, 16.129032258064516, 7.60773689516129, 2199.7227822580644], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.9786227584388186, 4034.6906315928272], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2819999999999965, 1, 15, 2.0, 3.0, 3.0, 5.0, 0.32175798265467065, 0.2704495246588883, 0.1360558657123754], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 556.7259999999999, 445, 688, 545.0, 643.0, 656.0, 671.97, 0.321649728591959, 0.28323708668813996, 0.14888864389901227], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.285999999999999, 2, 18, 3.0, 4.0, 5.0, 8.990000000000009, 0.32174907947588366, 0.2914939829302461, 0.1571040427128338], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 756.7599999999999, 609, 937, 737.5, 878.9000000000001, 893.95, 914.0, 0.32160793676930677, 0.3042429926052687, 0.16991200565644038], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 78.0, 78, 78, 78.0, 78.0, 78.0, 78.0, 12.82051282051282, 6.072215544871795, 844.1882011217949], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 21.867999999999984, 15, 637, 20.0, 24.0, 26.94999999999999, 50.0, 0.3214596841337144, 0.16723123860827244, 14.66345883387285], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 29.420000000000016, 20, 263, 28.0, 34.0, 39.0, 94.97000000000003, 0.32171347168728426, 72.76213382069975, 0.09927876665349786], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 1.2426873518957346, 0.9719342417061612], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.6839999999999975, 1, 12, 3.0, 4.0, 4.0, 6.0, 0.3233600471846981, 0.35137300595984905, 0.13862798897859616], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.348000000000001, 2, 12, 3.0, 4.0, 5.0, 7.0, 0.32335921069310103, 0.33179370729233226, 0.11904924065556553], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8219999999999998, 1, 13, 2.0, 2.0, 3.0, 5.0, 0.32341505600578524, 0.18340855192687455, 0.12538650120536793], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.95400000000002, 66, 126, 92.0, 110.0, 113.0, 118.0, 0.32339351039774816, 0.2945628526201989, 0.10548186764926551], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 81.09999999999997, 58, 412, 78.0, 90.0, 100.94999999999999, 298.8600000000001, 0.3216590401308252, 0.16733494850399597, 95.11244214962163], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 203.42199999999994, 12, 358, 260.0, 333.0, 337.0, 348.97, 0.32335440095040324, 0.18021639664687955, 0.135467810554417], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 421.91, 332, 552, 411.0, 495.90000000000003, 507.0, 537.98, 0.3233073566649165, 0.17387558045794546, 0.13765821045498397], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.131999999999997, 4, 276, 6.0, 8.0, 10.0, 28.940000000000055, 0.32140533841410895, 0.1449180261710725, 0.233207193790706], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 392.0260000000003, 286, 495, 390.5, 455.90000000000003, 464.0, 480.95000000000005, 0.3232943957563084, 0.1662913976453176, 0.13007547954257723], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.4699999999999998, 2, 11, 3.0, 4.0, 5.0, 8.990000000000009, 0.32175591210400695, 0.1975499604481545, 0.16087795605200347], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.131999999999999, 2, 42, 4.0, 5.0, 5.0, 9.0, 0.3217478372110383, 0.18843300337288257, 0.15176191930950342], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 673.5400000000001, 531, 867, 675.0, 819.0, 840.0, 852.99, 0.3215978007855991, 0.29386941227841107, 0.14164121890068868], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 239.56199999999993, 164, 325, 233.5, 282.0, 289.95, 299.97, 0.32171285069113575, 0.28486353403335907, 0.1322667091220392], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.417999999999998, 3, 57, 4.0, 5.0, 6.0, 11.0, 0.32174659495578556, 0.2145113455490863, 0.15050451072638799], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1006.7719999999993, 833, 8749, 956.0, 1122.0, 1146.95, 1179.92, 0.3215192168820738, 0.24167632463505961, 0.17771472339380254], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.55400000000017, 119, 171, 133.0, 148.0, 150.95, 164.98000000000002, 0.32340459661421256, 6.2529236533513455, 0.16296559751263057], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.834, 161, 292, 181.5, 201.90000000000003, 205.0, 212.0, 0.3233677849371405, 0.6267492934009689, 0.23115744001365904], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.820000000000003, 4, 17, 7.0, 9.0, 9.0, 13.990000000000009, 0.32332240934686285, 0.2638708698391277, 0.19955054951876694], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.695999999999999, 4, 29, 6.0, 8.0, 9.0, 15.980000000000018, 0.32332491826346066, 0.26892486927165243, 0.2046040498385962], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.325999999999995, 6, 25, 8.0, 10.0, 11.0, 17.99000000000001, 0.3233163462924991, 0.2616557513047431, 0.19733663714141794], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.540000000000003, 7, 21, 9.0, 12.0, 12.949999999999989, 16.0, 0.32331948232671043, 0.2891278155872969, 0.22480807755529086], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.648, 5, 30, 7.0, 9.0, 10.949999999999989, 18.980000000000018, 0.3233370452426127, 0.2427269727035633, 0.17840374078327753], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1657.8440000000016, 1473, 2055, 1629.5, 1863.0, 1948.75, 2027.96, 0.32297676053017277, 0.26989691772780683, 0.205645359243821], "isController": false}]}, function(index, item){
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
