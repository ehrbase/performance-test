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

    var data = {"OkPercent": 97.74516060412678, "KoPercent": 2.2548393958732182};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9170176558179111, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.188, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.973, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.967, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.975, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.984, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.016, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 530, 2.2548393958732182, 147.09580940225496, 1, 2753, 13.0, 440.0, 950.0, 1684.9900000000016, 33.435134700705404, 220.3480606146062, 276.67859292118953], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 20.272, 14, 60, 20.0, 24.0, 26.0, 39.99000000000001, 0.725770514266471, 0.4215068188861455, 0.3657202982045889], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 5.776000000000003, 3, 27, 5.0, 8.0, 10.0, 19.0, 0.7255567196710035, 7.758195197159155, 0.26216404909987434], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 6.258000000000003, 3, 27, 6.0, 8.0, 9.949999999999989, 15.990000000000009, 0.7255346101775093, 7.790871416493868, 0.3060849136686367], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.883999999999993, 10, 222, 15.0, 22.0, 27.899999999999977, 42.98000000000002, 0.7212072432285852, 0.3894392338723636, 7.935392587359833], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.495999999999995, 23, 68, 34.0, 39.900000000000034, 41.0, 45.97000000000003, 0.7254567112725816, 3.017181546720863, 0.3018013271505076], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.0960000000000005, 1, 18, 2.0, 3.0, 4.0, 5.990000000000009, 0.7254956586339788, 0.4533936941186969, 0.30677697284034455], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.887999999999987, 21, 58, 30.0, 35.0, 36.0, 44.950000000000045, 0.7254767107466317, 2.9773847598381895, 0.26355208632592475], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 631.1440000000001, 502, 767, 633.5, 706.9000000000001, 722.9, 754.99, 0.7249371117055595, 3.0658694850409227, 0.3525573062786803], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.852000000000002, 6, 28, 9.0, 11.0, 13.0, 20.99000000000001, 0.725339894274457, 1.078719257375256, 0.3704616842827549], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 2.9819999999999998, 1, 23, 3.0, 4.0, 5.0, 13.970000000000027, 0.7226206270612753, 0.6970113472213791, 0.3951831554241349], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 14.361999999999991, 10, 57, 14.0, 17.0, 19.0, 29.99000000000001, 0.7255272406457773, 1.1822367193145509, 0.4740016835859619], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 611.0, 611, 611, 611.0, 611.0, 611.0, 611.0, 1.6366612111292964, 0.6984579582651391, 1935.826577843699], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.6939999999999973, 2, 24, 3.0, 5.0, 6.0, 13.990000000000009, 0.722640470467852, 0.7261280575821606, 0.4241278542491982], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 14.934000000000005, 11, 30, 15.0, 18.0, 19.0, 25.0, 0.7255209240234488, 1.1399619985743514, 0.4314865651662894], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.922000000000008, 6, 23, 9.0, 11.900000000000034, 13.0, 18.0, 0.72551776575353, 1.1228294322243069, 0.41448036422442874], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1537.557999999999, 1286, 1798, 1537.5, 1663.8000000000002, 1697.6499999999999, 1765.97, 0.7240185927974631, 1.1054151839369235, 0.39877586556422767], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 1, 0.2, 14.849999999999985, 5, 109, 13.0, 20.0, 26.0, 46.98000000000002, 0.7211479521561602, 0.388869173755551, 5.814255364259042], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.391999999999996, 13, 32, 18.0, 20.0, 22.0, 26.99000000000001, 0.7255125020314349, 1.313492206363325, 0.6050660905613725], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 14.267999999999999, 10, 33, 14.0, 17.0, 19.0, 26.0, 0.7255219767861988, 1.2284050650865765, 0.5200518857041698], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 60.0, 60, 60, 60.0, 60.0, 60.0, 60.0, 16.666666666666668, 7.763671875, 2273.046875], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 602.0, 602, 602, 602.0, 602.0, 602.0, 602.0, 1.6611295681063123, 0.7608103197674418, 3176.816211586379], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 1.8740000000000017, 1, 23, 2.0, 3.0, 3.0, 7.990000000000009, 0.7225694569890531, 0.6071008819863434, 0.30553962390259765], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 329.7219999999999, 262, 442, 328.5, 379.0, 394.95, 424.95000000000005, 0.7222959766669508, 0.6359957147985444, 0.33434403607435026], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.6499999999999995, 1, 11, 2.0, 3.0, 5.0, 9.0, 0.722621671423926, 0.654794030241717, 0.3528426129999639], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 916.0860000000005, 766, 1146, 907.0, 1035.0, 1055.9, 1082.96, 0.7218017326128789, 0.6825833685512429, 0.38134251693707766], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 50.0, 50, 50, 50.0, 50.0, 50.0, 50.0, 20.0, 9.35546875, 1316.93359375], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 13, 2.6, 34.45, 7, 780, 32.0, 40.0, 47.94999999999999, 77.95000000000005, 0.720346919076227, 0.3851295408868911, 32.858793544971256], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 33.812000000000005, 7, 176, 33.0, 41.0, 48.0, 66.99000000000001, 0.7216069320448321, 158.37195001555062, 0.22268338918570987], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 282.0, 282, 282, 282.0, 282.0, 282.0, 282.0, 3.5460992907801416, 1.8596243351063833, 1.4544547872340428], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 1.8560000000000003, 1, 23, 2.0, 3.0, 4.0, 7.990000000000009, 0.7255672484748577, 0.788505955909455, 0.31105861531295165], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 2.7059999999999995, 1, 19, 2.0, 4.0, 5.0, 8.0, 0.7255619840347342, 0.7444875314893902, 0.26712584763778785], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.7779999999999994, 1, 16, 2.0, 3.0, 3.0, 6.990000000000009, 0.7255714600819605, 0.41134800112318465, 0.281300653957557], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 87.3500000000001, 63, 139, 86.0, 104.90000000000003, 107.0, 120.96000000000004, 0.725471447620236, 0.6608775669900335, 0.23662838232925668], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 16, 3.2, 129.37200000000007, 22, 515, 129.5, 151.90000000000003, 172.95, 261.97, 0.7213029616699607, 0.38480245089730086, 213.2844958633275], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.0060000000000002, 1, 8, 2.0, 3.0, 4.0, 7.0, 0.7255598782800748, 0.40454356252439694, 0.30396990994350787], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 2.487999999999999, 1, 17, 2.0, 3.900000000000034, 5.0, 8.990000000000009, 0.7256230562372381, 0.3901598642830917, 0.30895669191351155], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 9.168000000000003, 5, 280, 8.0, 12.0, 15.949999999999989, 32.98000000000002, 0.7200771922750119, 0.3043634090074456, 0.5224778846292323], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 3.797999999999998, 2, 53, 4.0, 5.0, 5.0, 9.980000000000018, 0.7255704071756011, 0.373331482826474, 0.2919287185120582], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 2.902000000000001, 1, 17, 3.0, 4.0, 5.0, 9.0, 0.7225527499635112, 0.4437927457690924, 0.3612763749817556], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.4879999999999995, 2, 56, 3.0, 4.0, 5.0, 8.990000000000009, 0.7224963694557435, 0.4230512579564913, 0.34078686176476963], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 442.80399999999986, 358, 1027, 446.0, 488.0, 500.95, 534.9100000000001, 0.7214288909185088, 0.6589407494059033, 0.31773870098071044], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 14.212, 7, 130, 13.0, 20.0, 25.0, 39.98000000000002, 0.7217819352417247, 0.639230945859137, 0.29674823704762315], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 7.621999999999995, 5, 40, 7.0, 9.0, 11.0, 21.960000000000036, 0.7226603149642716, 0.4815994649784358, 0.33804129967567004], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 412.9880000000003, 353, 2753, 394.0, 454.0, 481.95, 552.9200000000001, 0.722318932701545, 0.5429045031168062, 0.3992505038174555], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 135.9059999999999, 115, 187, 140.0, 148.0, 150.0, 164.0, 0.7256019956957289, 14.029445144398426, 0.36563538064355094], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 204.72199999999998, 172, 314, 207.5, 220.0, 224.95, 248.94000000000005, 0.725421977964582, 1.4061313254982923, 0.5185633670606191], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 13.940000000000014, 10, 30, 14.0, 17.0, 18.0, 23.99000000000001, 0.725314641491479, 0.591822748333227, 0.4476551302955222], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 13.834000000000009, 10, 30, 14.0, 16.0, 18.0, 22.0, 0.7253262154654055, 0.6032886630605865, 0.45899549572420195], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 14.393999999999995, 10, 31, 14.0, 17.0, 19.0, 25.980000000000018, 0.725293598848814, 0.5869707600605475, 0.44268408132862186], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 16.260000000000012, 12, 32, 16.0, 19.0, 21.0, 25.99000000000001, 0.7252946509519492, 0.6487576495920218, 0.5043064369900272], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 13.878000000000009, 10, 34, 14.0, 17.0, 19.0, 27.950000000000045, 0.7251873521524286, 0.5445165547581718, 0.40012778707629115], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1672.070000000001, 1400, 1966, 1662.5, 1814.5000000000002, 1855.0, 1917.99, 0.7236905904302051, 0.6045092097769151, 0.46078736812548216], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 94.33962264150944, 2.1272069772388855], "isController": false}, {"data": ["500", 30, 5.660377358490566, 0.1276324186343331], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 530, "No results for path: $['rows'][1]", 500, "500", 30, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 13, "500", 13, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 16, "500", 16, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
