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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8926824079982982, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.886, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.416, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.995, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.986, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.654, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.525, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.996, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 510, 2.169751116783663, 206.89206551797497, 1, 3892, 18.0, 615.0, 1309.9500000000007, 2551.9900000000016, 23.81097097705516, 158.87139191738845, 197.27673653320164], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 27.75400000000003, 17, 75, 28.0, 35.0, 40.0, 51.98000000000002, 0.5156356188710262, 0.2994956696920727, 0.2608391118898355], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 8.02999999999999, 4, 29, 7.0, 12.0, 14.949999999999989, 22.0, 0.5156404047570922, 5.516421761107925, 0.18732249079066238], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.627999999999997, 5, 38, 8.0, 12.0, 15.0, 18.99000000000001, 0.5156255156255156, 5.53675657435423, 0.2185365954897205], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 24.56000000000002, 14, 269, 22.0, 34.0, 39.0, 56.98000000000002, 0.5129036295112439, 0.27687179050553834, 5.711061702819534], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 45.978, 24, 112, 46.0, 60.0, 66.94999999999999, 87.99000000000001, 0.5155245049418179, 2.144071450472014, 0.21547313292490045], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.9579999999999984, 1, 23, 3.0, 4.0, 6.0, 10.980000000000018, 0.5155457670599249, 0.3220993010746036, 0.21900625846783922], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 40.23600000000003, 21, 97, 40.0, 52.0, 56.0, 74.98000000000002, 0.5155154690726804, 2.1158416179891186, 0.18828397014959228], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 834.9879999999999, 566, 1395, 827.5, 1045.9, 1143.9, 1286.91, 0.5152503807700314, 2.179130723658855, 0.2515870999853669], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 12.862000000000002, 7, 43, 12.0, 18.0, 22.0, 28.0, 0.5156462542940442, 0.7667478519466161, 0.2643694174847394], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.7740000000000036, 2, 22, 3.0, 5.0, 7.0, 13.0, 0.5134893656352377, 0.49534975204882253, 0.2818174057490269], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 20.090000000000007, 11, 61, 20.0, 27.0, 32.0, 44.98000000000002, 0.5154910206619111, 0.8400439659069704, 0.337787573109514], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 821.0, 821, 821, 821.0, 821.0, 821.0, 821.0, 1.2180267965895248, 0.5198024512789282, 1440.6723412758831], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.021999999999999, 2, 24, 5.0, 7.0, 9.0, 13.0, 0.5134983306169272, 0.5158893072188623, 0.30238231773633506], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 20.68599999999999, 12, 73, 21.0, 27.0, 31.0, 40.99000000000001, 0.5154851746463772, 0.8098594271928738, 0.30757953291888324], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 11.844000000000007, 7, 33, 12.0, 16.0, 18.0, 27.0, 0.5154798602018619, 0.7977987157463633, 0.2954948026743095], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2186.316000000002, 1553, 3368, 2152.0, 2641.5, 2783.95, 3133.79, 0.5144212863412918, 0.7855815879876457, 0.28433832819254995], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 21.94599999999998, 12, 533, 19.0, 29.0, 34.94999999999999, 50.99000000000001, 0.5128720630381309, 0.2768837999229666, 4.136032711493052], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 24.94999999999999, 15, 61, 25.0, 33.0, 37.94999999999999, 45.0, 0.5155090910028198, 0.9331781812066006, 0.43093338076016974], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 19.774000000000022, 11, 48, 20.0, 26.0, 29.94999999999999, 39.0, 0.5155037760651596, 0.8727579613114417, 0.3705183390468335], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 82.0, 82, 82, 82.0, 82.0, 82.0, 82.0, 12.195121951219512, 5.680735518292683, 1663.2288490853657], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 771.0, 771, 771, 771.0, 771.0, 771.0, 771.0, 1.297016861219196, 0.59404385538262, 2480.473816472114], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.6779999999999995, 1, 17, 2.0, 4.0, 5.949999999999989, 10.990000000000009, 0.5135141519365133, 0.4314822720793112, 0.218143218840218], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 448.3400000000003, 318, 826, 447.5, 591.9000000000001, 655.9, 729.0, 0.5133517660840808, 0.4520162564387145, 0.23862836001564697], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.4099999999999993, 1, 14, 3.0, 5.0, 7.0, 11.980000000000018, 0.5135431602213576, 0.46522396451724884, 0.25175651018664214], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1265.0319999999992, 939, 2020, 1222.0, 1628.0, 1719.9, 1953.8200000000002, 0.5129883520864775, 0.48528998686493324, 0.2720240968583567], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 68.0, 68, 68, 68.0, 68.0, 68.0, 68.0, 14.705882352941176, 6.879021139705882, 968.362247242647], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 2, 0.4, 49.04800000000002, 22, 729, 45.0, 62.0, 71.94999999999999, 96.98000000000002, 0.5124972453273063, 0.2761779589028459, 23.442745088995146], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 49.936, 9, 187, 48.0, 66.0, 73.0, 96.97000000000003, 0.5131615678933281, 114.59406261963079, 0.15936072127937337], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 319.0, 319, 319, 319.0, 319.0, 319.0, 319.0, 3.134796238244514, 1.6439312304075235, 1.2918789184952977], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.6299999999999986, 1, 19, 2.0, 4.0, 6.0, 9.0, 0.515681354303, 0.5603260646757241, 0.2220854269996318], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.6539999999999986, 2, 15, 3.0, 5.0, 7.0, 10.0, 0.5156776313482495, 0.5291577669302123, 0.19086115457127595], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.4880000000000018, 1, 14, 2.0, 4.0, 5.0, 9.990000000000009, 0.5156510403775391, 0.29248391716633254, 0.2009226221783575], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 137.28399999999993, 90, 297, 131.0, 185.0, 204.95, 236.0, 0.5155962716202406, 0.4696890699906471, 0.16918002662539147], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 7, 1.4, 189.29199999999992, 41, 450, 183.0, 250.90000000000003, 277.95, 367.97, 0.512950460270448, 0.2754674212980109, 151.74116545422277], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.6119999999999988, 1, 19, 2.0, 4.0, 5.0, 11.990000000000009, 0.515672844771129, 0.28743120924250753, 0.2170458946253482], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.7760000000000002, 2, 20, 3.0, 5.0, 7.0, 10.0, 0.5157079484003255, 0.2774075648296462, 0.22058601699154548], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 13.317999999999996, 8, 318, 11.0, 18.0, 22.0, 40.99000000000001, 0.5123544016879003, 0.21647573886628269, 0.37275784107176346], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 5.2280000000000015, 2, 53, 5.0, 7.0, 8.0, 13.990000000000009, 0.5156818861580668, 0.2652196256923029, 0.20848857506781215], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.224000000000003, 2, 15, 4.0, 6.0, 8.0, 13.0, 0.5135078232916879, 0.3153098506205742, 0.2577568566132105], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.627999999999996, 2, 24, 4.0, 7.0, 8.949999999999989, 15.0, 0.5134962211813083, 0.30078943785771434, 0.24320865944622513], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 578.9879999999997, 382, 1027, 575.5, 752.6000000000001, 848.55, 961.7200000000003, 0.513095742639385, 0.46879814281147736, 0.22698473771058733], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 18.64600000000003, 6, 111, 17.0, 31.0, 38.94999999999999, 58.960000000000036, 0.5132548053481151, 0.4544370075961711, 0.21201834244360615], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 10.790000000000001, 6, 51, 10.0, 14.0, 18.0, 26.99000000000001, 0.5135051864023827, 0.3422421802788333, 0.24120702603471295], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 599.1019999999994, 460, 3892, 581.5, 666.9000000000001, 696.9, 779.98, 0.513249536792293, 0.385765168448498, 0.28469310243947504], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 185.98199999999986, 143, 345, 184.0, 233.0, 262.95, 286.98, 0.5155059020270722, 9.967169684438216, 0.26077349340822603], "isController": false}, {"data": ["Query single patient #1", 500, 1, 0.2, 286.7659999999996, 25, 616, 281.0, 355.90000000000003, 378.0, 425.99, 0.51559999340032, 0.9977504372287944, 0.36958046401937006], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 20.044000000000004, 12, 46, 20.0, 26.900000000000034, 32.0, 41.99000000000001, 0.5156005250875747, 0.42076426756883006, 0.3192292313530492], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 20.198000000000025, 11, 76, 20.0, 27.0, 33.94999999999999, 44.99000000000001, 0.5156127541970879, 0.42883069661861156, 0.32729325217588584], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 19.828000000000003, 12, 44, 20.0, 27.900000000000034, 31.0, 38.99000000000001, 0.5155824483360608, 0.41731263508260147, 0.3156935499088966], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 23.108000000000004, 14, 50, 23.0, 31.0, 34.94999999999999, 44.98000000000002, 0.5155898915508222, 0.46109445684151695, 0.35950310797586627], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 19.735999999999994, 12, 51, 20.0, 26.0, 30.0, 42.98000000000002, 0.5153013585405016, 0.3868041209422594, 0.2853279983324848], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2430.711999999999, 1741, 3856, 2382.0, 2998.9, 3118.85, 3402.8100000000004, 0.514394824776547, 0.42985624561478414, 0.3285295072303337], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 98.03921568627452, 2.1272069772388855], "isController": false}, {"data": ["400", 1, 0.19607843137254902, 0.0042544139544777706], "isController": false}, {"data": ["500", 9, 1.7647058823529411, 0.03828972559029994], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 510, "No results for path: $['rows'][1]", 500, "500", 9, "400", 1, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 2, "500", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 7, "500", 7, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Query single patient #1", 500, 1, "400", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
