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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9176550783912747, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.006, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.998, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.865, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.738, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.773, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 189.65835037491453, 1, 3925, 13.0, 567.0, 1230.9000000000015, 2128.9900000000016, 25.95002688755342, 174.48133712289618, 228.58948884240237], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 7.245999999999997, 4, 36, 7.0, 10.0, 12.0, 21.960000000000036, 0.6010727947240235, 6.439122624184645, 0.21718450590614127], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.608000000000004, 4, 37, 7.0, 9.0, 11.0, 16.99000000000001, 0.6010532857779973, 6.453598348245465, 0.25356935493759264], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 19.92800000000003, 13, 240, 18.0, 25.0, 30.0, 43.99000000000001, 0.5966288085799996, 0.3215269938738154, 6.642156658019526], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.22200000000005, 26, 98, 45.0, 54.0, 56.0, 59.99000000000001, 0.6007990627534621, 2.4988312580732375, 0.24994179759079574], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2239999999999998, 1, 14, 2.0, 3.0, 4.0, 6.0, 0.6008394929395352, 0.37552468308720943, 0.25406591840119014], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.18400000000005, 22, 56, 40.0, 47.0, 49.0, 52.0, 0.6007925655524768, 2.4652678062900577, 0.2182566742046107], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 753.8179999999998, 557, 995, 760.0, 900.0, 913.0, 942.95, 0.600434714733467, 2.53953393506899, 0.2920082890012369], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.317999999999993, 5, 26, 8.0, 10.0, 11.0, 18.0, 0.6005962719788206, 0.8932696506091248, 0.3067498537548078], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.089999999999999, 1, 20, 3.0, 4.0, 5.0, 9.990000000000009, 0.5976921909124489, 0.576679574825683, 0.32686291690524544], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.738000000000007, 8, 27, 13.0, 15.0, 17.0, 23.99000000000001, 0.6007759622328199, 0.9791944150064223, 0.3924991393884341], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 588.0, 588, 588, 588.0, 588.0, 588.0, 588.0, 1.7006802721088434, 0.7257785926870749, 2011.5476854804424], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.013999999999999, 2, 20, 4.0, 5.0, 6.0, 9.0, 0.5977050516835558, 0.5999464456273691, 0.3508015000603682], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 13.814, 9, 38, 14.0, 16.0, 18.0, 23.0, 0.6007615253094823, 0.9432894637242167, 0.35728883682956514], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.353999999999996, 5, 25, 8.0, 10.0, 12.0, 20.980000000000018, 0.6007579161870616, 0.9298840792543873, 0.34320642672796], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1846.113999999999, 1430, 2311, 1836.5, 2094.9, 2169.85, 2234.0, 0.599577897160399, 0.9157615538660783, 0.33023626367037606], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 16.69199999999996, 11, 65, 15.0, 21.0, 26.0, 41.0, 0.5965932141101454, 0.3221836400419047, 4.810032788763047], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.23600000000001, 11, 36, 18.0, 20.0, 23.0, 30.99000000000001, 0.6007932874567579, 1.0877644091258099, 0.5010522143438196], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.607999999999992, 8, 32, 13.0, 15.0, 17.0, 24.980000000000018, 0.600786068492015, 1.0173467214503455, 0.43064157643861223], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 95.0, 95, 95, 95.0, 95.0, 95.0, 95.0, 10.526315789473683, 4.903371710526316, 1435.608552631579], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 635.0, 635, 635, 635.0, 635.0, 635.0, 635.0, 1.574803149606299, 0.7212721456692913, 3011.7218257874015], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.0540000000000007, 1, 31, 2.0, 2.0, 3.0, 7.990000000000009, 0.5975857535556351, 0.5024622400501971, 0.2526900696187403], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 387.7299999999998, 304, 525, 386.0, 457.90000000000003, 465.0, 487.97, 0.5973772748126625, 0.5255286564865614, 0.2765203400988301], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.9080000000000017, 1, 25, 3.0, 4.0, 5.0, 12.0, 0.5976521831636599, 0.5416222909920668, 0.2918223550603808], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1113.1780000000012, 902, 1396, 1108.0, 1289.0, 1336.0, 1369.99, 0.5970077969218278, 0.5649419484543469, 0.3154113458346766], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 66.0, 66, 66, 66.0, 66.0, 66.0, 66.0, 15.151515151515152, 7.087476325757575, 997.6769649621211], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 40.995999999999995, 27, 583, 40.0, 48.0, 53.0, 85.97000000000003, 0.5961856045023938, 0.32196351493146846, 27.269669280940544], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 40.114, 27, 176, 40.0, 47.0, 53.94999999999999, 75.97000000000003, 0.5970106482819227, 135.10106102971204, 0.1842337547432496], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 280.0, 280, 280, 280.0, 280.0, 280.0, 280.0, 3.571428571428571, 1.8729073660714284, 1.4648437499999998], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.0480000000000014, 1, 16, 2.0, 3.0, 3.0, 6.0, 0.6010973633465254, 0.6533411771530105, 0.25769701416906704], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.0899999999999985, 1, 16, 3.0, 4.0, 6.0, 9.0, 0.6010915823134813, 0.6169406767690125, 0.2213003188790844], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.0400000000000014, 1, 12, 2.0, 3.0, 4.0, 7.990000000000009, 0.6010886918386581, 0.3410473925373637, 0.2330392682226048], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 118.51599999999998, 83, 186, 117.0, 145.0, 147.95, 153.0, 0.6010193287816137, 0.5476084313996539, 0.1960356013799404], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 159.28200000000004, 108, 631, 158.0, 189.0, 208.89999999999998, 324.6400000000003, 0.5967235105482814, 0.3222540052082028, 176.52176989088315], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.2220000000000004, 1, 17, 2.0, 3.0, 4.0, 8.990000000000009, 0.601087969224296, 0.33449606287380157, 0.25182298710666307], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 449.58800000000025, 340, 601, 461.0, 517.0, 529.95, 552.99, 0.6008669308077694, 0.6529968313282404, 0.25818500933146343], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.099999999999993, 6, 309, 9.0, 13.0, 17.0, 42.86000000000013, 0.595983784473192, 0.2520126744891525, 0.43243745299177905], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 2.8219999999999983, 1, 27, 3.0, 3.0, 5.0, 9.0, 0.6011074804219294, 0.6398507359959991, 0.2441999139214088], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.4379999999999997, 2, 16, 3.0, 4.0, 5.0, 10.990000000000009, 0.5975778972667982, 0.3670668919734532, 0.2987889486333991], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.7300000000000004, 2, 29, 3.0, 4.900000000000034, 5.0, 10.980000000000018, 0.5975586145244987, 0.3501320006979484, 0.2818562605618485], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 503.5820000000004, 363, 857, 507.0, 614.9000000000001, 621.95, 637.98, 0.5969493500415477, 0.5449727835867583, 0.262914215692127], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 13.956000000000005, 5, 117, 14.0, 22.0, 27.94999999999999, 44.97000000000003, 0.5971304300055653, 0.528903613295945, 0.24549991311752245], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.949999999999994, 4, 43, 7.0, 8.0, 9.0, 14.980000000000018, 0.597714340362454, 0.3986707953784727, 0.2795948916343901], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 509.6139999999997, 333, 3925, 499.0, 555.0, 572.0, 648.9000000000001, 0.5975079139923208, 0.4492979431387569, 0.33026316339809925], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 12.762000000000004, 8, 33, 13.0, 15.0, 16.0, 18.99000000000001, 0.600581843690167, 0.49031877082517544, 0.37067160665252497], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 12.58599999999999, 8, 36, 13.0, 15.0, 16.0, 20.99000000000001, 0.600588336334273, 0.49902791024087195, 0.38005980658653216], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.729999999999999, 8, 31, 13.0, 16.0, 17.0, 22.99000000000001, 0.600563087951263, 0.48619804678866907, 0.36655461911087833], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 15.256000000000002, 10, 30, 16.0, 19.0, 20.94999999999999, 25.0, 0.6005746298057982, 0.5372327743184679, 0.4175870472868441], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 12.264000000000006, 8, 37, 13.0, 15.0, 16.0, 20.0, 0.6003143245803503, 0.45082198789286065, 0.33122811854286904], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2083.7719999999968, 1649, 2661, 2073.0, 2346.6000000000004, 2479.2, 2622.94, 0.5991496867645437, 0.5001729670251979, 0.38148983961961186], "isController": false}]}, function(index, item){
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
