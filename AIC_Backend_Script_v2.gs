/**
 * ============================================================
 *  AIC Telecom Questionnaire — Google Apps Script Backend v2
 *  ครบ 17 ตัวแปร × 5 ข้อ = 85 ข้อ Likert + position_other
 * ============================================================
 *
 *  วิธีติดตั้ง / How to install:
 *  ─────────────────────────────
 *  1. เปิด Google Sheets → Extensions → Apps Script
 *  2. ลบ code เดิม → วาง code นี้ทั้งหมด → Save (Ctrl+S)
 *  3. Deploy → New deployment
 *       Type         : Web app
 *       Execute as   : Me
 *       Who has access: Anyone   ← สำคัญมาก!
 *  4. Copy Web App URL → วางใน HTML ที่บรรทัด:
 *       var SCRIPT_URL = 'PASTE_YOUR_WEB_APP_URL_HERE';
 *  5. Upload index.html ขึ้น GitHub ใหม่
 * ============================================================
 *
 *  ⚠️ ถ้าเคย Deploy แล้ว ต้อง Deploy ใหม่ (New deployment)
 *     ทุกครั้งที่แก้ไข code — อย่ากด "Manage deployments"
 * ============================================================
 */

// ── Column Headers (ลำดับต้องตรงกับ writeRow) ────────────────
var HEADERS = [
  'Timestamp', 'Language',
  'Gender', 'Age', 'Education', 'Experience',
  'Position', 'Position (Other)', 'Company Size', 'Telecom Type',
  'Mean Score',
  // AICW — AI-in-Cloud Awareness
  'AICW1','AICW2','AICW3','AICW4','AICW5',
  // AICK — AI-in-Cloud Knowledge Capability
  'AICK1','AICK2','AICK3','AICK4','AICK5',
  // TMS — Top Management Support
  'TMS1','TMS2','TMS3','TMS4','TMS5',
  // SA — Strategic Alignment
  'SA1','SA2','SA3','SA4','SA5',
  // GOV — Governance
  'GOV1','GOV2','GOV3','GOV4','GOV5',
  // CP — Competition Pressure
  'CP1','CP2','CP3','CP4','CP5',
  // PB — Perceived AI-in-Cloud Benefit
  'PB1','PB2','PB3','PB4','PB5',
  // PR — Perceived AI-in-Cloud Risk
  'PR1','PR2','PR3','PR4','PR5',
  // TR — Trust Policy Adoption
  'TR1','TR2','TR3','TR4','TR5',
  // AI — AI-in-Cloud Adoption
  'AI1','AI2','AI3','AI4','AI5',
  // CDR — Cloud & Data Readiness
  'CDR1','CDR2','CDR3','CDR4','CDR5',
  // RS — Resource Structuring
  'RS1','RS2','RS3','RS4','RS5',
  // RB — Resource Bundling
  'RB1','RB2','RB3','RB4','RB5',
  // RL — Resource Leveraging
  'RL1','RL2','RL3','RL4','RL5',
  // EXPLOR — Exploratory Innovation
  'EXPLOR1','EXPLOR2','EXPLOR3','EXPLOR4','EXPLOR5',
  // EXPLOI — Exploitative Innovation
  'EXPLOI1','EXPLOI2','EXPLOI3','EXPLOI4','EXPLOI5',
  // SVC — Sustainable Value Creation
  'SVC1','SVC2','SVC3','SVC4','SVC5'
];

var ITEM_IDS = [
  'AICW1','AICW2','AICW3','AICW4','AICW5',
  'AICK1','AICK2','AICK3','AICK4','AICK5',
  'TMS1','TMS2','TMS3','TMS4','TMS5',
  'SA1','SA2','SA3','SA4','SA5',
  'GOV1','GOV2','GOV3','GOV4','GOV5',
  'CP1','CP2','CP3','CP4','CP5',
  'PB1','PB2','PB3','PB4','PB5',
  'PR1','PR2','PR3','PR4','PR5',
  'TR1','TR2','TR3','TR4','TR5',
  'AI1','AI2','AI3','AI4','AI5',
  'CDR1','CDR2','CDR3','CDR4','CDR5',
  'RS1','RS2','RS3','RS4','RS5',
  'RB1','RB2','RB3','RB4','RB5',
  'RL1','RL2','RL3','RL4','RL5',
  'EXPLOR1','EXPLOR2','EXPLOR3','EXPLOR4','EXPLOR5',
  'EXPLOI1','EXPLOI2','EXPLOI3','EXPLOI4','EXPLOI5',
  'SVC1','SVC2','SVC3','SVC4','SVC5'
];

var CONSTRUCTS = [
  { key:'AICW',  label:'AI-in-Cloud Awareness',           ids:['AICW1','AICW2','AICW3','AICW4','AICW5'] },
  { key:'AICK',  label:'AI-in-Cloud Knowledge Capability', ids:['AICK1','AICK2','AICK3','AICK4','AICK5'] },
  { key:'TMS',   label:'Top Management Support',           ids:['TMS1','TMS2','TMS3','TMS4','TMS5'] },
  { key:'SA',    label:'Strategic Alignment',              ids:['SA1','SA2','SA3','SA4','SA5'] },
  { key:'GOV',   label:'Governance',                       ids:['GOV1','GOV2','GOV3','GOV4','GOV5'] },
  { key:'CP',    label:'Competition Pressure',             ids:['CP1','CP2','CP3','CP4','CP5'] },
  { key:'PB',    label:'Perceived AI-in-Cloud Benefit',    ids:['PB1','PB2','PB3','PB4','PB5'] },
  { key:'PR',    label:'Perceived AI-in-Cloud Risk',       ids:['PR1','PR2','PR3','PR4','PR5'] },
  { key:'TR',    label:'Trust Policy Adoption',            ids:['TR1','TR2','TR3','TR4','TR5'] },
  { key:'AI',    label:'AI-in-Cloud Adoption',             ids:['AI1','AI2','AI3','AI4','AI5'] },
  { key:'CDR',   label:'Cloud & Data Readiness',           ids:['CDR1','CDR2','CDR3','CDR4','CDR5'] },
  { key:'RS',    label:'Resource Structuring',             ids:['RS1','RS2','RS3','RS4','RS5'] },
  { key:'RB',    label:'Resource Bundling',                ids:['RB1','RB2','RB3','RB4','RB5'] },
  { key:'RL',    label:'Resource Leveraging',              ids:['RL1','RL2','RL3','RL4','RL5'] },
  { key:'EXPLOR',label:'Exploratory Innovation',           ids:['EXPLOR1','EXPLOR2','EXPLOR3','EXPLOR4','EXPLOR5'] },
  { key:'EXPLOI',label:'Exploitative Innovation',          ids:['EXPLOI1','EXPLOI2','EXPLOI3','EXPLOI4','EXPLOI5'] },
  { key:'SVC',   label:'Sustainable Value Creation',       ids:['SVC1','SVC2','SVC3','SVC4','SVC5'] }
];

// ── GET: health check ────────────────────────────────────────
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      version: '2.0',
      constructs: CONSTRUCTS.length,
      total_items: ITEM_IDS.length,
      message: 'AIC Telecom Backend v2 — 17 constructs, 85 items'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── POST: receive and save response ─────────────────────────
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss   = SpreadsheetApp.getActiveSpreadsheet();

    writeToRawSheet(ss, data);
    updateSummarySheet(ss);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    Logger.log('Error: ' + err.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Write one response row ───────────────────────────────────
function writeToRawSheet(ss, data) {
  var sheetName = 'Raw Data';
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    // Header row
    var hdrRange = sheet.getRange(1, 1, 1, HEADERS.length);
    hdrRange.setValues([HEADERS]);
    hdrRange.setBackground('#0B1929');
    hdrRange.setFontColor('#FFFFFF');
    hdrRange.setFontWeight('bold');
    hdrRange.setFontSize(11);
    sheet.setFrozenRows(1);
    sheet.setFrozenColumns(2);
    // Column widths
    sheet.setColumnWidth(1, 160); // Timestamp
    sheet.setColumnWidth(2, 80);  // Language
    sheet.setColumnWidth(3, 80);  // Gender
    sheet.setColumnWidth(4, 80);  // Age
    sheet.setColumnWidth(5, 100); // Education
    sheet.setColumnWidth(6, 120); // Experience
    sheet.setColumnWidth(7, 150); // Position
    sheet.setColumnWidth(8, 150); // Position Other
    sheet.setColumnWidth(9, 100); // Company Size
    sheet.setColumnWidth(10, 160);// Telecom Type
    sheet.setColumnWidth(11, 90); // Mean Score
    for (var c = 12; c <= HEADERS.length; c++) {
      sheet.setColumnWidth(c, 65);
    }
  }

  var d    = data.demo  || {};
  var resp = data.resp  || {};

  var row = [
    data.ts   || new Date().toLocaleString(),
    data.lang || '',
    d.gender         || '',
    d.age            || '',
    d.education      || '',
    d.experience     || '',
    d.position       || '',
    d.position_other || '',
    d.company_size   || '',
    d.telecom_type   || '',
    data.mean        || ''
  ];

  ITEM_IDS.forEach(function(id) {
    row.push(resp[id] !== undefined ? resp[id] : '');
  });

  var newRow = sheet.getLastRow() + 1;
  sheet.getRange(newRow, 1, 1, row.length).setValues([row]);

  // Alternate row shading
  var bg = (newRow % 2 === 0) ? '#F5F8FD' : '#FFFFFF';
  sheet.getRange(newRow, 1, 1, row.length).setBackground(bg);

  // Highlight Mean Score cell
  var meanCell = sheet.getRange(newRow, 11);
  var mean = parseFloat(data.mean) || 0;
  if      (mean >= 4.0) meanCell.setFontColor('#16724A').setFontWeight('bold');
  else if (mean >= 3.0) meanCell.setFontColor('#1D5FA8').setFontWeight('bold');
  else if (mean >  0)   meanCell.setFontColor('#B8861A').setFontWeight('bold');
}

// ── Build / refresh Summary sheet ───────────────────────────
function updateSummarySheet(ss) {
  var rawSheet = ss.getSheetByName('Raw Data');
  if (!rawSheet || rawSheet.getLastRow() < 2) return;

  var sheetName = 'Summary';
  var sumSheet  = ss.getSheetByName(sheetName);
  if (!sumSheet) sumSheet = ss.insertSheet(sheetName);
  sumSheet.clearContents();
  sumSheet.clearFormats();

  var rawData = rawSheet.getDataRange().getValues();
  var headers = rawData[0];
  var rows    = rawData.slice(1).filter(function(r) { return r[0]; }); // skip empty rows
  var n       = rows.length;

  // ── Title ──
  sumSheet.getRange('A1').setValue('AIC Telecom Questionnaire — Summary Report');
  sumSheet.getRange('A1').setFontSize(14).setFontWeight('bold').setFontColor('#0B1929');
  sumSheet.getRange('A2').setValue('Last updated: ' + new Date().toLocaleString());
  sumSheet.getRange('A2').setFontColor('#888888').setFontSize(10);
  sumSheet.getRange('A3').setValue('Constructs: 17   |   Items: 85   |   Scale: 1–5 Likert');
  sumSheet.getRange('A3').setFontColor('#888888').setFontSize(10);

  // ── Overall Stats ──
  var thCount = rows.filter(function(r){ return r[1]==='th'; }).length;
  var enCount = n - thCount;
  var meanIdx = headers.indexOf('Mean Score');
  var allMeans = rows.map(function(r){ return parseFloat(r[meanIdx])||0; }).filter(function(v){ return v>0; });
  var overallMean = allMeans.length ? (allMeans.reduce(function(a,b){return a+b;},0)/allMeans.length) : 0;

  var statsData = [
    ['Total Responses',   n],
    ['Thai Language (TH)',   thCount],
    ['English Language (EN)', enCount],
    ['Overall Mean Score',   overallMean.toFixed(3)]
  ];

  var statsRange = sumSheet.getRange(5, 1, statsData.length, 2);
  statsRange.setValues(statsData);
  sumSheet.getRange(5,1,statsData.length,1).setFontWeight('bold').setBackground('#E8F0FB').setFontColor('#0B1929');
  sumSheet.getRange(5,2,statsData.length,1).setBackground('#F5F8FD');
  sumSheet.getRange(4,1,1,2).setValues([['Metric','Value']]);
  sumSheet.getRange(4,1,1,2).setBackground('#1A3F6F').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(11);

  // ── Construct Summary ──
  var cHdrRow = 5 + statsData.length + 2;
  var cHdrs = [
    'Construct Code','Construct Name','N Items','N Observations',
    'Mean','Std Dev','Min','Max','Interpretation'
  ];
  sumSheet.getRange(cHdrRow, 1, 1, cHdrs.length).setValues([cHdrs]);
  sumSheet.getRange(cHdrRow, 1, 1, cHdrs.length)
    .setBackground('#0B1929').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(11);

  CONSTRUCTS.forEach(function(con, i) {
    var vals = [];
    con.ids.forEach(function(id) {
      var colIdx = headers.indexOf(id);
      if (colIdx >= 0) {
        rows.forEach(function(r) {
          var v = parseFloat(r[colIdx]);
          if (!isNaN(v) && v >= 1 && v <= 5) vals.push(v);
        });
      }
    });

    var mean = 0, sd = 0, mn = '-', mx = '-', interp = '-';
    if (vals.length > 0) {
      mean = vals.reduce(function(a,b){return a+b;},0) / vals.length;
      mn   = Math.min.apply(null, vals);
      mx   = Math.max.apply(null, vals);
      if (vals.length > 1) {
        var variance = vals.reduce(function(a,v){return a+Math.pow(v-mean,2);},0)/(vals.length-1);
        sd = Math.sqrt(variance);
      }
      if      (mean >= 4.5) interp = 'Strongly Agree';
      else if (mean >= 3.5) interp = 'Agree';
      else if (mean >= 2.5) interp = 'Neutral';
      else if (mean >= 1.5) interp = 'Disagree';
      else                  interp = 'Strongly Disagree';
    }

    var dataRow = cHdrRow + 1 + i;
    var rowData = [
      con.key, con.label, con.ids.length, vals.length,
      vals.length ? mean.toFixed(3) : '-',
      vals.length > 1 ? sd.toFixed(3) : '-',
      mn, mx, interp
    ];
    sumSheet.getRange(dataRow, 1, 1, rowData.length).setValues([rowData]);

    var bg = i % 2 === 0 ? '#F5F8FD' : '#FFFFFF';
    sumSheet.getRange(dataRow, 1, 1, rowData.length).setBackground(bg);

    // Color-code mean
    if (vals.length) {
      var meanCell = sumSheet.getRange(dataRow, 5);
      if      (mean >= 4.0) meanCell.setFontColor('#16724A').setFontWeight('bold');
      else if (mean >= 3.0) meanCell.setFontColor('#1D5FA8').setFontWeight('bold');
      else                  meanCell.setFontColor('#B8861A').setFontWeight('bold');
    }
  });

  // ── Item Summary sheet ──
  updateItemSheet(ss, rawData, headers, rows);

  // ── Column widths ──
  sumSheet.setColumnWidth(1, 90);
  sumSheet.setColumnWidth(2, 220);
  sumSheet.setColumnWidth(3, 70);
  sumSheet.setColumnWidth(4, 110);
  sumSheet.setColumnWidth(5, 70);
  sumSheet.setColumnWidth(6, 70);
  sumSheet.setColumnWidth(7, 50);
  sumSheet.setColumnWidth(8, 50);
  sumSheet.setColumnWidth(9, 130);

  // Move Summary to front
  ss.setActiveSheet(sumSheet);
  ss.moveActiveSheet(1);
}

// ── Item-level summary ───────────────────────────────────────
function updateItemSheet(ss, rawData, headers, rows) {
  var sheetName = 'Item Summary';
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) sheet = ss.insertSheet(sheetName);
  sheet.clearContents();
  sheet.clearFormats();

  var iHdrs = ['Item ID','Construct','N','Mean','Std Dev','Min','Max'];
  sheet.getRange(1,1,1,iHdrs.length).setValues([iHdrs]);
  sheet.getRange(1,1,1,iHdrs.length)
    .setBackground('#1A3F6F').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(11);
  sheet.setFrozenRows(1);

  var rowNum = 2;
  CONSTRUCTS.forEach(function(con) {
    con.ids.forEach(function(id, qi) {
      var colIdx = headers.indexOf(id);
      var vals = [];
      if (colIdx >= 0) {
        rows.forEach(function(r) {
          var v = parseFloat(r[colIdx]);
          if (!isNaN(v) && v >= 1 && v <= 5) vals.push(v);
        });
      }
      var mean='-', sd='-', mn='-', mx='-';
      if (vals.length > 0) {
        mean = (vals.reduce(function(a,b){return a+b;},0)/vals.length).toFixed(3);
        mn   = Math.min.apply(null,vals);
        mx   = Math.max.apply(null,vals);
        if (vals.length > 1) {
          var m = parseFloat(mean);
          sd = Math.sqrt(vals.reduce(function(a,v){return a+Math.pow(v-m,2);},0)/(vals.length-1)).toFixed(3);
        }
      }
      var bg = qi % 2 === 0 ? '#F5F8FD' : '#FFFFFF';
      sheet.getRange(rowNum,1,1,7).setValues([[id, con.key, vals.length, mean, sd, mn, mx]]);
      sheet.getRange(rowNum,1,1,7).setBackground(bg);
      if (vals.length) {
        var mc=sheet.getRange(rowNum,4);
        var mv=parseFloat(mean);
        if      (mv>=4.0) mc.setFontColor('#16724A').setFontWeight('bold');
        else if (mv>=3.0) mc.setFontColor('#1D5FA8').setFontWeight('bold');
        else              mc.setFontColor('#B8861A').setFontWeight('bold');
      }
      rowNum++;
    });
  });

  [80,80,60,70,70,50,50].forEach(function(w,i){ sheet.setColumnWidth(i+1,w); });
}
