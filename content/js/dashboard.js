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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8819612848330143, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.379, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.842, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.361, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.965, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.553, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.507, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [0.964, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.884, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 278.74558604552385, 1, 6775, 21.0, 794.9000000000015, 1812.9500000000007, 3829.9900000000016, 17.445990168492415, 117.51655195739482, 144.50803663444546], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 31.682, 12, 121, 27.0, 51.900000000000034, 59.94999999999999, 79.97000000000003, 0.3784043144146312, 0.2197664353764896, 0.19068029906049777], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 13.364000000000004, 5, 135, 11.0, 23.0, 27.94999999999999, 41.97000000000003, 0.3780583979246106, 4.047781920746484, 0.13660313206260344], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 13.70199999999999, 5, 182, 11.0, 24.0, 28.0, 43.960000000000036, 0.3780080939093068, 4.059050174101078, 0.1594721646179888], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 53.90199999999997, 15, 328, 43.0, 113.0, 129.89999999999998, 165.0, 0.3751931306640093, 0.202512690673149, 4.176954774970416], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 72.29399999999995, 28, 165, 64.0, 116.0, 132.0, 152.0, 0.3779349483249545, 1.5717923279111006, 0.15722684373674864], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 5.354000000000002, 1, 40, 4.0, 12.0, 14.0, 19.980000000000018, 0.37796723175287594, 0.23612247834436745, 0.1598240345205032], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 63.92000000000004, 27, 154, 56.0, 104.0, 117.94999999999999, 140.99, 0.3779226649292302, 1.5510735968014895, 0.13729221811882192], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1142.3480000000004, 579, 2555, 896.0, 2101.1000000000004, 2267.45, 2424.79, 0.37780415690357755, 1.5978127347108326, 0.1837367872441227], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 15.45, 6, 68, 12.0, 27.0, 30.94999999999999, 45.0, 0.37816734056086754, 0.5623429601029675, 0.19314601475911497], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 8.042, 1, 45, 5.0, 19.0, 23.0, 34.97000000000003, 0.3760710503514008, 0.3627432979908028, 0.2056638556609223], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 23.751999999999992, 9, 81, 18.0, 40.0, 44.94999999999999, 57.99000000000001, 0.3779343769865176, 0.615881713106613, 0.24691220527732446], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 728.0, 728, 728, 728.0, 728.0, 728.0, 728.0, 1.3736263736263736, 0.5862057864010989, 1624.7115921188188], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 8.202000000000005, 2, 32, 6.0, 19.0, 21.94999999999999, 27.99000000000001, 0.37607925343755244, 0.37780907109740675, 0.22072620245700098], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 24.72000000000001, 9, 84, 20.0, 42.0, 48.0, 54.99000000000001, 0.3779300920033016, 0.5937303889713196, 0.22476506448243228], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 15.222000000000008, 6, 45, 12.0, 27.0, 31.0, 39.99000000000001, 0.37792152232835935, 0.5848593902822016, 0.21590243218954125], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2941.93, 1558, 6298, 2714.5, 4387.0, 4662.349999999999, 5368.87, 0.37728047181186686, 0.5761301236102875, 0.2077990098651298], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 49.884, 13, 392, 38.0, 106.0, 132.0, 183.95000000000005, 0.37517623903828823, 0.20250357331919167, 3.0248584272461985], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 30.620000000000008, 11, 99, 28.0, 49.0, 56.0, 74.94000000000005, 0.37793666235062995, 0.6841650101230335, 0.31519327114007617], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 24.19200000000001, 9, 116, 19.0, 42.900000000000034, 48.0, 58.97000000000003, 0.37793580533584886, 0.6398741065125142, 0.27090320421534475], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 1.990685096153846, 582.832532051282], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 1454.0, 1454, 1454, 1454.0, 1454.0, 1454.0, 1454.0, 0.687757909215956, 0.3149984955295736, 1315.2980463376891], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 5.902, 1, 35, 4.0, 14.0, 19.94999999999999, 28.0, 0.37587287077415527, 0.3159350962929914, 0.15893843070821215], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 574.06, 316, 1408, 462.0, 1069.9, 1173.8, 1302.97, 0.37579094599358, 0.33091255264831154, 0.17395010586030948], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 7.543999999999991, 2, 40, 5.0, 17.900000000000034, 23.0, 28.0, 0.3760489886538499, 0.34068789771881164, 0.18361767024113765], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1537.702, 918, 3619, 1280.5, 2631.6000000000004, 3189.75, 3510.8500000000004, 0.3757949001625689, 0.35550417747703333, 0.1985400790897947], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 121.0, 121, 121, 121.0, 121.0, 121.0, 121.0, 8.264462809917356, 3.8658961776859506, 544.1874354338843], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 83.4139999999999, 29, 739, 66.5, 148.90000000000003, 170.84999999999997, 238.8900000000001, 0.374977876305298, 0.20239650587177857, 17.151575947644087], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 96.308, 30, 339, 80.0, 179.80000000000007, 216.0, 267.93000000000006, 0.3753449420016996, 84.93891457538541, 0.11582910319583697], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 559.0, 559, 559, 559.0, 559.0, 559.0, 559.0, 1.7889087656529516, 0.9381289132379248, 0.7337321109123434], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 6.172000000000002, 1, 48, 4.0, 16.0, 19.0, 24.0, 0.37814875010493626, 0.410908101298109, 0.16211650517194046], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 7.449999999999995, 2, 62, 5.0, 16.0, 20.0, 34.99000000000001, 0.37814388828721995, 0.38800738756080555, 0.13921899012136907], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 4.862000000000006, 1, 28, 3.0, 11.900000000000034, 13.949999999999989, 18.99000000000001, 0.3780967065508279, 0.21441849459094853, 0.14658632080144401], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 189.0139999999999, 89, 495, 139.5, 361.90000000000003, 391.95, 441.9000000000001, 0.3780432481475881, 0.3443405449020868, 0.1233070750793891], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 298.9520000000001, 116, 1346, 263.0, 471.0, 526.9, 645.96, 0.3752528265919163, 0.20254491190001764, 111.00667551325206], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 4.976, 1, 19, 3.0, 11.0, 13.0, 17.99000000000001, 0.37813902659451776, 0.21074973033960664, 0.15841957266508602], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 7.254000000000001, 2, 43, 5.0, 16.0, 20.0, 27.99000000000001, 0.37825316635725553, 0.20342558715293382, 0.16105310598805023], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 41.76200000000003, 8, 441, 30.0, 98.0, 123.94999999999999, 168.99, 0.37486120763787206, 0.15840448550486683, 0.2719940207763076], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 9.179999999999996, 2, 355, 7.0, 16.900000000000034, 20.0, 28.0, 0.378152468049898, 0.19450848285797046, 0.15214728206695113], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 7.383999999999996, 2, 43, 5.0, 16.0, 20.0, 25.99000000000001, 0.37587089285875375, 0.2307751846183858, 0.18793544642937687], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 8.665999999999995, 2, 45, 6.0, 19.0, 24.0, 35.99000000000001, 0.375862416314233, 0.22012543914825067, 0.17728666707009233], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 824.4179999999999, 378, 1922, 629.0, 1530.9, 1608.9, 1744.8400000000001, 0.375370866416019, 0.3430061263809894, 0.16532447339221149], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 27.741999999999987, 6, 199, 24.0, 51.0, 60.0, 87.95000000000005, 0.37542131657252353, 0.332420177685032, 0.15434802175491447], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 12.506000000000004, 4, 76, 10.0, 23.0, 27.94999999999999, 36.0, 0.3760837794313764, 0.25073843462460443, 0.1759220022926067], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 803.0280000000005, 436, 6082, 767.0, 981.8000000000001, 1063.95, 1312.4500000000005, 0.3759794264057871, 0.2826124260730453, 0.20781675326726123], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 252.63199999999952, 143, 620, 190.0, 483.7000000000001, 529.0, 591.9200000000001, 0.37833674088624625, 7.315018960109309, 0.19064624833721], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 370.11600000000016, 204, 895, 292.0, 665.9000000000001, 723.95, 805.98, 0.37820052191672027, 0.7330257400911464, 0.2703542793389055], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 23.00799999999999, 9, 72, 18.0, 40.0, 43.0, 55.98000000000002, 0.37814932209171026, 0.30861637691920235, 0.23338903472847744], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 23.104, 8, 67, 17.5, 40.0, 45.0, 57.98000000000002, 0.37816276427904777, 0.31453614058994905, 0.23930612427033493], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 22.449999999999992, 9, 68, 17.0, 40.0, 46.0, 59.98000000000002, 0.37812043892220554, 0.30600799701095793, 0.23078640070935397], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 26.279999999999998, 11, 80, 22.0, 43.0, 48.0, 59.98000000000002, 0.3781321632411674, 0.3381439484390326, 0.2629200197536242], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 24.904000000000007, 9, 95, 19.0, 44.0, 51.0, 58.98000000000002, 0.3777042681337707, 0.28354008589561613, 0.2084012807574028], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 3258.267999999997, 1692, 6775, 2901.5, 5013.600000000001, 5310.4, 6617.560000000001, 0.3772292361711534, 0.31523323211329857, 0.2401889277183516], "isController": false}]}, function(index, item){
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
