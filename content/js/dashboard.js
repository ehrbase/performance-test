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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8722612210168049, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.758, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.773, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.466, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 462.92920655179944, 1, 19943, 11.0, 1005.0, 1854.0, 10459.0, 10.715531251923258, 67.49993972015048, 88.67193554696848], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10540.693999999998, 9122, 19943, 10416.0, 11235.6, 11466.65, 19309.91000000006, 0.2306158180312051, 0.13397427763054237, 0.11620875205478692], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.9319999999999995, 2, 14, 3.0, 4.0, 5.0, 7.990000000000009, 0.23157840133092739, 0.11888972789422055, 0.08367578954340149], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.209999999999998, 2, 16, 4.0, 5.0, 6.0, 9.990000000000009, 0.23157689974109702, 0.13291021459652355, 0.0976965045782753], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.004000000000005, 10, 417, 14.0, 19.0, 22.0, 41.98000000000002, 0.23031943463027743, 0.11981783791200691, 2.5341885449016948], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.467999999999996, 25, 79, 44.0, 54.0, 56.0, 57.0, 0.23152360591533552, 0.9628827106911119, 0.09631743761712201], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.592000000000001, 1, 14, 2.0, 4.0, 4.0, 9.990000000000009, 0.23152950241531578, 0.14464036913095862, 0.0979026118611638], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.47399999999996, 23, 59, 39.0, 48.0, 49.0, 56.0, 0.23152092578735636, 0.9502102636872856, 0.08410721132118805], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1027.7780000000002, 740, 1451, 1023.0, 1250.0000000000005, 1379.8, 1410.97, 0.23144826436946547, 0.9788430790893436, 0.11255980044530646], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.842000000000003, 4, 39, 7.0, 9.0, 10.0, 14.0, 0.23146551464736925, 0.34419419317255434, 0.11821920328181065], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.351999999999998, 3, 17, 4.0, 5.0, 6.0, 12.990000000000009, 0.230434498072185, 0.2222680254793729, 0.1260188661332262], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 9.370000000000005, 6, 33, 9.0, 12.0, 13.0, 18.980000000000018, 0.23152038976920658, 0.3772855367302468, 0.15125697339413985], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.9165618379237289, 2505.9110997086864], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.8740000000000006, 3, 20, 5.0, 6.0, 7.0, 13.0, 0.23043556007823748, 0.23149547364070672, 0.13524587070998118], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 9.467999999999995, 6, 19, 9.0, 12.0, 13.0, 16.99000000000001, 0.23151996095647379, 0.36371921522489153, 0.13769107052977786], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.368000000000003, 5, 17, 7.0, 9.0, 9.0, 14.0, 0.23151963934796663, 0.3582924684288244, 0.13226463771343797], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2039.0319999999992, 1641, 2731, 1970.0, 2442.7000000000003, 2560.0, 2662.98, 0.23128349852371743, 0.35318390573879116, 0.12738661442126623], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.395999999999997, 10, 80, 13.0, 17.0, 20.94999999999999, 41.97000000000003, 0.23031444831628625, 0.11981524390875863, 1.8569102395500576], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.037999999999995, 9, 36, 14.0, 17.0, 19.0, 26.99000000000001, 0.23152135460366322, 0.4191146975023013, 0.19308519221828943], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 9.446000000000007, 6, 25, 9.0, 12.0, 13.0, 17.0, 0.23152092578735636, 0.3919825627410133, 0.16595347610148395], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 71.0, 71, 71, 71.0, 71.0, 71.0, 71.0, 14.084507042253522, 6.643375880281691, 1920.8846830985917], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.8802033918406071, 3628.924780597723], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.882000000000004, 2, 18, 3.0, 4.0, 4.0, 8.990000000000009, 0.23043747171380036, 0.19369124636600107, 0.09744084497273002], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 691.9460000000005, 506, 888, 676.0, 826.0, 838.0, 867.95, 0.23037928724334594, 0.20286651084003662, 0.10664041225912695], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.7579999999999973, 2, 20, 4.0, 5.0, 5.0, 10.0, 0.23043556007823748, 0.20876696625017743, 0.11251736331945189], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 931.0280000000001, 712, 1202, 895.0, 1131.7, 1156.0, 1179.98, 0.2303586961329225, 0.21792067629972986, 0.12170317832803816], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 80.0, 80, 80, 80.0, 80.0, 80.0, 80.0, 12.5, 5.92041015625, 823.08349609375], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 31.083999999999982, 20, 1427, 27.0, 33.0, 36.0, 103.94000000000005, 0.23016411161486364, 0.11973703505698634, 10.498989896025664], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 38.840000000000025, 26, 268, 37.0, 44.0, 50.0, 121.97000000000003, 0.23039404293162594, 52.10836243618085, 0.07109816168593144], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 1.2339154411764706, 0.9650735294117647], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.276000000000004, 2, 12, 3.0, 4.0, 5.0, 7.990000000000009, 0.2315471937174763, 0.25160632609509087, 0.09926681449411337], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.9600000000000035, 3, 10, 4.0, 5.0, 6.0, 7.0, 0.23154676480544747, 0.23758642700071456, 0.08524719758950555], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2200000000000006, 1, 11, 2.0, 3.0, 4.0, 7.0, 0.23157893761772896, 0.1313283250624916, 0.08978206858812343], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 127.58399999999993, 89, 168, 127.0, 153.90000000000003, 158.0, 163.99, 0.23156713988183592, 0.21092283890545624, 0.0755306882036457], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 101.33399999999999, 70, 498, 98.0, 115.0, 124.0, 411.7700000000002, 0.23035604290703798, 0.11983688243848457, 68.1147521795137], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 252.518, 15, 440, 315.0, 413.0, 420.0, 433.97, 0.2315450491732221, 0.12904792481801716, 0.09700471298370339], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 498.8900000000002, 370, 646, 494.5, 594.0, 612.0, 633.96, 0.23152392753486287, 0.12451420130148862, 0.09857854727070334], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.502, 5, 286, 7.0, 10.0, 12.949999999999989, 28.980000000000018, 0.23013582616460235, 0.10376563701021342, 0.16698331917998002], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 466.8039999999997, 324, 610, 481.0, 550.9000000000001, 560.0, 584.99, 0.23150859799782106, 0.11907997426897689, 0.09314603747568581], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.183999999999998, 2, 15, 4.0, 5.0, 6.0, 11.980000000000018, 0.23043640969012755, 0.14148210462527355, 0.11521820484506379], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.6480000000000015, 3, 32, 4.0, 6.0, 6.0, 10.990000000000009, 0.23043343607592134, 0.13495433198153398, 0.10869077111784181], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 775.1319999999995, 553, 1143, 728.5, 983.9000000000001, 1099.95, 1138.99, 0.23035487550701106, 0.21049351617252476, 0.1014551258336543], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 280.8579999999997, 185, 378, 274.0, 340.0, 347.0, 369.0, 0.23039531689263074, 0.20400560330050507, 0.09472307462089602], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.14, 3, 39, 5.0, 6.0, 7.0, 11.990000000000009, 0.23043662209407897, 0.15363416627914908, 0.10779213084283577], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1238.8400000000004, 960, 10462, 1130.5, 1492.9, 1506.95, 1538.97, 0.23033407654462032, 0.173135197321445, 0.12731356184009285], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 166.46799999999996, 144, 202, 167.0, 185.0, 187.0, 194.99, 0.2315692848353149, 4.477317495470505, 0.11668920993654538], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 226.048, 196, 290, 221.5, 253.0, 254.0, 263.99, 0.23155352035448065, 0.4487954954909583, 0.1655245868158983], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 8.346, 5, 19, 8.0, 11.0, 11.0, 15.0, 0.23146294301428635, 0.1889022422914739, 0.14285603514162987], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.323999999999995, 5, 24, 8.0, 11.0, 12.0, 16.980000000000018, 0.23146369306803274, 0.19251947463181068, 0.14647311826961446], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.414000000000007, 6, 21, 9.0, 12.0, 13.0, 17.99000000000001, 0.23146090717862117, 0.1873183285039015, 0.1412725263541389], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 11.669999999999996, 8, 29, 11.0, 15.0, 16.0, 21.980000000000018, 0.23146165721917336, 0.20698413489469653, 0.16093818353520647], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.816000000000017, 5, 41, 9.0, 11.0, 12.0, 15.0, 0.23144901432808268, 0.1737472380899809, 0.12770380185094407], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2053.2999999999997, 1698, 2738, 1988.5, 2525.3000000000006, 2673.95, 2730.0, 0.2312626385031942, 0.19325561757184406, 0.1472492581094557], "isController": false}]}, function(index, item){
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
