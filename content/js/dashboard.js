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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8909593703467348, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.186, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.629, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.964, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.998, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.104, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 325.65764730908546, 1, 23730, 9.0, 844.0, 1512.0, 6070.980000000003, 15.22574326307014, 95.91089219584302, 125.99432482970228], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6254.5539999999955, 5368, 23730, 6033.5, 6547.7, 6773.9, 22115.010000000133, 0.3285433897398528, 0.19080863214080845, 0.1655550674860977], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.250000000000002, 1, 10, 2.0, 3.0, 3.0, 6.990000000000009, 0.3296987344843776, 0.16926359541580285, 0.11912942554611299], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.5919999999999974, 2, 12, 3.0, 4.900000000000034, 5.0, 8.0, 0.3296965604736025, 0.18922457573822357, 0.13909073644980105], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.665999999999993, 8, 380, 12.0, 15.0, 18.94999999999999, 88.55000000000041, 0.3274456423861357, 0.17034528140187338, 3.6028613796529205], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.569999999999986, 24, 59, 33.0, 40.0, 42.0, 46.0, 0.3296511302088999, 1.3709849264960392, 0.13714002096581188], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.3060000000000005, 1, 10, 2.0, 3.0, 4.0, 7.0, 0.3296598240275859, 0.20594402932488964, 0.13939717168353977], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.708000000000002, 21, 53, 30.0, 36.0, 37.0, 39.0, 0.3296537383063578, 1.3529678344897587, 0.11975702211910653], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 861.5319999999997, 674, 1094, 869.0, 1005.9000000000001, 1062.95, 1082.99, 0.32950101684013794, 1.3935286607810098, 0.16024561170545773], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.688000000000001, 3, 29, 5.0, 8.0, 9.0, 11.990000000000009, 0.3296289630466155, 0.49016534992257016, 0.16835541764978504], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.870000000000002, 2, 23, 4.0, 5.0, 5.0, 10.980000000000018, 0.3275640567891254, 0.31595536575311234, 0.17913659355655295], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.81, 5, 19, 7.0, 10.0, 12.0, 15.990000000000009, 0.32965221691115876, 0.537201123908027, 0.215368489368716], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.8994120322245323, 2459.022950233888], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.022000000000001, 2, 16, 4.0, 5.0, 6.0, 11.990000000000009, 0.3275683487738134, 0.3290750352217867, 0.19225447032525572], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.083999999999998, 5, 23, 8.0, 10.0, 11.949999999999989, 17.99000000000001, 0.32964917416288886, 0.5178807841480283, 0.19605112018085874], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.5639999999999965, 4, 14, 6.0, 8.0, 9.0, 12.0, 0.329647870145111, 0.5101526135719324, 0.1883242226903222], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1564.0760000000002, 1334, 1942, 1542.5, 1773.9, 1820.95, 1905.95, 0.3293341193440982, 0.5029131403901951, 0.18139105791999158], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.838000000000008, 8, 84, 11.0, 14.0, 17.0, 48.90000000000009, 0.3274364216700043, 0.1703404845584258, 2.63995614971441], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.993999999999994, 8, 37, 11.0, 13.0, 15.0, 19.99000000000001, 0.32965656379184166, 0.5967653016275144, 0.2749284233185867], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.764000000000003, 5, 22, 7.0, 10.0, 11.0, 15.0, 0.3296543903371705, 0.5581299932338436, 0.236295236823714], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 48.0, 48, 48, 48.0, 48.0, 48.0, 48.0, 20.833333333333332, 9.82666015625, 2841.30859375], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 1.0518530328798186, 4336.606257086168], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3219999999999983, 1, 28, 2.0, 3.0, 3.9499999999999886, 8.0, 0.3276078403108343, 0.2753665471034553, 0.1385294871626868], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 559.4080000000001, 440, 702, 555.0, 648.0, 662.95, 683.99, 0.32746858921292266, 0.2883610366984224, 0.15158213992863803], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.340000000000001, 2, 16, 3.0, 4.0, 5.0, 10.990000000000009, 0.3275722116561986, 0.29676954733942573, 0.1599473689727532], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 758.6599999999995, 617, 950, 735.5, 887.0, 903.0, 931.0, 0.32741326495198153, 0.30973486708167386, 0.17297907845607619], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 58.0, 17.241379310344826, 8.16608297413793, 1135.2875808189654], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 24.221999999999998, 17, 516, 22.0, 27.0, 33.89999999999998, 71.95000000000005, 0.32732752785229935, 0.17028383531464686, 14.931121900371975], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.253999999999998, 21, 267, 29.0, 34.0, 41.94999999999999, 104.0, 0.32756555897097245, 74.08570400205679, 0.10108468421369853], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 1.1891475340136055, 0.9300595238095238], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.6940000000000017, 1, 8, 3.0, 3.0, 4.0, 7.0, 0.3296513475487785, 0.358209327081056, 0.14132513825577517], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3480000000000008, 2, 9, 3.0, 4.0, 5.0, 7.0, 0.3296500435138057, 0.3382486300980379, 0.12136529922334449], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.7619999999999985, 1, 8, 2.0, 2.0, 3.0, 5.0, 0.32970069111858874, 0.1869731331440192, 0.12782341247468723], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.83199999999995, 66, 119, 90.5, 112.0, 115.0, 118.99000000000001, 0.3296835170110101, 0.30029210268685474, 0.10753349090007557], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 83.36800000000002, 58, 560, 79.0, 92.90000000000003, 101.0, 417.5600000000013, 0.3275129908027802, 0.1703803177056143, 96.84341648942755], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 199.05000000000013, 12, 348, 259.0, 331.0, 335.0, 341.0, 0.32964613147078875, 0.18372299188641977, 0.13810370156344567], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 420.0880000000002, 330, 542, 412.0, 495.0, 505.95, 520.99, 0.32959180713869485, 0.17725537510678774, 0.14033401163327242], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.412, 4, 301, 6.0, 8.0, 11.0, 30.0, 0.3272668959716718, 0.14756093607332088, 0.23746025752632044], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 395.52000000000015, 294, 511, 392.5, 462.0, 470.0, 492.98, 0.3295813789157564, 0.1695252032116387, 0.13260500792313634], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.4760000000000013, 2, 20, 3.0, 5.0, 5.0, 13.970000000000027, 0.327604191236981, 0.20114065534433823, 0.16380209561849052], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.188000000000002, 2, 25, 4.0, 5.0, 6.0, 9.990000000000009, 0.3275994690267806, 0.19186003668950255, 0.15452201517571781], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 680.5199999999999, 528, 866, 687.5, 814.9000000000001, 838.0, 850.0, 0.3274507890581664, 0.29921775178673526, 0.14421904869651667], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 241.8240000000002, 174, 316, 235.0, 282.0, 289.0, 307.98, 0.32756148165229876, 0.29004225686421464, 0.1346712732183767], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.536000000000001, 3, 51, 4.0, 5.0, 6.0, 10.990000000000009, 0.327571138624175, 0.21839462114268607, 0.15322907754001938], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 988.6859999999994, 824, 10174, 926.5, 1074.9, 1106.9, 1133.96, 0.3273980433383338, 0.24609526165815324, 0.18096415286083684], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 136.26800000000026, 119, 175, 140.0, 151.0, 152.0, 160.99, 0.32967373509132947, 6.3741354254785705, 0.16612465557336525], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.15399999999997, 160, 220, 178.0, 203.0, 206.0, 214.0, 0.3296519995701338, 0.6389293164715237, 0.23564967156771283], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.026000000000002, 5, 18, 7.0, 9.0, 10.0, 12.0, 0.3296257034212511, 0.26901513340446653, 0.2034408638303034], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.9280000000000035, 5, 18, 7.0, 9.0, 10.0, 15.0, 0.32962700726366073, 0.2741666194888013, 0.2085920905340353], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.325999999999995, 6, 22, 8.0, 10.0, 11.949999999999989, 15.980000000000018, 0.32962222655858575, 0.2667590189173492, 0.20118544101476182], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.651999999999989, 7, 18, 9.0, 12.0, 13.0, 16.0, 0.3296237476769766, 0.29476539256375417, 0.2291915120566478], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.719999999999997, 4, 32, 7.0, 9.0, 10.0, 16.980000000000018, 0.32959245892453976, 0.24742287021472947, 0.18185521415270017], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1609.7560000000003, 1359, 1974, 1583.0, 1794.0, 1845.0, 1934.91, 0.3293041868392923, 0.2751844587111824, 0.20967415021408065], "isController": false}]}, function(index, item){
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
