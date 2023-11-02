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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8925122314401192, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.184, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.628, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.957, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.998, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.587, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.099, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 321.3078919378817, 1, 19108, 9.0, 828.0, 1514.0, 5995.960000000006, 15.442328601978168, 97.27521922620826, 127.78658699203082], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6133.464000000001, 5121, 19108, 5979.5, 6407.3, 6560.7, 17701.360000000095, 0.3333122235591746, 0.19357823483679368, 0.1679581126528653], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.4939999999999998, 1, 8, 2.0, 3.0, 4.0, 7.0, 0.3344772455129878, 0.17171682884632108, 0.12085603597637254], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.7560000000000024, 2, 19, 4.0, 5.0, 5.0, 8.0, 0.33447321806048347, 0.19196606932258473, 0.14110588886926648], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.363999999999994, 8, 351, 11.0, 15.0, 18.0, 38.960000000000036, 0.33244172462788135, 0.1729443663344909, 3.6578329212718157], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 31.35999999999999, 20, 46, 32.0, 40.0, 41.0, 42.99000000000001, 0.3344591227404778, 1.3909808697325197, 0.13914022098383158], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.1940000000000004, 1, 12, 2.0, 3.0, 4.0, 7.990000000000009, 0.33446762453734763, 0.20894754305936197, 0.1414301576412808], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 27.303999999999988, 18, 43, 27.0, 35.0, 36.0, 39.99000000000001, 0.33446091255653226, 1.372697482236781, 0.12150337838967773], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 801.0459999999999, 603, 1093, 787.0, 942.0, 1020.4499999999998, 1082.0, 0.3342549857473674, 1.4136341887949038, 0.16255760049041892], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.502000000000001, 3, 15, 5.0, 8.0, 9.0, 11.0, 0.33442869879813014, 0.4973026601043953, 0.17080684518693562], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.9039999999999964, 2, 20, 4.0, 5.0, 5.949999999999989, 10.0, 0.33262705521941743, 0.32083893428786214, 0.18190542082311892], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.368000000000002, 5, 22, 7.0, 9.0, 10.0, 15.990000000000009, 0.334461807471743, 0.5450388308068088, 0.21851069257675396], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.9945222701149425, 2719.0575610632186], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.316000000000003, 2, 19, 4.0, 5.900000000000034, 6.0, 9.990000000000009, 0.33263059576135484, 0.33416056656803056, 0.19522557427009204], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.659999999999999, 5, 18, 7.0, 10.0, 11.0, 14.990000000000009, 0.33446046510072275, 0.5254393504025232, 0.19891252270150409], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.393999999999991, 4, 27, 6.0, 8.0, 8.0, 12.990000000000009, 0.33445822783963397, 0.5175969709372523, 0.1910723274279159], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1557.4879999999998, 1345, 1940, 1539.0, 1729.9, 1777.9, 1898.99, 0.3341064556717578, 0.5102007869125824, 0.18401957128796034], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 12.09400000000001, 8, 98, 11.0, 14.0, 16.94999999999999, 68.85000000000014, 0.3324218326681572, 0.1729340180475137, 2.680151025887018], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.648, 7, 24, 10.0, 13.0, 15.0, 19.0, 0.33446493971269464, 0.605469729877753, 0.2789385337057043], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.321999999999999, 5, 18, 7.0, 9.0, 10.0, 14.990000000000009, 0.334464044780722, 0.5662731045671734, 0.2397427820986816], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 51.0, 51, 51, 51.0, 51.0, 51.0, 51.0, 19.607843137254903, 9.248621323529413, 2674.1727941176473], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 1.1018222980997625, 4542.62080611639], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.414, 1, 21, 2.0, 3.0, 4.0, 6.0, 0.3326427669491469, 0.2795985897859377, 0.14065851375877012], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 559.8860000000004, 395, 701, 554.0, 654.0, 667.0, 691.96, 0.33253922965292215, 0.29282612184603163, 0.15392929185105966], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.3800000000000012, 1, 22, 3.0, 4.0, 5.0, 9.0, 0.33264055393966163, 0.30136129716344096, 0.16242214547835043], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 765.5360000000006, 606, 942, 751.5, 885.0, 902.95, 921.99, 0.33249345486634097, 0.31454075650739566, 0.1756630459791899], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 67.0, 67, 67, 67.0, 67.0, 67.0, 67.0, 14.925373134328359, 7.06914645522388, 982.7862639925372], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 26.071999999999996, 16, 1508, 22.0, 27.0, 30.0, 78.80000000000018, 0.33209109125796765, 0.1727619582265937, 15.148412961581709], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 31.216000000000026, 20, 240, 30.0, 36.0, 41.89999999999998, 114.92000000000007, 0.33256311715400466, 75.21600481098277, 0.10262689943424363], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 1.216737964037123, 0.9516386310904873], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.791999999999999, 1, 13, 3.0, 4.0, 4.0, 7.0, 0.33440566081902634, 0.3633755105956433, 0.1433633643550318], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.455999999999998, 2, 9, 3.0, 4.900000000000034, 5.0, 7.0, 0.334404542551306, 0.3431271454141433, 0.12311573490414295], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.903999999999999, 1, 12, 2.0, 3.0, 3.0, 5.990000000000009, 0.3344785880187094, 0.18968267660971164, 0.1296757807064723], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.23800000000008, 67, 119, 92.0, 111.0, 116.0, 117.99000000000001, 0.33445554316583576, 0.30463870084590494, 0.10908999161854407], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 82.33600000000001, 57, 377, 80.0, 94.90000000000003, 102.0, 292.8600000000001, 0.33250672162337763, 0.17297817937108348, 98.32002953158448], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 216.13800000000006, 12, 372, 268.0, 337.90000000000003, 340.0, 347.99, 0.3344002932021771, 0.1863726477865376, 0.1400954353356777], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 426.03, 326, 544, 417.0, 497.0, 508.9, 529.99, 0.33434617935933925, 0.17981228948728684, 0.14235833418034366], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.368000000000004, 4, 249, 6.0, 8.0, 11.0, 29.99000000000001, 0.33204058864155556, 0.1497133400211842, 0.24092398179753494], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 398.7000000000001, 289, 520, 400.0, 464.0, 475.9, 492.99, 0.33431667009898447, 0.17196087237093372, 0.1345102227351383], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.5039999999999982, 2, 10, 3.0, 5.0, 5.0, 9.0, 0.33264077523928515, 0.20423299003973727, 0.16632038761964257], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.142000000000001, 2, 24, 4.0, 5.0, 6.0, 8.0, 0.3326359067155863, 0.1948096480628948, 0.15689760053088692], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 611.3920000000002, 460, 892, 593.5, 741.0, 822.95, 856.95, 0.33250008811252335, 0.30383169672633714, 0.14644290990112113], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 247.62799999999996, 174, 326, 241.5, 290.0, 300.0, 318.95000000000005, 0.3325693107700576, 0.29447648414874894, 0.1367301560880803], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.536000000000003, 3, 51, 4.0, 6.0, 6.0, 9.0, 0.33263214477215364, 0.2217688394115205, 0.15559648178306795], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 998.8440000000008, 815, 9201, 941.0, 1093.0, 1112.0, 1163.96, 0.3324474716372439, 0.24989076503310842, 0.18375514545574226], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 135.63199999999995, 114, 177, 139.0, 152.0, 154.0, 167.0, 0.3344143835639344, 6.465794335948342, 0.16851349796776377], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 181.728, 156, 253, 180.0, 205.0, 207.0, 221.99, 0.33439559667878294, 0.6481233248870579, 0.23904060231334875], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.815999999999998, 4, 29, 6.0, 9.0, 10.0, 16.960000000000036, 0.33442556723592587, 0.272932412885484, 0.206403279778423], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.562000000000002, 4, 20, 6.0, 9.0, 9.0, 14.0, 0.33442713300969706, 0.27815911470282134, 0.2116296701076989], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 7.984000000000008, 5, 31, 8.0, 10.0, 11.0, 13.0, 0.334422212055787, 0.2706435853054211, 0.20411511966295592], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.542000000000016, 6, 35, 9.0, 12.0, 13.0, 16.99000000000001, 0.3344237777981405, 0.29905781012454613, 0.23252903300026956], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.430000000000006, 5, 30, 7.0, 9.0, 10.0, 22.930000000000064, 0.33449223743864576, 0.2511011014076771, 0.18455870522737777], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1618.9899999999993, 1381, 2067, 1602.5, 1790.9, 1863.0, 1946.98, 0.3340754262134288, 0.2791715653955988, 0.21271208778433162], "isController": false}]}, function(index, item){
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
