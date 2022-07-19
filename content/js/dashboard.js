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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8798978940650926, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.38, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.841, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.32, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.961, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [0.999, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.54, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.943, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.874, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 286.0821952776035, 1, 6898, 25.0, 798.9000000000015, 1877.0, 3739.9100000000144, 17.115457431625547, 115.28869847568302, 141.77017903010588], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 35.175999999999995, 14, 89, 30.0, 56.0, 63.0, 75.99000000000001, 0.3714699213375295, 0.21573913761586147, 0.18718601504898946], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 15.94199999999998, 5, 127, 13.0, 27.0, 36.0, 73.97000000000003, 0.37123658907821955, 3.973337237118091, 0.13413822066302855], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 15.51999999999998, 5, 47, 14.0, 27.0, 31.0, 39.99000000000001, 0.3712266665478741, 3.9862312203389894, 0.1566112499498844], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 65.36999999999992, 13, 397, 55.0, 125.90000000000003, 142.89999999999998, 191.95000000000005, 0.36893943195133544, 0.19913722015021737, 4.107333519770726], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 68.74999999999993, 26, 155, 60.0, 116.0, 125.0, 145.0, 0.3710765152352885, 1.5432688146461673, 0.15437362840843055], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 6.940000000000006, 1, 45, 5.0, 13.0, 16.0, 20.99000000000001, 0.37109909904560734, 0.2318318404789702, 0.15691983387377734], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 62.59200000000008, 23, 157, 54.5, 102.0, 115.94999999999999, 141.98000000000002, 0.3710682535524219, 1.5229416600461905, 0.13480213898584079], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1161.598000000002, 587, 2544, 909.5, 2261.4, 2373.7, 2494.84, 0.37079444935541095, 1.568167216570285, 0.18032776931542446], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 18.636000000000006, 6, 63, 17.0, 31.0, 37.94999999999999, 52.99000000000001, 0.3711288477711115, 0.5518765701069817, 0.18955115955497198], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 10.715999999999992, 2, 41, 7.0, 23.0, 25.0, 32.0, 0.3697655981919941, 0.3566613076076314, 0.20221556151124678], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 26.57999999999999, 9, 79, 21.0, 45.0, 50.89999999999998, 71.0, 0.3710569631807597, 0.6046742822552397, 0.2424190511405549], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 1119.0, 1119, 1119, 1119.0, 1119.0, 1119.0, 1119.0, 0.8936550491510277, 0.38137427390527256, 1057.0062904937445], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 10.221999999999989, 3, 44, 8.0, 20.0, 22.94999999999999, 31.0, 0.36977516930156124, 0.37147599063692294, 0.21702624682640462], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 27.87399999999999, 10, 105, 23.5, 46.0, 50.94999999999999, 64.0, 0.3710525573684359, 0.5829257417618912, 0.22067481195056393], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 18.273999999999997, 6, 60, 15.0, 33.0, 37.0, 51.97000000000003, 0.3710498037888637, 0.5742249360959475, 0.2119766945473489], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2891.7639999999988, 1545, 6074, 2565.5, 4367.900000000001, 4894.249999999999, 5903.660000000002, 0.37029027795469427, 0.5654556743559912, 0.20394894215473394], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 64.71200000000002, 13, 195, 52.0, 132.90000000000003, 150.89999999999998, 187.97000000000003, 0.36892418755515416, 0.19912899189805594, 2.9744512621634307], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 32.422000000000025, 13, 80, 28.0, 54.0, 59.94999999999999, 69.98000000000002, 0.37107128279342466, 0.6717368629169913, 0.30946765186092245], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 26.483999999999984, 9, 73, 21.5, 45.0, 52.0, 59.99000000000001, 0.3710696304740192, 0.6282491494620233, 0.26598155153118175], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 79.0, 79, 79, 79.0, 79.0, 79.0, 79.0, 12.658227848101266, 5.896459651898734, 1726.3647151898733], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 1330.0, 1330, 1330, 1330.0, 1330.0, 1330.0, 1330.0, 0.7518796992481204, 0.34436677631578944, 1437.9273378759399], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 8.177999999999999, 1, 48, 5.0, 19.0, 21.94999999999999, 34.98000000000002, 0.3694003524079362, 0.310494704415073, 0.15620151620374645], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 577.8599999999997, 315, 1344, 468.0, 1151.6000000000001, 1216.0, 1284.0, 0.36932258850815836, 0.32521667117548, 0.17095596382115924], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 10.342000000000008, 2, 59, 7.0, 23.0, 25.0, 35.99000000000001, 0.3694912548809795, 0.3347468086578452, 0.18041565179735325], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1720.6200000000003, 933, 3740, 1331.0, 3294.000000000001, 3541.8, 3657.9700000000003, 0.36924867495112995, 0.3493114100702237, 0.1950815753403919], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 68.0, 68, 68, 68.0, 68.0, 68.0, 68.0, 14.705882352941176, 6.879021139705882, 968.3335248161764], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 93.91599999999991, 28, 784, 82.0, 158.90000000000003, 176.95, 216.93000000000006, 0.36871470478488444, 0.19901592234536475, 16.86509701436955], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 111.73799999999991, 29, 328, 95.5, 216.90000000000003, 235.89999999999998, 279.97, 0.3691238255402681, 83.53110319830107, 0.11390930553781711], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 1.1891475340136055, 0.9300595238095238], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 8.323999999999991, 1, 40, 6.0, 19.0, 21.0, 28.0, 0.37126057071659974, 0.40342319300983176, 0.15916346732869852], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 9.956000000000003, 1, 51, 7.0, 20.0, 24.0, 34.98000000000002, 0.3712542304419559, 0.3809380199879565, 0.13668246569982165], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 6.538, 1, 36, 5.0, 13.0, 16.0, 19.0, 0.37124513390440733, 0.21053297041955898, 0.14392999820317356], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 191.142, 83, 453, 142.5, 371.0, 389.9, 439.96000000000004, 0.37121784696618504, 0.3381236309021782, 0.12108082117842364], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 306.47799999999984, 114, 753, 275.5, 486.7000000000001, 516.9, 598.8300000000002, 0.3690053240088148, 0.19917278577432818, 109.1585495489279], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 6.601999999999997, 1, 28, 5.0, 13.0, 16.0, 19.99000000000001, 0.37125257649288085, 0.20691167766626176, 0.15553452667524015], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 9.586, 2, 54, 7.0, 20.0, 24.0, 33.0, 0.3712870368101394, 0.19967918363448425, 0.15808705864181719], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 56.294000000000004, 7, 506, 42.5, 121.90000000000003, 147.0, 175.98000000000002, 0.3685940202254911, 0.15575617040212134, 0.2674466377222069], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 10.256000000000006, 2, 96, 8.0, 20.0, 23.0, 30.980000000000018, 0.371261122055064, 0.19096381406017846, 0.14937459207684214], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 9.462000000000007, 2, 48, 7.0, 20.0, 24.0, 28.0, 0.3693954400349301, 0.22679942100035239, 0.184697720017465], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 10.718000000000007, 2, 46, 8.0, 21.0, 24.0, 32.99000000000001, 0.36938370545047816, 0.21633115429268193, 0.17423079075447362], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 808.4799999999998, 377, 1841, 626.5, 1592.8000000000004, 1643.8, 1735.98, 0.3689127550847245, 0.3371048379495386, 0.16248012943672924], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 29.216000000000005, 7, 139, 26.0, 52.0, 58.0, 83.96000000000004, 0.3691824233724962, 0.32689589364851174, 0.15178300804670009], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 16.29799999999999, 5, 111, 15.0, 28.0, 32.0, 43.0, 0.3697806387294929, 0.24653607408887898, 0.17297356049944052], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 821.9239999999999, 463, 6223, 796.0, 973.0, 1032.6, 1234.4400000000005, 0.36963220117454326, 0.27784140777935323, 0.20430842369608546], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 258.64400000000006, 143, 609, 194.0, 506.90000000000003, 526.0, 572.9100000000001, 0.3713184701976083, 7.179322958091883, 0.18710969787301351], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 384.67999999999984, 209, 827, 309.0, 679.9000000000001, 733.95, 817.8000000000002, 0.3711985555921805, 0.7194545754583559, 0.26534896747409775], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 26.826000000000008, 9, 72, 22.0, 46.0, 51.0, 63.98000000000002, 0.37112223653104626, 0.3028814104407819, 0.22905200535900508], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 27.24200000000002, 9, 73, 22.0, 48.0, 51.0, 65.95000000000005, 0.37112499118578146, 0.3086824865652753, 0.23485253348475232], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 26.653999999999993, 10, 77, 21.0, 48.0, 52.94999999999999, 64.0, 0.37109524307851705, 0.30032259657382604, 0.2264985614492902], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 29.353999999999985, 12, 75, 24.5, 49.0, 55.94999999999999, 65.99000000000001, 0.37110736210207085, 0.33186203374071027, 0.2580355877115961], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 28.041999999999994, 9, 85, 23.0, 51.0, 56.0, 67.96000000000004, 0.37133722247184336, 0.27876038699836986, 0.20488821357089015], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 3277.707999999999, 1694, 6898, 2830.5, 5188.200000000002, 5809.5, 6747.88, 0.37026395376736165, 0.30941266394362216, 0.23575400181281234], "isController": false}]}, function(index, item){
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
