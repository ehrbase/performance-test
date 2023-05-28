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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8913422676026377, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.179, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.654, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.942, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.998, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.497, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.124, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 325.3103594979783, 1, 18318, 9.0, 842.0, 1509.9500000000007, 6078.990000000002, 15.211406516345225, 95.82058132261902, 125.8756870270906], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6212.160000000007, 4979, 18318, 6067.0, 6542.0, 6783.9, 15655.300000000076, 0.32802695069426907, 0.19050869906971554, 0.165294830623284], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.357999999999998, 1, 9, 2.0, 3.0, 4.0, 6.0, 0.32908224884278225, 0.16894709867103425, 0.11890667194514594], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.652000000000004, 2, 17, 3.0, 5.0, 5.0, 8.0, 0.32907900002106105, 0.1888701358421658, 0.13883020313388514], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 12.675999999999997, 8, 384, 11.0, 15.0, 18.0, 53.98000000000002, 0.32705004781471697, 0.17013948337048623, 3.598508680398844], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 34.19399999999999, 25, 50, 34.0, 41.0, 42.0, 45.99000000000001, 0.32900472779793843, 1.3682966057816002, 0.13687110746281425], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.265999999999999, 1, 8, 2.0, 3.0, 3.0, 5.990000000000009, 0.3290129545560727, 0.20553991910064967, 0.13912364191677684], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 30.254, 21, 55, 30.0, 36.0, 37.0, 42.0, 0.3290049442863027, 1.35030504824364, 0.11952132741650842], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 856.8960000000001, 672, 1110, 862.0, 1014.8000000000001, 1055.0, 1083.98, 0.3288677478084253, 1.3908504337025642, 0.15993763516464435], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.690000000000006, 3, 16, 5.0, 8.0, 8.0, 12.0, 0.32897442223867096, 0.48919203367875647, 0.16802111604572745], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.8000000000000007, 2, 15, 4.0, 5.0, 5.0, 9.990000000000009, 0.3272270582745579, 0.31563031028160504, 0.17895229749389885], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.754000000000008, 5, 21, 7.0, 10.0, 11.0, 14.990000000000009, 0.32900862463208613, 0.5361523261814535, 0.21494801745982967], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.9550048289183223, 2611.0155387693158], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.050000000000003, 2, 18, 4.0, 5.0, 6.0, 10.0, 0.3272298423144836, 0.328734971764973, 0.19205579612402796], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 8.058000000000007, 5, 21, 8.0, 10.0, 11.0, 14.0, 0.3290079751533177, 0.5168734567469665, 0.19566978209801805], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.631999999999997, 4, 18, 6.0, 8.0, 9.0, 11.990000000000009, 0.329006892694402, 0.5091606571501424, 0.187958039283423], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1576.9140000000002, 1345, 1980, 1550.5, 1791.7, 1850.95, 1907.97, 0.3286770747740345, 0.5019097935497124, 0.1810291700903862], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 10.759999999999998, 7, 63, 10.0, 13.0, 17.0, 33.0, 0.32703892417275504, 0.17013369657819175, 2.636751326142838], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.026, 8, 23, 11.0, 13.0, 15.0, 19.99000000000001, 0.3290101400925176, 0.5955951042879891, 0.27438931605372074], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.857999999999999, 5, 19, 8.0, 10.0, 11.0, 15.0, 0.3290101400925176, 0.5570392284958973, 0.23583344026162886], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 58.0, 17.241379310344826, 8.132408405172413, 2351.4278017241377], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 584.0, 584, 584, 584.0, 584.0, 584.0, 584.0, 1.7123287671232876, 0.794293129280822, 3274.7317797517126], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2259999999999986, 1, 16, 2.0, 3.0, 4.0, 5.990000000000009, 0.3272358388690729, 0.27505386608691385, 0.13837218577178573], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 556.0899999999997, 438, 712, 542.5, 648.0, 670.8, 699.99, 0.32713649574002857, 0.2880686030993566, 0.15142841697341167], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.2040000000000006, 1, 11, 3.0, 4.0, 5.0, 7.990000000000009, 0.3272332688901949, 0.2964624764473855, 0.15978186957529047], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 756.9520000000006, 612, 938, 731.5, 883.0, 900.95, 921.99, 0.3270934800456623, 0.3094323486865561, 0.17281012959443678], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 48.0, 48, 48, 48.0, 48.0, 48.0, 48.0, 20.833333333333332, 9.867350260416666, 1371.8058268229167], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 22.465999999999994, 15, 585, 20.0, 25.0, 35.89999999999998, 67.86000000000013, 0.3269161865357607, 0.17006984543893075, 14.912358469809945], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 29.908000000000015, 20, 329, 28.0, 34.0, 40.0, 106.94000000000005, 0.3271726719210598, 73.99684449626042, 0.10096344172563955], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 1.1253520654506437, 0.880163626609442], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.696000000000001, 1, 7, 3.0, 4.0, 4.0, 7.0, 0.3290333067255066, 0.3575377448501352, 0.14106017739501697], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.373999999999998, 2, 16, 3.0, 4.0, 5.0, 7.0, 0.32903135800454325, 0.3376138068056188, 0.12113752145284454], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.7799999999999994, 1, 11, 2.0, 3.0, 3.0, 6.0, 0.32908289861482426, 0.18662278325645956, 0.1275838972168801], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 91.42399999999992, 67, 125, 90.0, 110.0, 113.0, 118.0, 0.3290662219446366, 0.2997298397167793, 0.10733214661084826], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 80.94399999999997, 57, 393, 79.0, 91.90000000000003, 99.94999999999999, 301.9200000000001, 0.32711573550991785, 0.17017365572606283, 96.72595073735158], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 200.536, 13, 345, 259.0, 333.0, 338.0, 341.99, 0.3290257284958655, 0.18337722022448769, 0.13784378664524052], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 427.31399999999996, 333, 548, 416.5, 504.0, 515.95, 527.99, 0.32899606849698143, 0.1769349852363014, 0.14008035728973037], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.125999999999994, 4, 288, 6.0, 8.0, 9.949999999999989, 23.980000000000018, 0.32685848465791645, 0.147376788038483, 0.23716392002034367], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 398.5719999999999, 294, 510, 391.5, 468.0, 479.0, 494.0, 0.3289685782372811, 0.1692099998470296, 0.13235845140015606], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.3460000000000005, 2, 12, 3.0, 4.0, 5.0, 9.0, 0.32723391138113, 0.20091331291448264, 0.163616955690565], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.206, 2, 30, 4.0, 5.0, 6.0, 12.980000000000018, 0.32722962815588436, 0.19164343779430215, 0.15434756874930872], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 674.622, 529, 863, 678.5, 806.0, 836.0, 851.0, 0.3270780741904654, 0.2988771726569926, 0.1440548940038085], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 242.21999999999997, 166, 309, 238.0, 283.0, 289.0, 302.99, 0.32718209188451, 0.2897063227857461, 0.134515293636112], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.555999999999998, 3, 48, 4.0, 5.0, 7.0, 11.0, 0.32723284056430646, 0.21816907478677508, 0.1530708306936551], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 988.6280000000011, 812, 8758, 934.0, 1095.9, 1119.95, 1148.94, 0.32706416737312527, 0.245844297137469, 0.1807796081378798], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.58600000000007, 118, 172, 136.0, 149.0, 151.0, 161.95000000000005, 0.3290714196865002, 6.362489851231747, 0.16582114507640053], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 181.68800000000022, 159, 216, 179.0, 202.0, 204.0, 207.99, 0.329049763511935, 0.6377620665427465, 0.23521916688548475], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.117999999999996, 5, 23, 7.0, 9.0, 10.0, 12.990000000000009, 0.3289748551359225, 0.26848396111879086, 0.2030391684042022], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 7.073999999999995, 5, 18, 7.0, 9.0, 10.0, 16.0, 0.32897355644758564, 0.27362311304880194, 0.2081785786894878], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.432000000000006, 5, 18, 8.0, 10.0, 11.0, 13.990000000000009, 0.32897182487908644, 0.26623265722221456, 0.20078846733342676], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.792000000000009, 7, 20, 10.0, 12.0, 13.0, 14.990000000000009, 0.3289724742151374, 0.294182992542523, 0.22873867347771276], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.059999999999999, 5, 48, 8.0, 9.0, 11.0, 21.940000000000055, 0.32894715200845265, 0.24693844259806408, 0.18149916102028882], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1633.684000000001, 1430, 1980, 1606.5, 1847.5000000000002, 1914.8, 1960.95, 0.3286442373547557, 0.27463296908870893, 0.20925394800322333], "isController": false}]}, function(index, item){
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
