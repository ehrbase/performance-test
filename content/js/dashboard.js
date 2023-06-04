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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8893001489044884, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.157, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.633, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.973, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.039, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 332.26955966815405, 1, 18750, 9.0, 846.0, 1540.0, 6294.0, 14.909997659311152, 93.92192902733277, 123.38150301363689], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6457.6479999999965, 5293, 18750, 6275.0, 6841.7, 7052.9, 16151.170000000075, 0.3214592707889318, 0.18669437786219298, 0.16198533567098516], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.361999999999998, 1, 10, 2.0, 3.0, 4.0, 5.0, 0.32262727000547176, 0.16563318565876617, 0.11657430654494584], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.6420000000000003, 2, 12, 3.0, 5.0, 5.0, 7.0, 0.32262498007790746, 0.18516594437654982, 0.13610741347036723], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 12.405999999999995, 8, 385, 11.0, 14.0, 17.0, 41.950000000000045, 0.32077211130279026, 0.16687354630088808, 3.529432986375525], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.058000000000014, 24, 72, 34.0, 40.0, 42.0, 47.97000000000003, 0.3225510953190095, 1.341456616353534, 0.1341862955135723], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.233999999999998, 1, 7, 2.0, 3.0, 3.0, 6.0, 0.3225594186705133, 0.2015082868337051, 0.13639475418391822], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.963999999999995, 21, 54, 30.0, 36.0, 37.0, 39.0, 0.32255234379435094, 1.323822227331989, 0.11717721864404156], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 859.3340000000002, 671, 1117, 859.5, 1021.9000000000001, 1060.0, 1085.95, 0.3224113272126767, 1.36354488171212, 0.15679769624210252], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.574000000000001, 3, 20, 5.0, 7.0, 8.0, 12.0, 0.32250823686036945, 0.47957667709927065, 0.1647185623808332], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.8560000000000008, 2, 22, 4.0, 5.0, 5.949999999999989, 9.0, 0.32086536104412156, 0.3094940681219622, 0.17547324432100397], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.853999999999997, 5, 22, 8.0, 10.0, 12.0, 15.990000000000009, 0.3225515114763828, 0.5256298171052292, 0.21072945427509773], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 525.0, 525, 525, 525.0, 525.0, 525.0, 525.0, 1.9047619047619047, 0.824032738095238, 2252.933407738095], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.9880000000000058, 2, 17, 4.0, 5.0, 6.0, 9.990000000000009, 0.3208692733658609, 0.32234514668378395, 0.1883226887625805], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.017999999999999, 5, 22, 8.0, 10.0, 11.0, 14.0, 0.3225498468533327, 0.5067276993470946, 0.19182896165398403], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.563999999999993, 4, 17, 6.0, 8.0, 9.0, 11.990000000000009, 0.3225483903222581, 0.4991656832300641, 0.1842683675180869], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1593.6120000000014, 1325, 2009, 1569.0, 1799.9, 1857.6499999999999, 1939.0, 0.3222224585186918, 0.4920532037209605, 0.17747408848099822], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 10.82599999999999, 7, 64, 10.0, 13.0, 18.0, 32.99000000000001, 0.3207632625986187, 0.16686894298721694, 2.5861538047013632], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.986000000000002, 8, 31, 11.0, 13.0, 15.0, 22.970000000000027, 0.3225552569410666, 0.5839100638127193, 0.26900604436295983], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.645999999999996, 5, 19, 7.0, 9.0, 10.0, 14.0, 0.32255317611661455, 0.5461070966456405, 0.23120510866171395], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 59.0, 59, 59, 59.0, 59.0, 59.0, 59.0, 16.949152542372882, 7.994570974576272, 2311.573093220339], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 571.0, 571, 571, 571.0, 571.0, 571.0, 571.0, 1.7513134851138354, 0.812376860770578, 3349.2878447898424], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2839999999999985, 1, 21, 2.0, 3.0, 3.0, 6.990000000000009, 0.3209401234849219, 0.2697620836764718, 0.13571003268454218], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 555.2299999999994, 442, 698, 547.0, 639.9000000000001, 652.0, 676.99, 0.3208110102338712, 0.2824985312870938, 0.14850040903403805], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.327999999999999, 2, 13, 3.0, 4.0, 5.0, 8.990000000000009, 0.32090469451477605, 0.29072899819170206, 0.156691745368543], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 758.1279999999996, 610, 921, 741.5, 873.9000000000001, 889.0, 911.99, 0.3207284898627346, 0.3034110306786422, 0.16944737599193305], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 58.0, 17.241379310344826, 8.16608297413793, 1135.2875808189654], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 22.039999999999978, 15, 563, 20.0, 24.0, 28.0, 64.85000000000014, 0.32064868511593697, 0.1668093369610457, 14.626464923599038], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.04800000000003, 20, 302, 28.0, 34.900000000000034, 37.0, 108.95000000000005, 0.32088966016501425, 72.5758118618708, 0.09902454356654738], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 1.2252665011682242, 0.9583089953271028], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.681999999999999, 1, 7, 3.0, 4.0, 4.0, 5.990000000000009, 0.3225764828840918, 0.3505215608105057, 0.1382920663926917], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.4120000000000017, 2, 19, 3.0, 4.0, 5.0, 8.980000000000018, 0.3225756504415416, 0.33098970866741423, 0.11876076193013786], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8440000000000023, 1, 9, 2.0, 3.0, 3.0, 6.0, 0.32262810271446385, 0.1829622710227698, 0.12508140310316615], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.66200000000003, 67, 122, 91.0, 110.0, 113.0, 116.0, 0.3226079107331007, 0.29384728947252964, 0.10522562713364808], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 81.35600000000004, 57, 364, 79.0, 91.0, 99.94999999999999, 305.63000000000034, 0.32083900683643757, 0.16690834700374868, 94.86996375000481], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 202.30999999999986, 12, 349, 260.5, 333.0, 338.0, 343.0, 0.32257252882024257, 0.17978063273730532, 0.1351402488905118], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 423.4619999999999, 328, 556, 414.0, 491.0, 501.95, 531.8800000000001, 0.3225242554366301, 0.17345442647608064, 0.13732478063512768], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.162000000000006, 4, 282, 6.0, 8.0, 11.0, 23.0, 0.32059337987494296, 0.14455192326373037, 0.2326180480928541], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 395.2299999999995, 296, 494, 398.0, 454.0, 463.0, 478.99, 0.3225148937377928, 0.16589044890686802, 0.12976185177731508], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.5179999999999985, 2, 20, 3.0, 5.0, 5.0, 10.0, 0.32093641543550105, 0.1970468103012245, 0.16046820771775053], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.176000000000003, 2, 51, 4.0, 5.0, 6.0, 9.0, 0.3209267337104008, 0.18795212057955515, 0.15137462146691757], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 672.0679999999995, 536, 855, 679.0, 796.8000000000001, 829.95, 845.99, 0.3207883694968755, 0.2931297707245326, 0.14128472133114342], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 242.7879999999999, 176, 313, 238.0, 283.0, 289.95, 300.98, 0.3208968682391041, 0.2841410150401153, 0.1319312319615848], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.457999999999999, 3, 42, 4.0, 5.0, 6.0, 12.970000000000027, 0.3208717443550638, 0.21392807479359924, 0.15009527885358942], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1013.0240000000003, 810, 8850, 959.0, 1125.9, 1150.95, 1178.92, 0.32065362033970046, 0.24102568174967853, 0.1772362784299516], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.14000000000004, 117, 173, 133.0, 149.0, 150.0, 154.99, 0.3225866806540251, 6.2371095118473185, 0.16255344454831736], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 182.972, 161, 220, 184.0, 201.90000000000003, 203.0, 208.0, 0.32257065587646316, 0.6252043031489992, 0.23058761728669047], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.865999999999996, 5, 19, 7.0, 8.900000000000034, 10.0, 12.990000000000009, 0.32250490852470776, 0.2632036885773276, 0.19904599823009306], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.791999999999993, 5, 19, 7.0, 8.0, 9.0, 14.0, 0.3225061566425303, 0.2682438658925874, 0.2040859272503512], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.177999999999997, 5, 18, 8.0, 10.0, 11.0, 14.0, 0.32250407645152634, 0.2609983917931098, 0.19684086697480857], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.672, 7, 18, 9.0, 12.0, 13.0, 16.0, 0.32250449248758034, 0.2883990125154318, 0.22424140493277073], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.772000000000005, 5, 28, 8.0, 9.0, 10.0, 23.910000000000082, 0.3224824440557456, 0.24208542926766818, 0.17793220790185182], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1679.5360000000007, 1430, 2132, 1658.0, 1898.0, 1978.95, 2025.95, 0.3221908981071285, 0.2692402084172372, 0.2051449859041482], "isController": false}]}, function(index, item){
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
