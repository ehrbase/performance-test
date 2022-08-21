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

    var data = {"OkPercent": 97.83024888321634, "KoPercent": 2.169751116783663};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9000638162093172, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.984, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.995, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.984, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.696, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.644, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 510, 2.169751116783663, 188.55073388640812, 1, 3764, 16.0, 548.0, 1212.0, 2238.970000000005, 26.099441035583183, 173.92621238905932, 216.18600864054721], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 24.395999999999994, 15, 61, 26.0, 29.0, 31.0, 38.98000000000002, 0.5657298933938588, 0.3284316167626899, 0.2850748290929992], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.48199999999999, 4, 30, 7.0, 9.900000000000034, 13.0, 22.99000000000001, 0.5654778061270651, 6.07107464921998, 0.20432303541700597], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.755999999999999, 5, 34, 7.0, 10.0, 11.0, 18.99000000000001, 0.5654605393362624, 6.071818082862587, 0.2385536650324857], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 22.31800000000001, 14, 239, 21.0, 28.0, 34.0, 49.99000000000001, 0.5619000312416417, 0.30338431335254284, 6.25552769155734], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.206000000000024, 25, 88, 46.0, 54.0, 56.94999999999999, 61.0, 0.5653710247349824, 2.351415636042403, 0.23520318021201414], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.4599999999999986, 1, 22, 2.0, 3.0, 4.0, 8.990000000000009, 0.5654176966692374, 0.3533220091948226, 0.23908775650173808], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.970000000000006, 23, 81, 40.0, 47.900000000000034, 50.0, 61.0, 0.5653435366534829, 2.320320043802817, 0.20537870667489808], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 774.9300000000006, 568, 1016, 764.0, 930.9000000000001, 951.95, 975.99, 0.5650592238572525, 2.389625525010651, 0.27480419285245283], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 11.233999999999991, 6, 34, 11.0, 14.0, 15.949999999999989, 27.99000000000001, 0.5650656097679502, 0.8402967074757051, 0.28860284561390426], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.3039999999999994, 1, 45, 3.0, 4.0, 5.0, 10.980000000000018, 0.5626854048408951, 0.5428078835179316, 0.30771858077236447], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 17.736000000000015, 11, 93, 18.0, 22.0, 23.0, 30.0, 0.5653115771288504, 0.9211034468601464, 0.3693295362296884], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 573.0, 573, 573, 573.0, 573.0, 573.0, 573.0, 1.7452006980802792, 0.744778032286213, 2064.206001854276], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.198000000000004, 2, 21, 4.0, 5.0, 7.0, 10.990000000000009, 0.562695536699003, 0.5653793306455243, 0.3302539233946296], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 18.84800000000001, 11, 62, 20.0, 23.0, 26.0, 34.97000000000003, 0.5652994334569077, 0.8881847790018396, 0.3361985888430243], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 10.794000000000011, 6, 45, 11.0, 14.0, 16.0, 20.980000000000018, 0.5652911249293385, 0.8749227141040136, 0.3229446368004522], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1979.6500000000026, 1465, 2574, 1971.0, 2221.7000000000003, 2296.7, 2409.95, 0.5641462492736616, 0.8615174335294682, 0.310721176357759], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 20.376000000000012, 12, 433, 17.0, 25.0, 31.0, 58.960000000000036, 0.5618634087578773, 0.3033008913401117, 4.5300237331103865], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 22.301999999999982, 14, 90, 23.0, 27.0, 29.0, 34.99000000000001, 0.5653448151096316, 1.0234552023595231, 0.4714887422886967], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 17.542000000000012, 10, 67, 18.0, 22.0, 24.0, 28.980000000000018, 0.5653371444594698, 0.9570627852125894, 0.40523189846997154], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 81.0, 12.345679012345679, 5.750868055555555, 1683.7384259259259], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 711.0, 711, 711, 711.0, 711.0, 711.0, 711.0, 1.4064697609001406, 0.6441741385372715, 2689.793754395218], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.106000000000001, 1, 20, 2.0, 3.0, 3.0, 7.990000000000009, 0.5627056689219909, 0.47284750838150097, 0.2379409713312716], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 408.028, 307, 524, 406.5, 487.0, 495.95, 509.98, 0.5625125862191167, 0.4951758744820665, 0.2603818026053333], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.0499999999999994, 1, 31, 3.0, 4.0, 5.0, 13.980000000000018, 0.5627664699235088, 0.5098477361452523, 0.2747883153923383], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1165.3719999999987, 924, 1490, 1157.0, 1347.8000000000002, 1388.95, 1453.95, 0.5620926935819132, 0.5317748189218388, 0.2969649875271631], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 59.0, 59, 59, 59.0, 59.0, 59.0, 59.0, 16.949152542372882, 7.928363347457627, 1116.0454184322034], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 2, 0.4, 45.931999999999995, 13, 626, 45.0, 52.900000000000034, 63.94999999999999, 96.93000000000006, 0.5614760081301726, 0.30269917308620903, 25.6820442078135], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 44.93599999999999, 9, 221, 46.0, 54.0, 60.94999999999999, 75.97000000000003, 0.5621982400946292, 125.30448854331344, 0.17349086315420198], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 281.0, 281, 281, 281.0, 281.0, 281.0, 281.0, 3.558718861209964, 1.866242215302491, 1.4596307829181494], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.13, 1, 8, 2.0, 3.0, 4.0, 6.0, 0.5655001905735643, 0.6144258974912149, 0.24243611685722138], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.1019999999999976, 2, 14, 3.0, 4.0, 6.0, 10.0, 0.5654944344037766, 0.5801166625621196, 0.20819472829123414], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.118, 1, 17, 2.0, 3.0, 4.0, 8.0, 0.5654899574638453, 0.3207211636878541, 0.21923780577455726], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 125.44399999999992, 83, 175, 124.0, 151.0, 160.0, 170.0, 0.5654260089178991, 0.5151141376009427, 0.18442606150251784], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 8, 1.6, 173.69799999999998, 28, 417, 173.5, 209.0, 229.0, 351.8100000000002, 0.5619777119639435, 0.30159982761333687, 166.24332475849008], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.249999999999997, 1, 15, 2.0, 3.0, 4.0, 8.0, 0.5654912365823067, 0.3152635733447789, 0.2369099028259859], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.138000000000002, 1, 14, 3.0, 4.0, 6.0, 10.990000000000009, 0.5655404870434674, 0.304181252898395, 0.24079653549897637], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 12.190000000000007, 7, 345, 10.0, 15.0, 20.0, 40.0, 0.5612780975815649, 0.2371147825636714, 0.4072554946319363], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.343999999999997, 2, 60, 4.0, 5.0, 6.0, 11.0, 0.5655040280851921, 0.2909396729492279, 0.2275270112999015], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.463999999999999, 2, 12, 3.0, 4.0, 6.0, 10.0, 0.5626987029794897, 0.34557833117632164, 0.2813493514897448], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.004000000000004, 2, 40, 4.0, 5.0, 6.0, 11.980000000000018, 0.5626752733476478, 0.329596932139674, 0.2654024970965956], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 533.1840000000001, 373, 887, 537.0, 654.9000000000001, 665.95, 698.0, 0.5621154427727131, 0.51368129262943, 0.24757232879931018], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 15.354000000000006, 4, 114, 15.0, 25.0, 33.0, 48.97000000000003, 0.5623341817081688, 0.4978920024551511, 0.23119403369056551], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 9.471999999999996, 5, 56, 10.0, 11.0, 13.0, 23.0, 0.5627044023741624, 0.37503259289405627, 0.2632181725949451], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 536.1579999999996, 372, 3764, 521.0, 586.8000000000001, 613.0, 665.99, 0.5625043594087854, 0.42272202609570225, 0.3109154955325904], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 176.516, 142, 229, 182.0, 198.0, 202.0, 210.0, 0.5656063809449473, 10.935913208973458, 0.28501259039803983], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 265.8500000000002, 207, 454, 269.0, 296.0, 301.0, 318.0, 0.5654074665448402, 1.0959650720951062, 0.4041779936629131], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 18.06400000000002, 11, 46, 19.0, 22.0, 23.0, 34.0, 0.5650445368103914, 0.46101785109889865, 0.34873842506266345], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 17.742000000000008, 10, 43, 19.0, 22.0, 24.0, 29.99000000000001, 0.5650560309560296, 0.469888234742357, 0.3575745195893625], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 17.595999999999986, 11, 37, 19.0, 22.0, 23.0, 28.0, 0.5650087802364449, 0.4573503298803763, 0.34485399184353327], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 20.802000000000024, 12, 51, 22.0, 26.0, 27.0, 36.98000000000002, 0.5650209114239318, 0.5053648558970667, 0.3928661024744526], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 16.90200000000003, 10, 54, 18.0, 21.0, 22.0, 29.970000000000027, 0.5648881352025859, 0.4240577718863084, 0.311681441786583], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2198.912, 1670, 2856, 2184.5, 2484.9, 2559.65, 2681.9300000000003, 0.5637442540366907, 0.47112723905124093, 0.35894653674992416], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 98.03921568627452, 2.1272069772388855], "isController": false}, {"data": ["500", 10, 1.9607843137254901, 0.042544139544777704], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 510, "No results for path: $['rows'][1]", 500, "500", 10, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 2, "500", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 8, "500", 8, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
