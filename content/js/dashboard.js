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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8778557753669433, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.095, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.514, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.847, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.846, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.841, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.121, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 357.4771325249951, 1, 23230, 10.0, 863.0, 1540.0, 6313.990000000002, 13.8583856351539, 87.29758647303937, 114.67932377173018], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6973.672000000004, 5130, 23230, 6345.0, 8526.300000000001, 8990.7, 21215.910000000105, 0.29907418594997326, 0.17372763841003788, 0.15070535151385372], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.429999999999998, 1, 7, 2.0, 3.0, 4.0, 5.0, 0.2998662596481969, 0.1539479407809117, 0.10835011334944614], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.8199999999999994, 2, 15, 4.0, 5.0, 5.0, 7.990000000000009, 0.2998639217523088, 0.17210256391899356, 0.12650509198925527], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 12.440000000000007, 8, 361, 11.0, 15.0, 20.0, 37.97000000000003, 0.2978961974741977, 0.1549729329653124, 3.2777309149822127], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.74800000000004, 24, 52, 35.0, 42.0, 43.0, 46.0, 0.29978391575352487, 1.2467702732995058, 0.12471479307715], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.319999999999998, 1, 7, 2.0, 3.0, 4.0, 5.990000000000009, 0.29979110555764743, 0.18728453919558852, 0.12676713740865364], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.59800000000002, 22, 47, 30.0, 36.0, 38.0, 41.99000000000001, 0.2997819386178494, 1.2303677258287322, 0.1089051573885156], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 933.4959999999999, 720, 1335, 927.5, 1162.3000000000002, 1217.9, 1277.95, 0.2996603050781634, 1.267326054497122, 0.14573323430559118], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.373999999999998, 4, 26, 5.0, 7.0, 8.0, 12.0, 0.29960266694310006, 0.4455156025204374, 0.15301972149535287], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.836, 2, 24, 4.0, 5.0, 5.0, 9.990000000000009, 0.29809475716902983, 0.2875304419955298, 0.16302057032681322], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.927999999999995, 5, 23, 8.0, 10.0, 11.0, 15.0, 0.29978391575352487, 0.488527752008852, 0.19585492152256653], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.8739741161616161, 2389.4748263888887], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.894000000000004, 2, 18, 4.0, 5.0, 6.0, 10.0, 0.29809866708162003, 0.2994698045054036, 0.17495829972270863], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 12.119999999999992, 6, 27, 13.0, 15.0, 16.0, 21.0, 0.29978319679207993, 0.4709611587025263, 0.17828903012341474], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.590000000000001, 4, 14, 6.0, 8.0, 9.0, 11.990000000000009, 0.2997833765321179, 0.46393526818770753, 0.1712629641321181], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1793.9320000000007, 1343, 2625, 1665.0, 2308.7000000000003, 2389.0, 2528.96, 0.29936373232332003, 0.45714654479619016, 0.1648839306937036], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.204000000000004, 7, 78, 10.0, 14.0, 18.94999999999999, 45.940000000000055, 0.297889630700267, 0.15496951676790943, 2.401735147520903], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.994000000000002, 8, 30, 11.0, 13.0, 15.0, 18.99000000000001, 0.2997848144601805, 0.5426895589970518, 0.2500158511220646], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.998000000000001, 5, 30, 8.0, 10.0, 11.0, 18.970000000000027, 0.2997858929152799, 0.5075603519591309, 0.2148855912107573], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 92.0, 92, 92, 92.0, 92.0, 92.0, 92.0, 10.869565217391305, 5.126953125, 1482.421875], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.9447396894093687, 3894.996658604888], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2659999999999982, 1, 21, 2.0, 3.0, 3.9499999999999886, 6.0, 0.29808196180854674, 0.250548950535385, 0.1260444233038093], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 594.1240000000001, 456, 740, 583.5, 688.0, 701.95, 723.0, 0.29797732988474235, 0.26239173645544045, 0.13793091246617958], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.359999999999997, 2, 19, 3.0, 4.0, 5.0, 9.0, 0.2980995557124222, 0.2700682996386437, 0.14555642368770613], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 791.4820000000001, 647, 965, 777.5, 914.0, 929.95, 953.0, 0.2979741334614225, 0.2818852761966939, 0.15742578730725543], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 58.0, 17.241379310344826, 8.16608297413793, 1135.2875808189654], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 22.53399999999999, 15, 663, 20.0, 25.0, 31.94999999999999, 72.97000000000003, 0.2977734289622775, 0.1549090657641551, 13.5830047527617], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 29.32400000000003, 20, 297, 28.0, 34.0, 38.0, 79.93000000000006, 0.2979927802309206, 67.3972104402292, 0.09195870952438565], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 994.0, 994, 994, 994.0, 994.0, 994.0, 994.0, 1.006036217303823, 0.5275795397384306, 0.4126320422535211], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.578, 1, 9, 2.0, 3.0, 4.0, 6.0, 0.2998103399789293, 0.3257831673808149, 0.12853197192456053], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.2980000000000023, 2, 12, 3.0, 4.0, 4.0, 6.0, 0.2998085422649096, 0.30762874359683906, 0.11037873089245208], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.747999999999998, 1, 12, 2.0, 3.0, 3.0, 5.0, 0.2998675185303133, 0.17005475262279124, 0.11625723130520936], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 145.38400000000004, 66, 256, 153.0, 199.90000000000003, 204.0, 227.95000000000005, 0.29983802749754584, 0.27310735022191013, 0.09779873162517608], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 79.28800000000003, 56, 290, 78.0, 91.90000000000003, 99.94999999999999, 214.82000000000016, 0.29794590136679705, 0.15499879015342427, 88.10062448716062], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 210.0219999999999, 14, 402, 260.0, 334.0, 339.0, 359.96000000000004, 0.29980350878034534, 0.16709068407815517, 0.12560127467457827], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 448.4259999999998, 298, 802, 416.5, 653.7, 706.0, 755.9300000000001, 0.2998396457574489, 0.1612545813623874, 0.1276660991701638], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.500000000000008, 4, 306, 6.0, 8.0, 12.0, 34.98000000000002, 0.2977223643681111, 0.13423964145742243, 0.21602316086475248], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 453.89000000000016, 276, 832, 410.0, 694.9000000000001, 723.8499999999999, 813.8800000000001, 0.29975551939837863, 0.1541838179905469, 0.12060475975794142], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.2600000000000016, 2, 12, 3.0, 4.0, 5.0, 8.990000000000009, 0.2980801847620217, 0.1830136650016901, 0.14904009238101085], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.084, 2, 29, 4.0, 5.0, 6.0, 9.990000000000009, 0.29807538684223706, 0.17456913109683395, 0.14059610531718797], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 754.6920000000007, 579, 1165, 748.5, 939.9000000000001, 1033.2499999999998, 1104.97, 0.29793613679320613, 0.2722478735925497, 0.131219919622789], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 423.788, 237, 830, 338.0, 735.8000000000001, 764.95, 803.98, 0.2979858540155382, 0.26385425165471543, 0.12251176224662262], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.477999999999996, 3, 52, 4.0, 5.0, 6.0, 11.0, 0.29810115526121705, 0.19874671846522024, 0.13944380211926075], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 984.1380000000001, 814, 9121, 930.5, 1075.9, 1100.0, 1137.8200000000002, 0.2979602830861058, 0.223967782709186, 0.16469289084642175], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.99199999999993, 118, 164, 133.0, 151.0, 152.0, 158.98000000000002, 0.29996790343433255, 5.799782743558939, 0.15115570133995662], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 183.00800000000007, 160, 280, 177.0, 203.0, 205.95, 213.0, 0.2999378528768839, 0.5813375546711722, 0.21440869951746], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.008000000000004, 5, 20, 7.0, 9.0, 10.0, 14.970000000000027, 0.29959997411456224, 0.24451044371804764, 0.18490935902383138], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.961999999999998, 5, 18, 7.0, 9.0, 10.0, 15.990000000000009, 0.2996010512401686, 0.24919258921070703, 0.18959129023791918], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.374, 5, 18, 8.0, 10.0, 12.0, 14.0, 0.29959674278421244, 0.24245978194600068, 0.18285934007825466], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.628000000000005, 7, 20, 9.0, 12.0, 13.0, 17.0, 0.29959764036898445, 0.267914604748323, 0.2083139843190595], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.926000000000004, 5, 39, 8.0, 9.0, 11.0, 17.970000000000027, 0.29958740822139746, 0.22489827790417038, 0.1652996930127828], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1615.784, 1399, 1974, 1588.5, 1804.8000000000002, 1865.6499999999999, 1946.99, 0.29932968111211755, 0.25013613420356456, 0.1905888203956061], "isController": false}]}, function(index, item){
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
