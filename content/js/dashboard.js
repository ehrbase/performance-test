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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9037264258123154, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.473, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.845, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.329, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [0.991, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.992, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.606, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.53, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 232.51951829129672, 1, 6712, 14.0, 701.0, 1692.8500000000022, 3005.9900000000016, 20.725413001299753, 138.83542765001317, 182.56305135025994], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 9.524000000000003, 4, 52, 8.0, 16.0, 19.94999999999999, 31.980000000000018, 0.4793735163389669, 5.136299036015812, 0.17321113383341577], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 9.414000000000001, 5, 37, 8.0, 14.0, 18.0, 27.0, 0.4793565118185348, 5.146922021877831, 0.20222852842344435], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 28.38000000000001, 13, 242, 23.0, 43.900000000000034, 56.94999999999999, 99.85000000000014, 0.4764600164283414, 0.2567672807283359, 5.3043400266436445], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 55.628, 26, 227, 49.0, 84.90000000000003, 110.94999999999999, 184.98000000000002, 0.47927885785931057, 1.9934068902566444, 0.19938749360162727], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.3059999999999996, 1, 21, 3.0, 6.0, 8.0, 13.990000000000009, 0.47929815412694887, 0.299561346329343, 0.20267197337594614], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 46.94999999999998, 24, 177, 43.0, 70.0, 87.94999999999999, 130.93000000000006, 0.4792747231469562, 1.9666364284255922, 0.17411152051823017], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 946.304, 565, 3241, 878.0, 1279.8000000000002, 1517.95, 2236.87, 0.47904008032544065, 2.026096277235824, 0.23297066406452097], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 11.843999999999987, 5, 61, 10.0, 19.900000000000034, 29.0, 38.99000000000001, 0.47953994855495435, 0.7132220133292925, 0.24492128231859484], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.377999999999996, 1, 27, 3.0, 8.0, 10.949999999999989, 17.99000000000001, 0.47752253667611844, 0.4607346349960987, 0.2611451372447523], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 17.508000000000006, 8, 95, 15.0, 28.0, 41.0, 70.97000000000003, 0.4792802361126155, 0.7811706192108938, 0.3131235136321678], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 1037.0, 1037, 1037, 1037.0, 1037.0, 1037.0, 1037.0, 0.9643201542912248, 0.41153115959498554, 1140.5882729628738], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.406000000000003, 2, 40, 4.0, 9.0, 12.0, 22.0, 0.4775284654718268, 0.4793191972173461, 0.2802681716294608], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 18.082, 9, 99, 16.0, 27.0, 40.0, 60.99000000000001, 0.47927288551992003, 0.7525333166546369, 0.28503631570471805], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 10.782000000000005, 5, 66, 9.0, 16.900000000000034, 23.0, 38.98000000000002, 0.47925129445774634, 0.7418098649565702, 0.2737910227126773], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2387.304000000001, 1502, 5027, 2245.0, 3177.6000000000004, 3530.3999999999996, 4045.94, 0.4782405339459913, 0.7304376905190727, 0.26340591908744054], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 23.676000000000002, 11, 110, 19.0, 37.900000000000034, 50.0, 69.94000000000005, 0.47643459220057516, 0.2572932905145684, 3.8412538996171373], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 23.38799999999999, 12, 100, 20.0, 36.900000000000034, 46.94999999999999, 61.99000000000001, 0.4792834520678205, 0.8677651563806048, 0.3997149102206238], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 17.229999999999997, 8, 77, 15.0, 27.0, 34.0, 62.99000000000001, 0.47928207379601945, 0.8115967929319313, 0.3435478927405061], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 72.0, 72, 72, 72.0, 72.0, 72.0, 72.0, 13.888888888888888, 6.469726562500001, 1894.2057291666667], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 654.0, 654, 654, 654.0, 654.0, 654.0, 654.0, 1.529051987767584, 0.700317756116208, 2924.22532014526], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.9720000000000004, 1, 34, 2.0, 5.0, 8.0, 15.970000000000027, 0.4771661673918002, 0.40121100598080073, 0.20177045945375924], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 491.7500000000001, 307, 1571, 459.5, 669.6000000000001, 777.55, 1268.7300000000002, 0.4770423375074538, 0.4196668157423971, 0.22081842576028624], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 4.128000000000002, 1, 31, 3.0, 7.0, 11.0, 21.980000000000018, 0.4772203631837852, 0.43248095413530535, 0.23301775546083264], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1431.0000000000005, 925, 3245, 1333.0, 2007.2000000000003, 2270.3999999999996, 2924.94, 0.47680350927382825, 0.45119394578744093, 0.25190497902064557], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 62.0, 16.129032258064516, 7.544732862903226, 1062.043220766129], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 53.55200000000001, 27, 700, 45.0, 73.90000000000003, 97.0, 177.8800000000001, 0.4761229120819998, 0.2571249710755331, 21.777973589938192], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 55.89999999999996, 29, 232, 48.0, 80.90000000000003, 106.84999999999997, 182.7900000000002, 0.47664215137201443, 107.86216387791286, 0.14708878889995755], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 1.7657039141414141, 1.380997474747475], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.952, 1, 17, 2.0, 5.0, 7.0, 12.990000000000009, 0.47940201310493347, 0.5210687896345615, 0.2055248864776033], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 4.081999999999996, 2, 29, 3.0, 6.900000000000034, 9.0, 19.99000000000001, 0.4793969569798759, 0.4920373064314936, 0.1764967312318488], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.8060000000000005, 1, 23, 2.0, 5.0, 7.949999999999989, 13.0, 0.4793831680899553, 0.2719937701760391, 0.18585460715987523], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 164.76200000000014, 86, 744, 140.0, 243.0, 318.95, 651.8700000000001, 0.47933812991021996, 0.4367406984435891, 0.15634661659181004], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 215.26199999999992, 111, 660, 197.0, 300.0, 377.0, 576.97, 0.4764759079486664, 0.2573156026324341, 140.950321371088], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.970000000000002, 1, 32, 2.0, 5.0, 6.0, 16.970000000000027, 0.47939327986500285, 0.26677486972487624, 0.20083956744344358], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.87, 1, 27, 3.0, 6.0, 8.0, 16.99000000000001, 0.47944062703162965, 0.257437142936593, 0.20413682947831105], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 15.369999999999987, 7, 401, 11.0, 27.0, 32.94999999999999, 49.99000000000001, 0.47595974903594357, 0.20126032356695658, 0.3453497007165098], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 5.395999999999999, 2, 81, 4.0, 8.0, 11.0, 15.0, 0.47940385172230626, 0.2467244432203666, 0.19288514346639668], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.409999999999999, 2, 39, 4.0, 7.0, 10.0, 16.0, 0.47715797078075445, 0.29309801134872515, 0.23857898539037722], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 5.261999999999999, 2, 36, 4.0, 8.0, 12.0, 21.970000000000027, 0.4771443103880996, 0.2795767443680271, 0.22505927921626181], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 673.4220000000007, 380, 2226, 614.0, 969.0, 1231.85, 1692.6500000000003, 0.4766117101590739, 0.43511297961436396, 0.20991394656420154], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 20.554000000000013, 6, 212, 17.0, 37.0, 45.0, 60.99000000000001, 0.47674304408061535, 0.4222714267393732, 0.19600470855267488], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 9.257999999999997, 4, 60, 8.0, 14.0, 22.0, 38.960000000000036, 0.4775366748166259, 0.3185132313474175, 0.2233789719112928], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 644.5460000000004, 411, 4340, 623.0, 767.6000000000001, 805.95, 912.9100000000001, 0.4773442855206203, 0.3589405271981227, 0.2638445953170616], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 18.014000000000006, 9, 90, 15.0, 28.0, 39.0, 73.95000000000005, 0.4795238519959221, 0.3914862697935458, 0.29595612740373317], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 17.48800000000002, 8, 79, 15.0, 30.0, 36.0, 69.97000000000003, 0.479531670189626, 0.3984421154923256, 0.3034536350418727], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 18.37199999999999, 8, 97, 15.0, 32.900000000000034, 43.94999999999999, 77.96000000000004, 0.4794912022954203, 0.3881818424833041, 0.2926582045260134], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 21.510000000000016, 11, 92, 18.0, 34.0, 43.94999999999999, 78.92000000000007, 0.47949672024243356, 0.4289248005293644, 0.3334000632935671], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 17.758, 8, 93, 15.0, 28.900000000000034, 37.0, 77.99000000000001, 0.4793243444041279, 0.3599613484831781, 0.26447095174641827], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2702.4700000000003, 1643, 6712, 2531.5, 3762.8, 4137.199999999999, 5193.000000000003, 0.47860629845888775, 0.3995427814205035, 0.3047376040968699], "isController": false}]}, function(index, item){
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
