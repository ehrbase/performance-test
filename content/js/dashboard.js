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

    var data = {"OkPercent": 97.800467985535, "KoPercent": 2.1995320144650075};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8999361837906829, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.96, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.499, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.991, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.975, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.719, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.655, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 517, 2.1995320144650075, 188.5959583067425, 1, 3154, 16.0, 542.9000000000015, 1225.9000000000015, 2222.0, 26.104600540194756, 172.98661509305143, 216.2287456749158], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 25.726000000000006, 15, 84, 27.0, 30.0, 32.0, 43.0, 0.5654701318676347, 0.3283768992728054, 0.28494393363642534], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 7.559999999999993, 4, 33, 7.0, 10.0, 12.0, 18.99000000000001, 0.5652623665274237, 6.043011299241418, 0.20424519103041677], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.9219999999999935, 4, 36, 8.0, 10.0, 11.0, 20.99000000000001, 0.5652425568860109, 6.069445409085822, 0.23846170368628586], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 21.836, 14, 287, 20.0, 27.0, 31.94999999999999, 48.960000000000036, 0.5619789752425782, 0.30345876809431804, 6.256406560317766], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 45.220000000000034, 28, 75, 46.0, 56.900000000000034, 59.0, 69.96000000000004, 0.5650106956524686, 2.349949006019059, 0.23505327768354656], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.3800000000000034, 1, 8, 2.0, 3.0, 4.0, 7.0, 0.5650496452618327, 0.35312402352358174, 0.23893212538903666], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.677999999999955, 24, 66, 40.5, 50.0, 52.0, 56.98000000000002, 0.5649998418000444, 2.3189734327186886, 0.20525384877892233], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 789.0719999999995, 563, 1108, 787.5, 945.4000000000002, 972.8499999999999, 1006.95, 0.5646546515685541, 2.3880105430904903, 0.27460743796986326], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 11.463999999999992, 7, 31, 12.0, 14.0, 16.0, 22.980000000000018, 0.5648677136301449, 0.8399064370771259, 0.2885017717075838], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.2979999999999987, 1, 19, 3.0, 5.0, 6.0, 14.990000000000009, 0.5628323525041536, 0.5430133984352135, 0.3077989427757091], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 18.078000000000017, 11, 64, 19.0, 23.0, 24.0, 28.99000000000001, 0.5649877115172746, 0.9206397514760304, 0.3691179482471256], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 642.0, 642, 642, 642.0, 642.0, 642.0, 642.0, 1.557632398753894, 0.6647317951713395, 1842.352085767134], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.153999999999992, 2, 26, 4.0, 5.0, 7.0, 10.990000000000009, 0.562841856072332, 0.565558227608181, 0.33033980029245263], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 18.874000000000002, 12, 66, 20.0, 24.0, 25.94999999999999, 31.980000000000018, 0.5649679211214388, 0.8876959149853222, 0.3360014296513244], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 10.88600000000001, 7, 36, 11.0, 14.0, 15.0, 22.980000000000018, 0.5649640908823835, 0.8744485509094793, 0.3227578058263617], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1953.1240000000003, 1490, 2422, 1952.5, 2208.8, 2264.9, 2326.86, 0.5639362752009024, 0.8612287202171155, 0.31060552657549695], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 1, 0.2, 18.629999999999995, 8, 161, 17.0, 23.0, 27.0, 48.97000000000003, 0.5619436055875177, 0.3032113795125476, 4.530670320049361], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 22.67399999999999, 14, 41, 24.0, 28.0, 29.94999999999999, 32.98000000000002, 0.5650017571554647, 1.0227381514187759, 0.47120263731520207], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 18.26, 11, 50, 19.0, 23.0, 24.0, 28.980000000000018, 0.5649979264576098, 0.9564565191014499, 0.40498874806629465], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 71.0, 71, 71, 71.0, 71.0, 71.0, 71.0, 14.084507042253522, 6.560849471830987, 1920.8846830985917], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 675.0, 675, 675, 675.0, 675.0, 675.0, 675.0, 1.4814814814814814, 0.6785300925925926, 2833.249421296296], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.197999999999997, 1, 20, 2.0, 3.0, 4.0, 8.990000000000009, 0.5628348867576208, 0.47286045353235173, 0.23799561129497052], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 415.3180000000001, 308, 567, 417.0, 494.90000000000003, 506.0, 520.98, 0.5626474136223691, 0.49529456209714445, 0.26044421294629194], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.9700000000000033, 1, 18, 3.0, 4.0, 5.0, 11.990000000000009, 0.5628995179328528, 0.5099045072630924, 0.2748532802406508], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1187.7779999999998, 924, 1507, 1188.0, 1364.9, 1415.85, 1477.94, 0.5622469186057626, 0.5318570333997159, 0.2970464677399586], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 55.0, 55, 55, 55.0, 55.0, 55.0, 55.0, 18.18181818181818, 8.504971590909092, 1197.2123579545455], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 4, 0.8, 44.57800000000003, 11, 685, 43.0, 50.0, 56.0, 111.94000000000005, 0.5615195167338431, 0.3022345897285727, 25.684034301542717], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 44.66, 10, 190, 45.0, 54.0, 60.89999999999998, 88.0, 0.562300664414465, 124.36798393738951, 0.17352247065915133], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 288.0, 288, 288, 288.0, 288.0, 288.0, 288.0, 3.472222222222222, 1.8208821614583335, 1.4241536458333335], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.0940000000000003, 1, 11, 2.0, 3.0, 4.0, 7.0, 0.5653064639402313, 0.6141513714758795, 0.2423530641306265], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.1260000000000003, 2, 16, 3.0, 4.0, 6.0, 12.0, 0.5653000725845293, 0.5800133318955868, 0.2081231712542652], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.054000000000001, 1, 13, 2.0, 3.0, 3.9499999999999886, 8.0, 0.5652764258249926, 0.32066409310441896, 0.2191550205591036], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 127.00800000000008, 86, 193, 126.0, 154.90000000000003, 161.0, 173.98000000000002, 0.5652093309278025, 0.5149487535297322, 0.1843553872362168], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 12, 2.4, 168.54400000000004, 35, 645, 169.0, 199.0, 218.95, 361.9100000000001, 0.562069946232389, 0.30076779984183355, 166.27060934845977], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.2600000000000002, 1, 13, 2.0, 3.0, 4.0, 9.0, 0.5652955987215275, 0.31518652316920537, 0.2368279412612649], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.0820000000000003, 2, 20, 3.0, 4.0, 5.0, 9.0, 0.5653467328046965, 0.30414108354920155, 0.24071403857699966], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.625999999999996, 7, 315, 10.0, 14.0, 18.0, 35.99000000000001, 0.5613398508632284, 0.23710907591111072, 0.4073003019447058], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 4.3679999999999986, 2, 61, 4.0, 5.0, 6.0, 11.970000000000027, 0.5653090205229787, 0.29083934574808473, 0.2274485512260422], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.406000000000002, 2, 17, 3.0, 4.0, 5.949999999999989, 10.0, 0.5628253834247925, 0.3456880100605037, 0.28141269171239625], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.8679999999999994, 2, 31, 4.0, 5.0, 6.0, 10.0, 0.5628070112246231, 0.32973785539855743, 0.26546463517723917], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 530.8560000000006, 374, 931, 530.0, 660.9000000000001, 670.95, 698.95, 0.5622197334628688, 0.5137129082558595, 0.24761826151538457], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.422, 6, 117, 15.0, 25.0, 32.94999999999999, 45.98000000000002, 0.5624164108609359, 0.4979010971056927, 0.2312278407934121], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 10.002, 6, 73, 10.0, 12.0, 14.0, 16.99000000000001, 0.5628526271709225, 0.3750676214664112, 0.26328750821764835], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 529.8100000000003, 417, 3154, 517.0, 576.9000000000001, 605.95, 725.97, 0.5626341179078563, 0.4227558037115847, 0.31098721751547526], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 176.07000000000002, 141, 217, 181.0, 199.0, 201.0, 214.0, 0.5653665497488641, 10.931308132048708, 0.2848917379593886], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 268.98199999999986, 209, 395, 274.0, 300.0, 306.0, 322.99, 0.5652086920053492, 1.0956117886000798, 0.4040359009256988], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 18.560000000000002, 11, 44, 19.0, 23.0, 24.0, 28.0, 0.5648358078790077, 0.46087954255077596, 0.34860960017532505], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 18.05600000000003, 11, 37, 19.0, 22.0, 24.0, 29.0, 0.5648555890201111, 0.4696575640659209, 0.35744767742678907], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 18.42399999999999, 11, 35, 20.0, 23.0, 24.0, 29.0, 0.5648141140269326, 0.4572247473727672, 0.3447351770183915], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 21.045999999999996, 13, 50, 22.0, 26.0, 27.0, 35.0, 0.5648217704903218, 0.5052187325258265, 0.39272763729405186], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 17.662000000000017, 11, 44, 18.0, 22.0, 24.0, 27.99000000000001, 0.5646285083192365, 0.42379890988585467, 0.3115381906253599], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2188.7699999999986, 1686, 2782, 2179.0, 2509.3, 2590.85, 2678.94, 0.5635625266987747, 0.4709753675273018, 0.3588308275464855], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 96.71179883945841, 2.1272069772388855], "isController": false}, {"data": ["500", 17, 3.288201160541586, 0.0723250372261221], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 517, "No results for path: $['rows'][1]", 500, "500", 17, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 4, "500", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 12, "500", 12, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
