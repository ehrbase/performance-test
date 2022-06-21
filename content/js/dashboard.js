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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.91813224267212, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.004, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.997, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.87, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.725, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.805, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 190.52119972733337, 1, 3825, 12.0, 568.0, 1256.800000000003, 2133.9900000000016, 25.91033528597922, 174.20555630169852, 228.2398520981131], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 7.131999999999992, 4, 23, 7.0, 9.0, 12.949999999999989, 18.99000000000001, 0.5999779208125141, 6.418318883990069, 0.21678889716858418], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.346, 5, 33, 7.0, 9.0, 10.0, 15.0, 0.5999592027742113, 6.441851016630869, 0.2531077886703704], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 19.999999999999996, 13, 256, 18.0, 24.0, 30.0, 47.930000000000064, 0.596078281768588, 0.32123031153435316, 6.63602774625186], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.70199999999999, 26, 72, 45.0, 54.0, 56.0, 59.98000000000002, 0.5997440292483168, 2.4944431841490053, 0.24950288716775681], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.299999999999998, 1, 21, 2.0, 3.0, 4.0, 6.990000000000009, 0.5997778422872168, 0.3748611514295105, 0.2536169977640282], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.28399999999998, 23, 73, 40.0, 47.0, 49.0, 53.0, 0.5997303612295912, 2.4609092002235795, 0.21787079529043743], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 751.4979999999995, 562, 1019, 749.5, 893.0, 908.95, 939.8900000000001, 0.5993579677449515, 2.5349798420931497, 0.2914846366572128], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.133999999999999, 5, 33, 8.0, 10.0, 11.949999999999989, 17.980000000000018, 0.5995822111152949, 0.8917614331333926, 0.3062319300911125], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.038, 1, 20, 3.0, 4.0, 5.0, 8.0, 0.5968873518376371, 0.5759030308745952, 0.3264227705362078], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.407999999999992, 8, 34, 13.0, 16.0, 17.0, 22.0, 0.5997109393272443, 0.9774585524777057, 0.39180333829094377], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 651.0, 651, 651, 651.0, 651.0, 651.0, 651.0, 1.5360983102918586, 0.6555419546850998, 1816.8817804339476], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.9340000000000024, 2, 21, 4.0, 5.0, 6.0, 9.990000000000009, 0.5968994654168388, 0.5991378384121518, 0.35032869015187507], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 13.626000000000003, 8, 39, 14.0, 16.0, 18.0, 28.0, 0.5996965535439068, 0.9416172916504248, 0.35665546983226487], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.085999999999984, 5, 24, 8.0, 10.0, 11.0, 18.99000000000001, 0.5996879224051803, 0.9282278877072371, 0.3425951509834282], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1845.2220000000002, 1480, 2307, 1836.0, 2086.9, 2160.65, 2236.83, 0.5985192633424906, 0.9141446561207572, 0.3296531880128562], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 16.69199999999998, 11, 63, 15.0, 21.0, 25.0, 40.0, 0.5960434634893577, 0.3218867532320457, 4.805600424382946], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.063999999999997, 11, 38, 18.0, 21.0, 22.0, 29.980000000000018, 0.5997260451425789, 1.085832116889005, 0.5001621509294554], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.441999999999993, 8, 26, 13.0, 16.0, 17.0, 22.0, 0.5997174131549214, 1.0155371039166345, 0.42987556763253154], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 85.0, 85, 85, 85.0, 85.0, 85.0, 85.0, 11.76470588235294, 5.480238970588235, 1604.503676470588], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 672.0, 672, 672, 672.0, 672.0, 672.0, 672.0, 1.488095238095238, 0.6815592447916666, 2845.8978562127973], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.036, 1, 23, 2.0, 2.0, 3.9499999999999886, 8.990000000000009, 0.5968916271623892, 0.5018786044793135, 0.2523965571887837], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 397.8200000000001, 303, 563, 403.5, 462.0, 470.95, 489.95000000000005, 0.596666543355581, 0.5249034071449625, 0.2761913491704545], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.906, 1, 17, 3.0, 4.0, 5.0, 11.990000000000009, 0.596924406686986, 0.5409627435600811, 0.2914669954526299], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1141.0120000000006, 916, 1388, 1128.0, 1322.8000000000002, 1352.0, 1371.99, 0.5962232832346782, 0.5641995717328157, 0.3149968713183212], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 64.0, 64, 64, 64.0, 64.0, 64.0, 64.0, 15.625, 7.3089599609375, 1028.8543701171875], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 41.12200000000001, 27, 556, 41.0, 47.0, 53.94999999999999, 79.92000000000007, 0.5956564729988921, 0.3216777632503783, 27.245466681955183], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 39.024, 27, 175, 39.0, 46.0, 52.0, 70.99000000000001, 0.5964231311975818, 134.96810832326372, 0.18405245064300377], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 2.009249281609195, 1.5714798850574712], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.0179999999999993, 1, 22, 2.0, 3.0, 3.0, 7.0, 0.6000132002904064, 0.6521627850812718, 0.2572322216088754], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 2.9920000000000013, 2, 23, 3.0, 4.0, 5.0, 11.0, 0.6000060000600006, 0.6158264707647076, 0.22090064650646504], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8420000000000027, 1, 11, 2.0, 3.0, 3.0, 5.0, 0.5999916001175983, 0.34042492155109827, 0.23261393090496732], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 118.84400000000002, 83, 175, 119.0, 144.90000000000003, 149.95, 154.0, 0.5999217702011658, 0.5466084097633669, 0.19567760863983336], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 162.74400000000003, 111, 542, 164.0, 191.0, 205.0, 321.99, 0.5961792067001004, 0.32196005986831594, 176.36075481951272], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.1640000000000015, 1, 21, 2.0, 3.0, 4.0, 7.990000000000009, 0.6000024000096, 0.33389196056784226, 0.25136819297277185], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 443.768, 340, 589, 456.0, 517.0, 526.95, 539.0, 0.5997764033568286, 0.6518116921011847, 0.25771642331738726], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 10.842000000000006, 7, 320, 9.0, 13.0, 17.0, 38.91000000000008, 0.5954486288604423, 0.25178638310212065, 0.4320491516047936], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 2.7719999999999967, 1, 20, 2.0, 3.0, 5.0, 12.990000000000009, 0.6000168004704132, 0.6386897583132328, 0.24375682519110536], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.218000000000001, 2, 13, 3.0, 4.0, 5.0, 8.990000000000009, 0.5968845016551607, 0.36664096830185167, 0.29844225082758036], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.7020000000000044, 2, 33, 3.0, 5.0, 5.0, 9.990000000000009, 0.5968631261541841, 0.3497244879809672, 0.2815282128246786], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 513.634, 362, 886, 527.5, 619.0, 626.95, 649.8900000000001, 0.5962339478915378, 0.544319671725513, 0.2625991313467613], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 14.308000000000007, 5, 106, 14.0, 22.0, 28.94999999999999, 42.0, 0.5965412538104072, 0.5283817550840229, 0.2452576834513491], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.732000000000002, 4, 35, 7.0, 8.0, 9.0, 14.0, 0.5969115794877304, 0.3981353601466015, 0.2792193814205302], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 505.0180000000001, 422, 3825, 494.5, 546.9000000000001, 566.95, 625.95, 0.5966330802018052, 0.44864010913612307, 0.32977961268966965], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 12.315999999999997, 8, 28, 13.0, 15.0, 16.94999999999999, 21.0, 0.5995671125447427, 0.48949033797598135, 0.3700453272737084], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 12.196000000000003, 7, 34, 13.0, 15.0, 17.0, 20.99000000000001, 0.5995692694368365, 0.498181169148084, 0.3794149283154981], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.430000000000001, 8, 28, 13.0, 16.0, 17.0, 22.99000000000001, 0.5995599230165058, 0.48538591423894856, 0.36594233582550406], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 15.231999999999992, 10, 35, 16.0, 19.0, 20.0, 25.99000000000001, 0.5995656746253014, 0.5363302323796642, 0.41688550813790487], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 11.929999999999998, 7, 36, 13.0, 15.0, 16.0, 23.980000000000018, 0.5993608415985193, 0.4501059445207631, 0.33070202685855804], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2087.8419999999965, 1662, 2590, 2079.0, 2358.2000000000003, 2432.45, 2569.98, 0.5981941714352712, 0.49937529834934297, 0.38088144509355154], "isController": false}]}, function(index, item){
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
