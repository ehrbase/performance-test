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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9110883890024994, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.002, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.979, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.498, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.797, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.709, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.606, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 200.81931379232157, 1, 3774, 14.0, 602.0, 1318.0, 2255.980000000003, 24.41606167427276, 164.1773143663641, 215.07704334377993], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 7.8379999999999885, 4, 47, 7.0, 11.0, 13.949999999999989, 21.980000000000018, 0.5654119421787132, 6.067255547327241, 0.20429923692004281], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.051999999999998, 4, 51, 8.0, 10.0, 11.0, 18.99000000000001, 0.5653953187529188, 6.070733463317717, 0.23852615009888764], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 21.03000000000001, 13, 301, 19.0, 26.0, 32.0, 48.99000000000001, 0.5613108629368682, 0.30249393222957166, 6.248968591289353], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.33000000000003, 27, 85, 44.0, 54.0, 56.0, 63.99000000000001, 0.5651888861257433, 2.350722134774942, 0.2351274077046549], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.434000000000001, 1, 18, 2.0, 3.0, 4.0, 6.0, 0.5652214707288756, 0.35326341920554727, 0.23900478205625308], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.368000000000016, 24, 65, 39.0, 47.900000000000034, 49.0, 53.99000000000001, 0.5651812197062865, 2.319141656455726, 0.20531973997142444], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 765.0720000000001, 576, 997, 758.0, 915.0, 936.8499999999999, 964.0, 0.5648511221897244, 2.3890334084020477, 0.2747029871586746], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 9.624000000000013, 6, 32, 10.0, 12.0, 13.0, 22.99000000000001, 0.564849845965447, 0.8401038236380622, 0.28849264593743046], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.5239999999999974, 2, 31, 3.0, 5.0, 6.0, 13.980000000000018, 0.5623493606650118, 0.5425792659541325, 0.3075348066136784], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 14.811999999999996, 9, 30, 15.0, 18.0, 19.0, 23.99000000000001, 0.5651716369744327, 0.9211635372171174, 0.36923811048427296], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 638.0, 638, 638, 638.0, 638.0, 638.0, 638.0, 1.567398119122257, 0.6688993926332288, 1853.9028825431035], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.573999999999996, 2, 24, 4.0, 6.0, 7.0, 13.990000000000009, 0.5623664379709818, 0.5644753121133731, 0.3300607707232032], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.722000000000017, 10, 33, 16.0, 19.0, 21.94999999999999, 27.0, 0.5651626933845446, 0.8873937352845763, 0.3361172658898317], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 9.400000000000007, 6, 60, 9.0, 12.0, 13.0, 18.99000000000001, 0.5651588605040991, 0.8747820252919893, 0.32286907558095507], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1968.2539999999997, 1477, 2509, 1965.0, 2216.9, 2279.0, 2401.67, 0.5639184664124522, 0.8612973451846438, 0.31059571782873346], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 17.837999999999965, 11, 97, 16.0, 23.0, 28.94999999999999, 46.97000000000003, 0.5612610863096074, 0.30310291086837193, 4.525167508371209], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 19.536000000000012, 13, 45, 20.0, 24.0, 25.0, 33.99000000000001, 0.5651805808473865, 1.0232859344639205, 0.4713517734801446], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 14.895999999999999, 9, 30, 15.0, 18.0, 20.0, 26.0, 0.5651773865745503, 0.9570484260940139, 0.4051173845173046], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 82.0, 82, 82, 82.0, 82.0, 82.0, 82.0, 12.195121951219512, 5.680735518292683, 1663.2050304878048], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 615.0, 615, 615, 615.0, 615.0, 615.0, 615.0, 1.6260162601626016, 0.7447281504065041, 3109.66399898374], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.271999999999997, 1, 18, 2.0, 3.0, 4.0, 8.0, 0.5622153082232985, 0.4727220511525976, 0.23773362154364083], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 414.75599999999986, 318, 600, 416.5, 478.0, 493.95, 540.8700000000001, 0.5620187714269657, 0.49442284184791774, 0.2601532203675603], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.206, 1, 22, 3.0, 4.0, 6.0, 12.0, 0.5622469186057626, 0.5095362699864724, 0.27453462822547003], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1195.655999999999, 937, 1645, 1196.0, 1370.8000000000002, 1399.95, 1471.8600000000001, 0.5616627013279953, 0.5314952710808861, 0.2967378138852006], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 56.0, 17.857142857142858, 8.353097098214285, 1175.8335658482142], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 42.60000000000003, 27, 751, 41.0, 49.0, 55.0, 85.96000000000004, 0.5607977684735197, 0.30285270113853163, 25.651021366955778], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 42.16200000000003, 29, 212, 42.0, 50.0, 56.0, 89.8900000000001, 0.5616999286641091, 127.11039000932422, 0.1733370873611899], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 1.7364704056291391, 1.3581332781456954], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.2579999999999987, 1, 10, 2.0, 3.0, 4.0, 6.990000000000009, 0.5654240906849773, 0.6145673954417771, 0.24240349200264166], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.344, 2, 18, 3.0, 5.0, 6.0, 10.0, 0.5654176966692374, 0.5803261710931333, 0.20816647621513917], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.231999999999998, 1, 16, 2.0, 3.0, 4.0, 8.990000000000009, 0.5654215330613279, 0.32081045967639793, 0.2192112779544406], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 121.39200000000001, 83, 180, 120.0, 150.0, 154.0, 164.98000000000002, 0.5653544037150569, 0.5151129479161602, 0.18440270589924707], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 164.70599999999993, 109, 661, 164.0, 193.0, 217.95, 340.83000000000015, 0.5614293542214995, 0.3031937821137591, 166.08111047076974], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.294, 1, 24, 2.0, 3.0, 4.0, 7.990000000000009, 0.5654138603292066, 0.3146439786816358, 0.2368774864074508], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 471.03799999999984, 342, 784, 475.5, 547.0, 561.0, 614.99, 0.5652125255617364, 0.614249127877073, 0.24286475707730862], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.972000000000001, 7, 363, 10.0, 15.0, 20.0, 41.99000000000001, 0.5605858795143981, 0.23704461506809998, 0.4067532309367166], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 2.9999999999999987, 1, 24, 3.0, 4.0, 5.0, 9.990000000000009, 0.5654272877470775, 0.601870843402651, 0.22970483564725025], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.8299999999999996, 2, 25, 4.0, 5.0, 6.0, 11.990000000000009, 0.5622102508919467, 0.3453420388779633, 0.28110512544597327], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.038000000000006, 2, 27, 4.0, 5.0, 6.0, 10.990000000000009, 0.5621950794437867, 0.32941117936159375, 0.265175999386083], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 527.9039999999995, 373, 840, 528.5, 634.0, 645.95, 724.7700000000002, 0.5616664869333908, 0.5127620103953233, 0.24737459531929618], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 15.80599999999999, 6, 114, 15.0, 25.0, 30.0, 41.98000000000002, 0.5618299475587928, 0.49763648675373534, 0.23098672648657395], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 8.106, 5, 48, 8.0, 10.0, 11.0, 15.0, 0.562374660747486, 0.375099505166536, 0.2630639282207478], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 553.2719999999994, 363, 3774, 535.0, 614.9000000000001, 653.9, 742.94, 0.5621754842017445, 0.42272961214388993, 0.3107337149005736], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 15.078, 10, 95, 15.0, 18.0, 19.0, 25.99000000000001, 0.5648262368564935, 0.46112766993362164, 0.3486036930598671], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 14.816, 9, 40, 15.0, 18.0, 20.0, 32.99000000000001, 0.5648358078790077, 0.46932119021071766, 0.35743515967343453], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 14.791999999999994, 10, 32, 16.0, 18.0, 19.0, 24.980000000000018, 0.5648083718156104, 0.4572520900733799, 0.3447316722507388], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 17.444000000000013, 12, 39, 18.0, 21.0, 23.0, 29.0, 0.564810285873078, 0.5052404510349019, 0.39271965189612457], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 14.592000000000002, 9, 85, 15.0, 18.0, 19.0, 30.950000000000045, 0.5645609296737741, 0.4239720262882151, 0.31150090357976795], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2197.801999999999, 1675, 3095, 2173.0, 2519.6000000000004, 2594.8, 2805.94, 0.5635155254162408, 0.47042540209650313, 0.35880090094862205], "isController": false}]}, function(index, item){
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
