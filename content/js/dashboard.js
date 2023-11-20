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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8606041267815359, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.442, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.969, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.567, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.693, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.282, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 498.37030419059994, 1, 28757, 15.0, 1246.7000000000044, 2357.9500000000007, 9753.970000000005, 9.954536503143482, 62.70625834110645, 82.37463905937994], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 9992.286000000004, 8561, 28757, 9746.0, 10521.2, 10797.6, 27485.480000000145, 0.214577631826841, 0.12463272356092438, 0.10812700978774409], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.6000000000000014, 2, 13, 3.0, 4.0, 5.0, 8.0, 0.21536286704831836, 0.11056485628512837, 0.07781666094519317], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 5.242000000000003, 3, 17, 5.0, 7.0, 7.0, 10.990000000000009, 0.21536156838354345, 0.12360365952606671, 0.09085566166180739], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 20.525999999999996, 13, 536, 18.0, 23.900000000000034, 30.0, 86.99000000000001, 0.21402286363447634, 0.11133996063156434, 2.354878520087544], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 53.53400000000005, 31, 80, 56.0, 68.0, 69.0, 73.0, 0.21531603225950924, 0.8954770895936469, 0.08957483373295988], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.449999999999998, 2, 12, 3.0, 4.0, 5.0, 8.0, 0.21532103936326985, 0.13451467001081774, 0.09104883793388266], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 47.007999999999974, 28, 69, 49.0, 60.0, 62.0, 66.0, 0.21531482688041975, 0.8836970469517664, 0.07821983945265248], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1244.9339999999995, 850, 1773, 1224.5, 1561.2000000000003, 1686.9, 1756.98, 0.21523622821755561, 0.910291181255163, 0.10467543130111591], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 9.00999999999999, 6, 36, 9.0, 11.0, 13.0, 19.970000000000027, 0.21528942433760825, 0.3201399993487495, 0.10995739153180578], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 5.490000000000005, 3, 21, 5.0, 6.0, 7.0, 16.0, 0.2141690839217272, 0.20657904871125898, 0.11712371776969457], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.390000000000017, 8, 35, 13.0, 15.0, 16.0, 22.99000000000001, 0.21531454871793104, 0.35087650448349483, 0.14066936825419518], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 616.0, 616, 616, 616.0, 616.0, 616.0, 616.0, 1.6233766233766236, 0.7023006290584416, 1920.1136997767858], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 6.16, 4, 40, 6.0, 7.0, 9.0, 15.990000000000009, 0.2141705517204749, 0.21515565259801728, 0.12569970857813026], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 12.74200000000001, 8, 31, 13.0, 15.0, 17.0, 23.99000000000001, 0.21531315791626815, 0.33825823268699196, 0.12805245426856182], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 9.668000000000006, 7, 25, 10.0, 11.0, 13.0, 17.99000000000001, 0.21531223072514144, 0.33321039565667865, 0.12300552243574976], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2352.8359999999975, 1940, 3012, 2294.0, 2744.6000000000004, 2824.1499999999996, 2975.8500000000004, 0.21509428442863646, 0.3284741786839844, 0.11846989884545993], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.290000000000006, 13, 89, 17.0, 22.0, 26.0, 64.94000000000005, 0.21401828315389326, 0.11133757775284228, 1.7255224079282647], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.747999999999998, 12, 44, 17.0, 21.0, 24.0, 29.0, 0.21531621770364393, 0.3897791268744353, 0.1795703612489374], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.533999999999994, 8, 44, 13.0, 15.0, 16.0, 23.0, 0.21531584681569396, 0.364546129670739, 0.15433772613546812], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 84.0, 84, 84, 84.0, 84.0, 84.0, 84.0, 11.904761904761903, 5.615234375, 1623.6049107142856], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 726.0, 726, 726, 726.0, 726.0, 726.0, 726.0, 1.3774104683195594, 0.6389355199724518, 2634.21950327135], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 3.5839999999999974, 2, 29, 3.0, 4.0, 5.0, 10.990000000000009, 0.21416192869093092, 0.18001104848004998, 0.09055870617497373], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 783.7640000000009, 570, 981, 756.5, 955.0, 963.0, 974.99, 0.21410901317584044, 0.18853929518631551, 0.09910905492709803], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 4.669999999999994, 3, 20, 4.0, 6.0, 6.949999999999989, 13.990000000000009, 0.2141702765066772, 0.19403115939258742, 0.10457533032552598], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1049.9619999999989, 806, 1364, 988.0, 1317.0, 1340.95, 1354.0, 0.21408921097421293, 0.20254177415729135, 0.11310767884477463], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 92.0, 92, 92, 92.0, 92.0, 92.0, 92.0, 10.869565217391305, 5.148182744565218, 715.7247792119565], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 37.12600000000001, 25, 1292, 34.0, 41.0, 44.0, 131.72000000000025, 0.21390118107676143, 0.11127665837050937, 9.757152507905788], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 47.18399999999997, 31, 489, 45.0, 54.0, 60.0, 185.59000000000037, 0.21410048677886676, 48.423238816755465, 0.06607007209191591], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 601.0, 601, 601, 601.0, 601.0, 601.0, 601.0, 1.663893510815308, 0.8725691555740432, 0.6824563227953411], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 4.154, 3, 16, 4.0, 5.0, 6.0, 9.0, 0.21534366695809842, 0.2339990738876423, 0.09232018534629416], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 5.026000000000003, 3, 14, 5.0, 6.0, 7.0, 11.0, 0.2153430177395271, 0.22096002164951029, 0.07928156024199387], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.8380000000000023, 1, 12, 3.0, 4.0, 5.0, 9.990000000000009, 0.21536342362373082, 0.12213251341068038, 0.08349538982287219], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 129.74000000000004, 82, 176, 135.0, 162.0, 167.0, 172.99, 0.2153536839693302, 0.1961548189209316, 0.07024231488843387], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 122.216, 83, 516, 120.5, 139.0, 151.0, 442.7600000000002, 0.2140632719656745, 0.11136098203987743, 63.29708800633457], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 270.1140000000001, 16, 536, 284.0, 490.0, 503.0, 521.97, 0.2153405136474204, 0.12001658646847588, 0.09021589878392905], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 581.6540000000005, 456, 743, 555.5, 702.0, 713.0, 736.95, 0.2153031446746705, 0.11579061992557402, 0.09167204206851205], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 10.920000000000005, 7, 381, 9.0, 13.0, 17.0, 41.0, 0.21386934123110035, 0.09643126322247202, 0.15518058645967536], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 547.7380000000003, 394, 716, 547.0, 648.0, 660.95, 679.99, 0.21530147589161722, 0.11074359410827513, 0.08662520319076789], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 5.242, 4, 31, 5.0, 6.0, 8.0, 14.990000000000009, 0.21416064446934419, 0.13148919803156386, 0.10708032223467209], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 5.738000000000003, 4, 55, 5.0, 7.0, 7.0, 13.0, 0.21415587463829072, 0.1254213081829388, 0.10101297602567814], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 952.2059999999997, 683, 1437, 922.5, 1200.2000000000003, 1342.95, 1406.98, 0.21407628651285143, 0.19561847856732442, 0.09428555197001562], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 330.7280000000004, 215, 416, 331.0, 399.0, 404.0, 411.0, 0.2141158897971209, 0.18959083831830809, 0.08803006797323036], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.829999999999995, 4, 66, 7.0, 8.0, 9.0, 16.980000000000018, 0.21417385434121836, 0.14279163290751287, 0.100184840067816], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1573.779999999999, 1256, 13153, 1466.0, 1770.0, 1802.0, 3681.320000000017, 0.21405319136184064, 0.1608973456280492, 0.11831455694414239], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 171.95199999999997, 130, 258, 175.0, 207.0, 209.0, 213.99, 0.21535405498764298, 4.163801251976951, 0.10851825427111698], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 232.476, 176, 292, 217.5, 282.90000000000003, 284.95, 289.0, 0.21534338872108852, 0.4173771260045231, 0.15393687553109062], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 11.129999999999995, 7, 26, 11.0, 13.0, 14.0, 19.0, 0.21528636531168296, 0.17570016440881503, 0.13287205359080437], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 11.245999999999995, 7, 40, 11.5, 14.0, 15.0, 23.99000000000001, 0.21528784846491153, 0.17906524747661112, 0.13623684160670183], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.546000000000019, 8, 29, 13.0, 15.0, 16.94999999999999, 22.99000000000001, 0.21528293559810982, 0.17422570464795858, 0.1313982761218932], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 15.418000000000001, 11, 31, 15.0, 18.0, 20.0, 25.99000000000001, 0.21528432600936057, 0.19251758805667143, 0.1496898829283835], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 11.501999999999999, 8, 41, 12.0, 13.900000000000034, 14.0, 34.840000000000146, 0.21526421314256905, 0.1615974153172112, 0.11877371135307765], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2655.2179999999985, 2259, 3289, 2600.0, 3053.7000000000003, 3174.0, 3267.9700000000003, 0.21505274598700821, 0.179721931960752, 0.1369281156089154], "isController": false}]}, function(index, item){
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
