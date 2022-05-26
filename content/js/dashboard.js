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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9159736423540105, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.002, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.994, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.857, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.726, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.727, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 192.00445353328712, 1, 3738, 13.0, 581.0, 1293.9500000000007, 2160.9900000000016, 25.650380821604838, 172.46053316117485, 225.94995627676653], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 6.782, 4, 36, 6.0, 9.0, 12.0, 16.0, 0.5938291648505392, 6.355348773312248, 0.2145671787057612], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.198, 4, 44, 7.0, 9.0, 10.0, 17.0, 0.5938002503461856, 6.375721430191655, 0.25050948061479705], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 19.886, 13, 237, 18.0, 25.900000000000034, 28.0, 45.97000000000003, 0.5896963535536281, 0.3177910505322599, 6.564978936046251], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 41.11199999999997, 26, 62, 42.0, 50.0, 52.0, 54.99000000000001, 0.5936444425975507, 2.4690739072489922, 0.24696536381499665], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.1219999999999963, 1, 20, 2.0, 3.0, 4.0, 5.0, 0.5936789811518798, 0.3710493632199248, 0.2510380848034804], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 36.09599999999999, 23, 60, 37.0, 44.0, 46.0, 48.0, 0.593626117649573, 2.4358612951022285, 0.21565323805238396], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 744.0960000000002, 564, 1083, 724.0, 892.0, 906.95, 931.96, 0.5932809743097472, 2.5092772458354644, 0.2885292238342326], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.764, 5, 22, 9.0, 11.0, 12.0, 16.99000000000001, 0.5933415214463293, 0.8824796261355073, 0.3030445465980764], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.3159999999999985, 1, 48, 3.0, 4.0, 5.0, 12.0, 0.5907058344015264, 0.5699388324108476, 0.32304225318833474], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 13.472000000000008, 9, 43, 14.0, 17.0, 18.0, 22.99000000000001, 0.593594404066834, 0.9674893167847127, 0.3878072815631952], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 587.0, 587, 587, 587.0, 587.0, 587.0, 587.0, 1.7035775127768313, 0.7270150127768313, 2014.9745128833051], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.264000000000003, 2, 23, 4.0, 5.0, 6.0, 11.980000000000018, 0.5907142089214386, 0.592929387204894, 0.34669847613455523], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 14.639999999999983, 9, 48, 15.0, 18.0, 19.0, 29.0, 0.5935796055544805, 0.9320127275339023, 0.3530175583815221], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.515999999999998, 5, 21, 9.0, 11.0, 12.0, 16.0, 0.5935739682200497, 0.9187643941687293, 0.339102315828837], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1832.8939999999998, 1475, 2332, 1836.5, 2068.8, 2149.95, 2256.92, 0.5922626803439862, 0.9045887031816351, 0.32620717940821115], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 16.90599999999999, 11, 123, 15.0, 22.0, 24.94999999999999, 44.97000000000003, 0.5896601906253465, 0.31843953653888335, 4.754135286916855], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.884000000000004, 12, 56, 18.0, 22.0, 23.0, 30.980000000000018, 0.593620479431644, 1.074777703970965, 0.495070204526], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 13.536, 9, 37, 14.0, 17.0, 18.0, 22.0, 0.5936155460788132, 1.0052044500983026, 0.42550176838071174], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 75.0, 75, 75, 75.0, 75.0, 75.0, 75.0, 13.333333333333334, 6.2109375, 1818.4375], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 580.0, 580, 580, 580.0, 580.0, 580.0, 580.0, 1.7241379310344827, 0.7896686422413793, 3297.3161368534484], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.1320000000000006, 1, 21, 2.0, 3.0, 4.0, 8.0, 0.5906137303517577, 0.49660002132115566, 0.24974193871319442], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 400.84, 305, 628, 405.5, 464.0, 472.95, 509.97, 0.5904107842072199, 0.5194000496535469, 0.2732956169084202], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.983999999999999, 1, 43, 3.0, 4.0, 5.0, 10.990000000000009, 0.5906688497787355, 0.535293645111979, 0.28841252430602315], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1165.1580000000015, 911, 1442, 1158.0, 1338.7, 1358.95, 1403.98, 0.5900401227283455, 0.558348514573991, 0.31173018202737784], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 53.0, 53, 53, 53.0, 53.0, 53.0, 53.0, 18.867924528301884, 8.82591391509434, 1242.3901827830189], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 41.969999999999985, 28, 601, 41.0, 48.0, 53.0, 84.94000000000005, 0.5892501909170618, 0.31821812068079613, 26.952441838059908], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 41.075999999999986, 29, 180, 42.0, 49.0, 56.0, 77.0, 0.5900443005260835, 133.52460510547633, 0.18208398336547107], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 278.0, 278, 278, 278.0, 278.0, 278.0, 278.0, 3.5971223021582737, 1.8863815197841725, 1.4753821942446042], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.0780000000000003, 1, 32, 2.0, 3.0, 4.0, 7.0, 0.5938891185260148, 0.6455064344916547, 0.25460676077433636], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.077999999999999, 1, 21, 3.0, 4.0, 6.0, 12.990000000000009, 0.5938820645240985, 0.6095410642722926, 0.21864603352107925], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.9100000000000013, 1, 14, 2.0, 3.0, 3.0, 6.0, 0.5938538501920524, 0.33694246773592035, 0.23023435402953593], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 116.08200000000002, 84, 158, 116.0, 140.0, 146.95, 152.99, 0.5937903777456867, 0.5410218969108649, 0.19367772086626892], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 165.66399999999987, 114, 593, 167.5, 195.90000000000003, 216.89999999999998, 323.96000000000004, 0.5897791277166702, 0.3185037672141783, 174.46749395476394], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.020000000000001, 1, 13, 2.0, 3.0, 3.9499999999999886, 6.0, 0.5938785375859787, 0.3304841268144474, 0.24880262951600088], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 446.85200000000003, 342, 558, 446.5, 522.0, 528.95, 546.97, 0.5936557200509595, 0.645159991700693, 0.25508644220939664], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 10.905999999999995, 6, 296, 9.0, 13.0, 17.0, 40.8900000000001, 0.5890731640651232, 0.24909050785175618, 0.4274232040042837], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 2.669999999999998, 1, 16, 2.0, 3.0, 5.0, 7.990000000000009, 0.5938926455898126, 0.6321708825125935, 0.24126888727086138], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.4480000000000004, 2, 20, 3.0, 4.0, 5.0, 9.0, 0.5906053586805403, 0.3627839556738866, 0.29530267934027016], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.855999999999998, 2, 32, 3.0, 5.0, 6.0, 17.950000000000045, 0.5905844305407746, 0.34604556476998505, 0.278566679639838], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 514.7779999999999, 363, 888, 519.0, 623.9000000000001, 636.95, 675.98, 0.5899670208435348, 0.5385984079739943, 0.25983899062542404], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 15.815999999999997, 6, 114, 15.0, 24.0, 30.0, 43.98000000000002, 0.5901633926368854, 0.5227326143766163, 0.24263553544934452], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 7.6179999999999986, 5, 47, 8.0, 9.0, 11.0, 14.0, 0.5907253753173672, 0.39400921029468927, 0.2763256394306825], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 521.9660000000002, 336, 3738, 506.0, 584.9000000000001, 627.95, 691.97, 0.5905188653061899, 0.44404250613844365, 0.32640007594072606], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 13.802, 9, 36, 14.0, 17.0, 17.0, 24.99000000000001, 0.5933218070683614, 0.4843916315519044, 0.36619080280000427], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 13.329999999999995, 9, 24, 14.0, 16.0, 17.0, 21.0, 0.5933288477672441, 0.4929960125334786, 0.37546591147770925], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 13.708, 9, 32, 15.0, 17.0, 18.0, 23.0, 0.5933091342314452, 0.4803254612088555, 0.36212715712368476], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 16.318000000000005, 11, 39, 17.0, 20.0, 22.0, 25.99000000000001, 0.5933133584502654, 0.5307373401762141, 0.4125381945474502], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 13.574000000000007, 8, 34, 14.0, 16.0, 18.0, 24.970000000000027, 0.5931289569115538, 0.4454259451806493, 0.3272635357959257], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2111.852, 1613, 2808, 2111.5, 2435.9, 2536.9, 2596.96, 0.5919962112242482, 0.4942012121122425, 0.37693508761543926], "isController": false}]}, function(index, item){
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
