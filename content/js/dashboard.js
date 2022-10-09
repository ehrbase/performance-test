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

    var data = {"OkPercent": 97.78345032971708, "KoPercent": 2.2165496702829186};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8981493299298021, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.499, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.96, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.487, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.991, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.967, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.721, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.595, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.994, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 521, 2.2165496702829186, 190.38485428632117, 1, 3986, 16.0, 563.0, 1257.9500000000007, 2266.9900000000016, 25.762376736809454, 169.78088317829418, 213.4443661652475], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 24.357999999999983, 15, 60, 25.0, 29.0, 31.0, 46.940000000000055, 0.5585799556934379, 0.3243756716923967, 0.2825629072746102], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.374000000000003, 4, 29, 7.0, 9.0, 12.0, 19.0, 0.5585674755096091, 5.971006673694376, 0.20291709071247516], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.779999999999995, 5, 32, 7.0, 9.0, 12.0, 23.0, 0.5585506281460364, 5.997715554112943, 0.23672946544470685], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 22.26799999999999, 14, 263, 20.0, 28.0, 34.0, 52.0, 0.5544718710875078, 0.29934225254474867, 6.173914330214614], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.517999999999994, 26, 86, 43.0, 52.0, 54.0, 62.98000000000002, 0.5583610094273672, 2.322260516869203, 0.23337745315909494], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.6699999999999995, 1, 17, 2.0, 4.0, 5.0, 11.0, 0.5583921878699348, 0.3489318620536771, 0.23720761887052896], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.893999999999984, 23, 80, 39.0, 47.0, 48.94999999999999, 65.98000000000002, 0.5583516565735299, 2.291655136123342, 0.2039292183188478], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 774.2180000000004, 576, 1527, 769.0, 921.9000000000001, 945.8499999999999, 1116.4400000000005, 0.5580326002645074, 2.35994166466705, 0.272476855597904], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 10.909999999999998, 6, 33, 11.0, 14.0, 15.0, 27.0, 0.5579454217788415, 0.8297084316712139, 0.28605600237684753], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.6179999999999986, 2, 26, 3.0, 5.0, 7.0, 15.980000000000018, 0.5553587117455036, 0.5357400144421033, 0.3047964804697002], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 17.282000000000004, 10, 48, 18.0, 22.0, 23.0, 32.99000000000001, 0.5583416805414575, 0.9097468852211423, 0.3658664723079277], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 613.0, 613, 613, 613.0, 613.0, 613.0, 613.0, 1.6313213703099512, 0.6961791394779772, 1929.5138534869495], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.6379999999999955, 2, 21, 4.0, 6.0, 8.0, 16.0, 0.5553661140033344, 0.5580149500392644, 0.3270368815859479], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 18.30400000000001, 11, 38, 19.0, 23.0, 25.0, 35.99000000000001, 0.5583354457024362, 0.8772431301010922, 0.3331474192619029], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 10.634000000000018, 6, 30, 11.0, 13.0, 15.949999999999989, 22.99000000000001, 0.5583360691800724, 0.8641581080726461, 0.320061789656936], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2011.784, 1506, 2775, 1992.0, 2283.9, 2371.8, 2603.71, 0.5570267250282134, 0.850645085687421, 0.3078878187167664], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 19.95799999999999, 12, 215, 17.0, 25.0, 31.0, 63.99000000000001, 0.5544368252503837, 0.2993233323787779, 4.471229788005536], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 21.95200000000002, 14, 60, 23.0, 27.0, 29.0, 41.960000000000036, 0.5583535271192308, 1.0108303571927102, 0.466748651576232], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 17.272, 11, 37, 18.0, 22.0, 24.0, 30.980000000000018, 0.5583460450116248, 0.9452591343319167, 0.4013112198521053], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 92.0, 92, 92, 92.0, 92.0, 92.0, 92.0, 10.869565217391305, 5.063264266304348, 1482.4431046195652], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 679.0, 679, 679, 679.0, 679.0, 679.0, 679.0, 1.4727540500736376, 0.6745328608247422, 2816.5615795287185], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.384000000000001, 1, 18, 2.0, 3.0, 4.0, 10.990000000000009, 0.5552427687958006, 0.4663247603155778, 0.23586973088493485], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 426.68200000000013, 316, 936, 426.0, 493.80000000000007, 530.8499999999999, 755.7300000000002, 0.5550535404645132, 0.4886097289507046, 0.2580131692003011], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.1239999999999988, 1, 18, 3.0, 4.0, 5.0, 11.0, 0.5553309550359632, 0.5031428608318413, 0.2722423236602085], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1209.7479999999998, 933, 2547, 1191.0, 1380.0, 1418.95, 1861.89, 0.5547610145025624, 0.5248385922828305, 0.2941750301512611], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 8.20655153508772, 1155.2391721491229], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 4, 0.8, 45.130000000000024, 11, 756, 43.0, 54.900000000000034, 63.0, 86.97000000000003, 0.5539828597703187, 0.29824078414888844, 25.340387843400126], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 43.52200000000001, 9, 205, 44.0, 53.0, 60.94999999999999, 85.94000000000005, 0.554782558524012, 121.75867640046535, 0.17228598985413657], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 289.0, 289, 289, 289.0, 289.0, 289.0, 289.0, 3.4602076124567476, 1.8145815311418687, 1.4259839965397925], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.3519999999999968, 1, 21, 2.0, 4.0, 5.0, 10.990000000000009, 0.5585849479231253, 0.6069756419956452, 0.24056246292392408], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.326000000000002, 1, 23, 3.0, 5.0, 7.0, 11.0, 0.5585787076499589, 0.573085389438282, 0.2067395802727875], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2599999999999993, 1, 30, 2.0, 3.0, 4.0, 7.990000000000009, 0.5585805797172688, 0.3168341052684203, 0.217650050104678], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 123.07000000000002, 83, 245, 122.0, 148.0, 156.0, 194.91000000000008, 0.5585163125859417, 0.5088192692875231, 0.18326316506726212], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 16, 3.2, 168.04199999999997, 30, 731, 169.0, 201.0, 229.95, 336.97, 0.5545585824595338, 0.29581584509736936, 164.0496931627363], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.3520000000000025, 1, 18, 2.0, 3.0, 4.0, 8.990000000000009, 0.5585755875656606, 0.3114080720037447, 0.23510359203203096], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.2840000000000016, 1, 28, 3.0, 5.0, 6.0, 10.990000000000009, 0.5586305061415838, 0.30049629607025785, 0.23894547040040398], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 12.219999999999999, 7, 351, 10.0, 16.0, 20.94999999999999, 46.840000000000146, 0.5537883553814937, 0.23401343677453726, 0.4029026608976688], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.608000000000004, 2, 71, 4.0, 5.0, 6.0, 12.990000000000009, 0.558586820032264, 0.28741255672449156, 0.22583490575523174], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.888, 2, 22, 3.0, 5.0, 7.0, 15.980000000000018, 0.5552347532536757, 0.34096293842724207, 0.2787018195042864], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.058, 2, 42, 4.0, 5.0, 6.0, 13.990000000000009, 0.5552113245343443, 0.32522479292005624, 0.26296630117105174], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 525.0140000000002, 372, 932, 518.5, 632.0, 653.0, 783.98, 0.5547296247808817, 0.5069318667206604, 0.24540285158763617], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 15.945999999999996, 5, 117, 15.0, 28.0, 34.94999999999999, 49.99000000000001, 0.554903851809597, 0.4913446010491012, 0.22922297784712842], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 9.487999999999996, 5, 43, 10.0, 11.0, 13.0, 19.970000000000027, 0.5553728995796938, 0.37002044848305443, 0.26087340302522727], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 562.0260000000003, 417, 3986, 540.5, 638.9000000000001, 672.0, 740.9100000000001, 0.5551428993337175, 0.41715844520850615, 0.3079308269741714], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 174.11200000000005, 139, 379, 176.0, 191.0, 195.0, 342.99, 0.5584402094820914, 10.797356375460573, 0.28249221534347985], "isController": false}, {"data": ["Query single patient #1", 500, 1, 0.2, 260.44400000000013, 26, 530, 259.0, 287.0, 297.0, 486.84000000000015, 0.5585069545285978, 1.0808124045651242, 0.400336039671866], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 17.59200000000001, 11, 50, 18.0, 21.0, 22.0, 31.960000000000036, 0.5579130481356219, 0.4550728923858259, 0.34542663331834406], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 17.235999999999997, 11, 44, 18.0, 21.0, 23.0, 28.0, 0.5579348376744383, 0.4639348044075736, 0.3541578559456884], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 16.716, 11, 44, 18.0, 21.0, 22.0, 33.0, 0.5578869029354894, 0.45158547622341805, 0.3415967657622576], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 19.93800000000002, 13, 60, 21.0, 24.0, 25.0, 36.99000000000001, 0.55789873022249, 0.49899464905380375, 0.3890036068152909], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 17.356000000000012, 10, 45, 18.0, 21.0, 23.94999999999999, 41.99000000000001, 0.5576013328902262, 0.41861920066733727, 0.30874995678589673], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2195.182, 1666, 2976, 2195.5, 2524.0, 2592.7, 2784.86, 0.556593292828184, 0.4651511025556538, 0.3554804819430004], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 95.96928982725528, 2.1272069772388855], "isController": false}, {"data": ["400", 1, 0.19193857965451055, 0.0042544139544777706], "isController": false}, {"data": ["500", 20, 3.838771593090211, 0.08508827908955541], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 521, "No results for path: $['rows'][1]", 500, "500", 20, "400", 1, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 4, "500", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 16, "500", 16, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Query single patient #1", 500, 1, "400", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
