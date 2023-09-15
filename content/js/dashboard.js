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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8932354818123803, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.204, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.666, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.984, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.133, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 323.99242714316216, 1, 17833, 9.0, 839.9000000000015, 1495.0, 6089.960000000006, 15.292290616629659, 96.33009117633856, 126.54500985939616], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6216.072000000002, 5245, 17833, 6070.0, 6559.8, 6751.25, 15093.860000000072, 0.32983988912102286, 0.1915616020109019, 0.16620838162739043], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.378000000000003, 1, 14, 2.0, 3.0, 4.0, 6.990000000000009, 0.3309761213967457, 0.16991939138621406, 0.1195909813640585], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.616000000000004, 2, 14, 3.0, 5.0, 5.0, 8.0, 0.33097393050738966, 0.18995770380712693, 0.139629626932805], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.021999999999997, 8, 356, 11.0, 15.0, 18.0, 33.0, 0.329114523955588, 0.17121347466443482, 3.6212239662183685], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.664, 24, 67, 33.0, 40.0, 41.94999999999999, 45.0, 0.3309244241418633, 1.3762804241574167, 0.13766973113714234], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2379999999999987, 1, 13, 2.0, 3.0, 4.0, 6.0, 0.3309325281524302, 0.20673910896913192, 0.13993533661133034], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.65200000000002, 21, 46, 29.0, 35.0, 36.0, 41.99000000000001, 0.3309307759002972, 1.3582090636561892, 0.12022094593252983], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 850.42, 662, 1131, 857.0, 1005.0, 1044.0, 1072.98, 0.33077905745169134, 1.3989337616177873, 0.16086715879974833], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.533999999999998, 3, 26, 5.0, 7.0, 8.0, 13.0, 0.33087690320394725, 0.4920210637477368, 0.16899279333560976], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.748, 2, 12, 4.0, 5.0, 5.949999999999989, 8.990000000000009, 0.3292196243867461, 0.31755226094046196, 0.1800419820865018], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.701999999999997, 5, 20, 7.0, 9.900000000000034, 11.0, 14.990000000000009, 0.330929680752137, 0.5392828784842759, 0.21620308244451136], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 545.0, 545, 545, 545.0, 545.0, 545.0, 545.0, 1.834862385321101, 0.793793004587156, 2170.256952408257], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.004000000000004, 2, 15, 4.0, 5.0, 6.0, 8.0, 0.32922135856485824, 0.33073564821216345, 0.19322464501707015], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.058000000000009, 5, 26, 8.0, 10.0, 11.0, 16.99000000000001, 0.3309274904775615, 0.5198890265685135, 0.1968113688484716], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.530000000000003, 4, 18, 6.0, 8.0, 8.0, 12.0, 0.3309279285301571, 0.5121335914267825, 0.18905550604506047], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1554.6299999999992, 1329, 1944, 1528.0, 1763.8000000000002, 1818.6999999999998, 1895.98, 0.33058288374061146, 0.5048200792324526, 0.18207885393525863], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.753999999999996, 7, 75, 10.0, 13.0, 17.94999999999999, 52.98000000000002, 0.3291049923910926, 0.1712085161100185, 2.653409001153184], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 10.854000000000012, 8, 22, 11.0, 13.0, 14.0, 16.99000000000001, 0.3309342804231193, 0.599078305628067, 0.2759940190247499], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.647999999999994, 5, 21, 7.0, 10.0, 10.0, 16.0, 0.3309316520240442, 0.5602924945611383, 0.23721077400942228], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 84.0, 84, 84, 84.0, 84.0, 84.0, 84.0, 11.904761904761903, 5.615234375, 1623.6049107142856], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 1.0128104530567685, 4175.640522652839], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.320000000000001, 1, 18, 2.0, 3.0, 4.0, 7.0, 0.3292770787591259, 0.2767696039636399, 0.13923532724873194], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 549.9639999999999, 412, 717, 537.0, 640.0, 651.0, 679.0, 0.32914268862180057, 0.2898352087472303, 0.15235706485032566], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.205999999999999, 1, 15, 3.0, 4.0, 5.0, 8.990000000000009, 0.3292469398143179, 0.2982867954444735, 0.1607651073312099], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 756.2820000000003, 579, 952, 741.0, 881.9000000000001, 899.95, 924.98, 0.32908679730096174, 0.3113180384896627, 0.17386323958966826], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 61.0, 61, 61, 61.0, 61.0, 61.0, 61.0, 16.393442622950822, 7.764472336065574, 1079.4537653688524], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 25.459999999999987, 16, 1257, 22.0, 27.0, 31.94999999999999, 55.99000000000001, 0.3288344397516116, 0.17106776796882914, 14.99986003984158], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 31.00599999999998, 21, 243, 29.0, 36.0, 40.0, 99.99000000000001, 0.3292334983232138, 74.46294287152683, 0.10159939987317924], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 1.1134056528662422, 0.8708200636942676], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.7379999999999987, 1, 10, 3.0, 4.0, 4.0, 6.990000000000009, 0.33092070081062336, 0.3595886455068249, 0.14186932388267937], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3999999999999986, 2, 12, 3.0, 4.0, 5.0, 7.0, 0.33091916769858293, 0.3395508580982208, 0.12183254513902907], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.834, 1, 9, 2.0, 3.0, 3.0, 5.990000000000009, 0.330977435944282, 0.18769717463594138, 0.12831840045886714], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.90999999999991, 66, 119, 92.5, 112.0, 114.94999999999999, 117.0, 0.3309559663086826, 0.3014511126325892, 0.10794852807333984], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 83.32599999999996, 58, 322, 80.0, 93.0, 103.84999999999997, 301.95000000000005, 0.3291738920335968, 0.17124435939962632, 97.33453395395779], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 214.82199999999995, 12, 371, 265.0, 335.0, 338.0, 355.94000000000005, 0.33091522547570723, 0.18443030110472738, 0.1386353825479281], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 415.4479999999999, 334, 529, 403.0, 487.90000000000003, 495.0, 511.99, 0.33087033456284753, 0.17794297065147047, 0.1408783846380874], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.245999999999999, 4, 254, 6.0, 8.0, 11.949999999999989, 26.0, 0.32878340932613864, 0.14824471476559714, 0.23856061829035258], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 390.89400000000006, 270, 486, 388.5, 453.0, 461.95, 475.0, 0.33084865989750306, 0.17017704849083382, 0.133114890505636], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.429999999999997, 2, 14, 3.0, 5.0, 5.0, 8.0, 0.32927469346172417, 0.20216630129523494, 0.16463734673086206], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.038000000000005, 2, 26, 4.0, 5.0, 6.0, 9.990000000000009, 0.32926948929643673, 0.192838091236295, 0.15530972981462787], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 668.574, 530, 855, 674.0, 782.0, 828.9, 846.0, 0.32910932485196664, 0.300733287458236, 0.14494951709788764], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 244.1479999999999, 177, 316, 239.0, 284.0, 289.0, 301.0, 0.32922742833212726, 0.2915173843193585, 0.13535619856232967], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.442000000000001, 3, 36, 4.0, 5.0, 6.949999999999989, 9.990000000000009, 0.3292239598662824, 0.2194965719143649, 0.15400222341401296], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 984.1939999999994, 817, 8373, 931.0, 1087.7, 1114.95, 1143.0, 0.3290484642321029, 0.24733583340243354, 0.18187639722204127], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.46800000000005, 118, 164, 135.0, 150.0, 151.0, 156.0, 0.33095443286986476, 6.39889730430168, 0.1667700071883303], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 181.0299999999999, 160, 263, 175.5, 202.0, 203.0, 213.94000000000005, 0.3309220149179644, 0.6413908517849933, 0.23655753410151362], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.919999999999999, 4, 16, 7.0, 9.0, 10.0, 13.0, 0.3308731809419695, 0.2700332285595833, 0.2042107913626218], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.8599999999999985, 5, 35, 6.0, 8.0, 10.0, 14.990000000000009, 0.33087471362793536, 0.2752043968203602, 0.20938165471767783], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.168000000000005, 5, 18, 8.0, 10.0, 11.0, 15.0, 0.3308690208659239, 0.2677680334783201, 0.20194642386836179], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.494, 6, 19, 9.0, 12.0, 13.0, 15.0, 0.33087099141522125, 0.2958807378406565, 0.23005873621839604], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.649999999999999, 5, 30, 7.0, 9.0, 10.949999999999989, 15.990000000000009, 0.330870553513349, 0.24838232733520166, 0.18256041282718963], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1611.8500000000004, 1409, 1968, 1587.0, 1816.8000000000002, 1900.6, 1957.99, 0.33054660508803774, 0.27622269085926254, 0.21046522120839906], "isController": false}]}, function(index, item){
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
