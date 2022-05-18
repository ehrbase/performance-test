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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9104748920699841, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.973, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.495, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.793, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.705, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.598, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 201.44748920699837, 1, 3490, 14.0, 607.0, 1305.0, 2272.9900000000016, 24.308067892472287, 163.45010349293847, 214.12574400652304], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 8.564000000000002, 4, 111, 7.0, 12.0, 14.949999999999989, 26.0, 0.5623480957206435, 6.033315197021467, 0.2031921830240606], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.727999999999997, 4, 72, 7.0, 9.0, 11.0, 24.0, 0.5623265925370264, 6.037784094423632, 0.23723153122655802], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 21.22799999999999, 13, 241, 19.0, 28.0, 32.94999999999999, 71.91000000000008, 0.5587466195829515, 0.30111204545962494, 6.220421350825827], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.096, 25, 142, 43.0, 52.0, 53.0, 60.99000000000001, 0.5621280820077416, 2.3379917004599333, 0.23385406536650188], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.447999999999999, 1, 18, 2.0, 3.0, 4.0, 7.0, 0.5621577864475001, 0.3513486165296876, 0.23770929837086674], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.53, 22, 127, 38.0, 46.0, 48.0, 58.950000000000045, 0.5621204983985186, 2.3065824169832343, 0.20420783730883688], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 755.9060000000005, 571, 1101, 751.5, 903.8000000000001, 926.0, 981.9200000000001, 0.5617927029869395, 2.376097848277768, 0.27321559188232014], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.954000000000002, 5, 38, 9.0, 11.0, 13.0, 21.0, 0.561953079165702, 0.8357954487982071, 0.2870131449254513], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.5580000000000025, 2, 25, 3.0, 5.0, 7.0, 14.980000000000018, 0.5595933323335266, 0.539920129243676, 0.30602760361989734], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 13.908000000000003, 8, 43, 14.0, 17.0, 18.94999999999999, 27.99000000000001, 0.5621173386217333, 0.9161853888278054, 0.3672426753300191], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 635.0, 635, 635, 635.0, 635.0, 635.0, 635.0, 1.574803149606299, 0.6720595472440944, 1862.6614788385828], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.579999999999992, 2, 24, 4.0, 6.0, 8.0, 16.980000000000018, 0.5596027268321674, 0.561701237057788, 0.3284387097911451], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 14.642000000000003, 9, 53, 15.0, 18.0, 19.0, 25.99000000000001, 0.5621116511130373, 0.8826031221929549, 0.3343027300076559], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.949999999999996, 5, 45, 9.0, 11.0, 13.0, 18.99000000000001, 0.5621116511130373, 0.8700653974747696, 0.32112823818469416], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2011.7340000000002, 1563, 2879, 1990.5, 2275.9, 2333.9, 2455.82, 0.5609783462358353, 0.8568067710086391, 0.3089763547627062], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.52799999999999, 12, 115, 16.0, 24.0, 32.94999999999999, 60.86000000000013, 0.5587147772236568, 0.30172780449676, 4.504637891365734], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 18.69400000000001, 11, 94, 19.0, 23.0, 25.0, 33.97000000000003, 0.562129345962506, 1.017761530678209, 0.4688070912616993], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 13.892000000000012, 8, 109, 14.0, 17.0, 19.0, 22.99000000000001, 0.5621236582108279, 0.9518773665406011, 0.4029284815690895], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 85.0, 85, 85, 85.0, 85.0, 85.0, 85.0, 11.76470588235294, 5.480238970588235, 1604.503676470588], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 652.0, 652, 652, 652.0, 652.0, 652.0, 652.0, 1.5337423312883436, 0.7024659700920245, 2933.195336464724], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.370000000000002, 1, 21, 2.0, 3.0, 5.0, 10.990000000000009, 0.5595338411662476, 0.47046741918372964, 0.2365997590087746], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 416.27799999999996, 314, 1112, 420.5, 486.0, 501.0, 546.98, 0.5593316657791938, 0.49205892363332904, 0.25890938435482214], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.1839999999999957, 2, 44, 3.0, 4.0, 6.0, 11.990000000000009, 0.5595676556465412, 0.507108187929678, 0.2732263943586627], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1183.304, 923, 2769, 1179.5, 1371.9, 1404.9, 1510.5100000000004, 0.5589977394131418, 0.5289734467688813, 0.29532986037354464], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 59.0, 59, 59, 59.0, 59.0, 59.0, 59.0, 16.949152542372882, 7.928363347457627, 1116.0454184322034], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 42.85999999999995, 27, 678, 40.0, 50.0, 57.94999999999999, 103.99000000000001, 0.5583017799777349, 0.30150476985125724, 25.536854268161278], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 42.20200000000001, 28, 194, 42.0, 51.0, 57.0, 92.99000000000001, 0.5590471153727894, 126.51006924217809, 0.17251844575957173], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.401360544217687, 1.7837213010204083, 1.3950892857142858], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.2899999999999965, 1, 35, 2.0, 3.0, 5.0, 6.0, 0.5624828442732496, 0.6113705133555927, 0.24114254749605135], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.4100000000000015, 2, 54, 3.0, 4.0, 6.0, 11.0, 0.5624784148908285, 0.5773093887209578, 0.20708433829476794], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.1799999999999975, 1, 14, 2.0, 3.0, 4.0, 11.990000000000009, 0.5623601129219107, 0.3190734625074513, 0.21802437971679545], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 123.97600000000001, 85, 288, 122.0, 149.0, 154.0, 185.8900000000001, 0.5622949731953986, 0.5123254003821357, 0.18340480571021792], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 162.87199999999996, 108, 706, 160.0, 193.0, 227.44999999999987, 336.99, 0.5588265536495844, 0.30178816813302756, 165.3111542758055], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.284, 1, 18, 2.0, 3.0, 4.0, 8.0, 0.562475251088952, 0.3130086885552036, 0.235646369840977], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 468.2239999999998, 346, 727, 475.5, 549.9000000000001, 569.0, 612.99, 0.5622703125773122, 0.6110516549302111, 0.24160052493556383], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 12.231999999999996, 7, 303, 10.0, 16.0, 22.0, 62.86000000000013, 0.5581316431618827, 0.23600683739169456, 0.40497247155203014], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 2.946000000000001, 1, 18, 3.0, 4.0, 5.0, 11.0, 0.562484742601357, 0.598738642026835, 0.22850942668180124], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.7720000000000025, 2, 23, 3.0, 5.0, 7.0, 14.980000000000018, 0.5595263273922827, 0.3436934179001424, 0.2797631636961414], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.178, 2, 32, 4.0, 5.0, 7.0, 13.970000000000027, 0.5595081699382974, 0.32783681832322115, 0.263908638750193], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 534.2160000000002, 378, 1448, 538.5, 639.8000000000001, 654.95, 802.3800000000006, 0.5590077389031374, 0.5103347603869228, 0.24620360375519038], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.87000000000001, 4, 130, 16.0, 32.0, 36.94999999999999, 56.950000000000045, 0.5591640274124573, 0.49527516881161987, 0.22989067923891066], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 7.551999999999998, 4, 36, 7.0, 9.0, 10.0, 16.0, 0.5596133743119553, 0.3732577486865874, 0.26177227177287754], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 555.7860000000006, 370, 3490, 540.0, 617.0, 654.0, 756.98, 0.5594048827095783, 0.4206462496937258, 0.309202308216427], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 13.454000000000017, 9, 31, 14.0, 16.0, 18.0, 21.0, 0.5619429740269958, 0.458773756139227, 0.3468241792822864], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 13.310000000000004, 8, 45, 14.0, 17.0, 18.0, 22.0, 0.5619461318438014, 0.4669201629081836, 0.3556065365574056], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 13.429999999999998, 9, 32, 14.0, 16.900000000000034, 18.0, 25.0, 0.5619265539516922, 0.4549190558847196, 0.3429727502146559], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 16.333999999999985, 10, 34, 17.0, 20.0, 22.0, 31.970000000000027, 0.5619316061803485, 0.502665382091015, 0.3907180699222736], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 13.480000000000002, 8, 111, 14.0, 16.0, 18.0, 25.0, 0.5615895229858592, 0.42174056950793526, 0.3098614067255961], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2206.319999999998, 1678, 2961, 2191.0, 2513.8, 2612.85, 2770.4500000000007, 0.5605550840664459, 0.4679540117806257, 0.3569159324329324], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 22005, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
