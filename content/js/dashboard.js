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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9184730743012952, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.002, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.998, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.499, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.891, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.749, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.777, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 190.07939104748877, 1, 3805, 13.0, 556.0, 1250.9500000000007, 2141.980000000003, 25.787754068851722, 173.37751406431644, 227.16005445912515], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 6.906000000000004, 4, 30, 6.0, 10.0, 12.0, 18.0, 0.5970783760901159, 6.383347426248879, 0.2157412101106864], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.1460000000000035, 4, 42, 7.0, 9.0, 10.0, 14.990000000000009, 0.5970512831229126, 6.410628251690551, 0.25188101006747876], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 19.792000000000012, 12, 253, 18.0, 25.0, 30.0, 46.99000000000001, 0.5928764706300853, 0.31950483550049447, 6.600382583186498], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 41.29400000000001, 24, 77, 43.0, 51.0, 53.0, 55.98000000000002, 0.5968795139013239, 2.48252915010326, 0.24831120402535542], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.169999999999999, 1, 15, 2.0, 3.0, 3.0, 6.990000000000009, 0.5969194182662118, 0.37307463641638233, 0.25240830870045866], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 36.58000000000002, 22, 66, 38.0, 44.0, 47.0, 49.99000000000001, 0.5968702511510643, 2.4491731407193242, 0.21683177092597258], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 762.954, 549, 975, 770.0, 894.0, 906.0, 919.97, 0.5965334249608674, 2.523033460454606, 0.29011098206104685], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.449999999999998, 5, 26, 8.0, 10.0, 12.0, 17.0, 0.5966814961907854, 0.8874471862290685, 0.30475041260525465], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.107999999999996, 1, 22, 3.0, 4.0, 5.0, 11.980000000000018, 0.5939406178170307, 0.5730598929719006, 0.32481127536868865], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.946000000000002, 8, 29, 13.5, 16.0, 18.0, 21.99000000000001, 0.5968517265129893, 0.9727983706544717, 0.3899353564816307], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 639.0, 639, 639, 639.0, 639.0, 639.0, 639.0, 1.5649452269170578, 0.6678526017214398, 1851.0016260758998], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.057999999999999, 2, 22, 4.0, 5.0, 6.0, 10.990000000000009, 0.5939540232069715, 0.5961813507939977, 0.348599968698623], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 13.839999999999995, 9, 32, 14.0, 17.0, 19.0, 24.99000000000001, 0.5968396148713334, 0.937131451537817, 0.35495637251625195], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.232, 5, 18, 8.0, 10.0, 12.0, 15.990000000000009, 0.5968367651447329, 0.9238147194867203, 0.34096631602506716], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1854.9600000000005, 1444, 2306, 1837.5, 2101.8, 2183.75, 2240.94, 0.5956656981142415, 0.9097862811041736, 0.3280814977894846], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 16.553999999999984, 11, 70, 15.0, 21.0, 25.94999999999999, 37.97000000000003, 0.5928356991429967, 0.320154435181716, 4.779737824340411], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.538, 11, 36, 18.0, 21.0, 23.0, 28.0, 0.5968709636601082, 1.0806628580330475, 0.4977810575837231], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 13.049999999999992, 8, 39, 14.0, 16.0, 17.0, 21.99000000000001, 0.5968659761325233, 1.0107085963025346, 0.4278316664856173], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 78.0, 78, 78, 78.0, 78.0, 78.0, 78.0, 12.82051282051282, 5.972055288461538, 1748.4975961538462], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 619.0, 619, 619, 619.0, 619.0, 619.0, 619.0, 1.6155088852988693, 0.7399156906300485, 3089.5692397011308], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.0280000000000027, 1, 17, 2.0, 3.0, 4.0, 7.0, 0.5938369228795864, 0.4993101470696523, 0.2511048707098252], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 389.4420000000004, 304, 550, 387.0, 456.0, 466.95, 487.99, 0.5936352799821435, 0.5222367242374161, 0.27478820577298435], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.816000000000003, 1, 21, 3.0, 4.0, 5.0, 11.980000000000018, 0.5938982889790294, 0.5382203243872454, 0.2899893989155417], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1130.998, 904, 1540, 1131.5, 1313.0, 1346.0, 1382.96, 0.5932683032170567, 0.5614033064622344, 0.3134356953519802], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 52.0, 52, 52, 52.0, 52.0, 52.0, 52.0, 19.230769230769234, 8.995643028846155, 1266.2823016826924], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 41.56599999999999, 27, 638, 41.0, 47.0, 53.0, 82.99000000000001, 0.5923981104869868, 0.31991812021416377, 27.09642841698192], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 40.00799999999995, 28, 176, 40.0, 47.0, 53.0, 81.99000000000001, 0.5932429626553555, 134.24844922581792, 0.18307107050692611], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 2.0169771634615383, 1.5775240384615383], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.0180000000000002, 1, 19, 2.0, 3.0, 4.0, 6.990000000000009, 0.5971054715162777, 0.6490023337867353, 0.25598564648012295], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 2.976000000000002, 1, 21, 3.0, 4.0, 6.0, 10.0, 0.5970976278505441, 0.6128414129598846, 0.21982988837856945], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.883999999999999, 1, 10, 2.0, 3.0, 3.0, 6.0, 0.5970912104591274, 0.3387792903093291, 0.23148946342995463], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 118.19199999999994, 83, 211, 117.0, 143.0, 147.0, 166.96000000000004, 0.5970227668661916, 0.543967032701325, 0.1947320352864336], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 160.41800000000006, 109, 635, 160.0, 189.0, 216.24999999999983, 305.83000000000015, 0.5929777206410801, 0.3202311323383958, 175.41369646597138], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.1379999999999995, 1, 16, 2.0, 3.0, 4.0, 6.0, 0.5970926365341876, 0.3322727226588296, 0.2501491612042642], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 436.2299999999998, 334, 548, 432.0, 512.0, 521.0, 539.98, 0.5968773763180545, 0.6486611518181482, 0.25647074763666405], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 10.778000000000002, 6, 291, 9.0, 13.0, 17.0, 30.940000000000055, 0.5922156802130081, 0.2504193257150708, 0.4297033695295557], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 2.699999999999998, 1, 37, 2.0, 3.0, 4.0, 9.0, 0.5971104630472218, 0.6355960983608123, 0.2425761256129339], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.291999999999997, 2, 16, 3.0, 4.0, 5.0, 9.0, 0.5938298701175307, 0.3647646370155536, 0.29691493505876543], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.6980000000000013, 2, 28, 3.0, 5.0, 5.0, 9.990000000000009, 0.5938129441720822, 0.34793727197582947, 0.2800895039405427], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 501.332, 364, 884, 502.5, 613.0, 620.0, 636.99, 0.5931929917807178, 0.5415434926135609, 0.2612598039971717], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 15.405999999999995, 6, 125, 14.0, 23.0, 33.0, 53.97000000000003, 0.5933612371344449, 0.5255650801571695, 0.2439502742515638], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 7.020000000000002, 4, 42, 7.0, 8.0, 9.0, 13.980000000000018, 0.5939631956645438, 0.3961688111707846, 0.27784020578448876], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 506.282, 335, 3805, 497.0, 544.0, 561.95, 622.98, 0.5937572364163188, 0.44647760941461473, 0.3281900349723012], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 13.013999999999989, 9, 28, 14.0, 15.0, 17.0, 22.980000000000018, 0.596666543355581, 0.4871222951613923, 0.3682551322272727], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 12.905999999999993, 8, 40, 13.0, 16.0, 17.0, 22.0, 0.5966736636598292, 0.4957752148323526, 0.3775825527847356], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 13.036000000000005, 8, 40, 14.0, 16.0, 17.94999999999999, 25.980000000000018, 0.596657999214798, 0.4830366028799488, 0.3641711420988758], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 15.614000000000003, 10, 31, 16.0, 19.0, 21.0, 25.99000000000001, 0.5966608472345366, 0.5337317735027691, 0.41486574534276377], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 12.453999999999994, 8, 30, 13.0, 15.0, 16.0, 23.960000000000036, 0.5964458981819136, 0.4479168903338785, 0.32909368405545036], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2084.274, 1611, 2650, 2071.0, 2365.9, 2460.95, 2592.84, 0.5953040038956694, 0.49696257293962304, 0.37904122123044576], "isController": false}]}, function(index, item){
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
