/*Añadir la fecha de inserción del gasto en la columna Date */

//CORE VARIABLES
// The column you want to check if something is entered.
var PriceCOLUMNTOCHECK = 5; //La columna del precio
// Where you want the date time stamp offset from the input location. [row, column]
var DATETIMELOCATION = [0,-4];
// Sheet you are working on
var SHEETNAME = getTabToCategorize();

var CAT1_COLUMN = 'B';
var CAT2_COLUMN = 'C';
var CATEGORIA_COLUMN = 'D';
var DESCRIPCION_COLUMN = 'E';

function runDaily() {
  var tabName = getTabToCategorize();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setActiveSheet(ss.getSheetByName(tabName));
  
  var numRowsA1 = ss.getLastRow();
  var numRows = numRowsA1 -2; // Restamos las 2 filas de cabecera (creo)
  
  var priceColumn = getPriceColumn(tabName, numRowsA1);
  var dateColumn = getDateColumn(tabName, numRowsA1);
  var date2Column = getDate2Column(tabName, numRowsA1);
  var timestampColumn = getTimestampColumn(tabName, numRowsA1);
  
  var rangePrice = ss.getRange(priceColumn).getValues();
  var rangeDate = ss.getRange(dateColumn).getValues();
  var rangeDate2 = ss.getRange(date2Column).getValues();
  var rangeTimestamp = ss.getRange(timestampColumn).getValues();  

  var i = 0;  
  var date = new Date();
  var mt = date.getMonth();
  var months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  var year = " 2018";
  var monthFriendly = months[mt] + year;
  var idxStartHour;
  var timestampDate;
  var timestamp;
  
  while (i < numRows) {    
    // Si tenemos precio pero no tenemos fecha 
    if ((rangePrice[0,i] != "") && (rangeDate[0,i] == "")) {
      idxStartHour = rangeTimestamp[0,i][0].indexOf(" at ");
      // Si tenemos timestamp de IFTTT lo ponemos
      if (idxStartHour > -1) {
        timestampDate = rangeTimestamp[0,i][0].substring(0, idxStartHour);
        timestamp = moment(timestampDate, "MMM DD, YYYY").toDate();
        rangeDate[0,i] = [timestamp];
      } else {
        rangeDate[0,i] = [date]; // informamos la fecha
        // TODO: Si ponemos tocamos esta columna me formatea todos los valores a fecha
        //rangeDate2[0,i] = [monthFriendly]; // informamos la fecha friendly      
      }
    }
    
    // Si no tenemos precio
    if (rangePrice[0,i] == "") {
      rangeDate[0,i] = [""]; // borramos la fecha
      //rangeDate2[0,i] = [""]; // borramos la fecha
    }
    i++;
  } // end while
  ss.getRange(dateColumn).setValues(rangeDate);
  //ss.getRange(date2Column).setValues(rangeDate2);
}

function onEdit(e) {

  /*Añadimos la fecha de modificación al editar*/
  var ss = e.source;
  var sheet = ss.getActiveSheet();
  var weHaveANewExpenseValue = false;

  if (sheet.getSheetName() == "Run") {
    if (e.range.getA1Notation() == 'B2') {
      // Drop
      var info = ss.getRange('B3');
      if (/^\w+$/.test(e.value)) { // Security check
        if (e.value == "NONE") return; // False execution check
        info.setValue('Loading...');
        eval(e.value)(); // Execute function
        e.range.clear(); // Clean cell
        info.clear();
      }
    }
  }
  
  //checks that we're on the correct sheet.
  if( sheet.getSheetName() == SHEETNAME ) { 
    var selectedCell = ss.getActiveCell();
    
    var row = selectedCell.getRow();
    
    // Cogemos las celdas que corresponden a CAT1, CAT2, Categoria y Descripción
    //  con las celdas podremos coger valor y setear el nuevo calculado
    var cat1Cell = ss.getRange(CAT1_COLUMN+row).getCell(1,1);
    var cat2Cell = ss.getRange(CAT2_COLUMN+row).getCell(1,1);
    var categoriaCell = ss.getRange(CATEGORIA_COLUMN+row).getCell(1,1);
    var descripcionCell = ss.getRange(DESCRIPCION_COLUMN+row).getCell(1,1);
    
    //checks the column to ensure it is on the one we want to cause the date to appear.
    
    
    if( selectedCell.getColumn() == PriceCOLUMNTOCHECK) { 
      //var dateTimeCell = selectedCell.offset(DATETIMELOCATION[0],DATETIMELOCATION[1]);
      //dateTimeCell.setValue(new Date());
      
      //Si borramos el gasto de la celda se borrará la fecha de inclusión
      if (selectedCell.getDisplayValue() == "") { 
        //dateTimeCell.clear();
        weHaveANewExpenseValue = false;
      } else {
        weHaveANewExpenseValue = true;
      }
    }
    
    
    /*
    var categoriaColumn = getCategoriaColumn(SHEETNAME,row);
    var cat1Column = getCat1Column(SHEETNAME, row);    
    var rangeCat1 = ss.getRange(cat1Column).getValues();
    var rangeCategoria = ss.getRange(categoriaColumn).getValues();
    
    
    categoriaCell = (rangeCategoria[0,row] === undefined) ? "" : rangeCategoria[0,row].join();
    // Cálculo CAT1
//    rangeCat1[0,row] = [SET_CAT_1(categoriaCell)];
    ss.getRange(cat1Column).setValues([SET_CAT_1(categoriaCell)]);
    
    */
    if (weHaveANewExpenseValue) { 
      createNewsheet();
      

    }
      
  }
}

/*Crear un nuevo tab de mes en el excel*/
function createNewsheet()
{
  var monthNames = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  var monthsToAdd = 1;
  var currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() + monthsToAdd);

  var sheetName = monthNames[currentDate.getMonth()]+" "+currentDate.getFullYear();
  var sheetsArray = spreadsheet.getSheets();
  var creationFlag = false;
  //Logger.log(sheetsArray)
  for(var itr in sheetsArray)
  {
    if(sheetsArray[itr].getSheetName() == sheetName)
    {
      creationFlag = false;
      break;
    }
    else
      creationFlag = true;
  }

  if(creationFlag)
    spreadsheet.insertSheet(sheetName);
    copySheetValuesWithSheetName(sheetName);

  if(!creationFlag)
    Logger.log("Worksheet Exists");
  
}

function copySheetValuesWithSheetName(sheetName){
  
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var copySheet = spreadsheet.getSheetByName("Template");
  var pasteSheet = spreadsheet.getSheetByName(sheetName);

  // get source range
  var source = copySheetgetRange(1, 1, 5, 5); //row, column, numrows, numcolums
  // get destination range
  var destination = pasteSheet.getRange(1, 1, 5, 5); //.setValues(sheetValues);
  // copy values to destination range
  source.copyTo(destination);
  
}

/**
 * https://gist.github.com/hlecuanda/326aa8c5d61260551336
 * 
 * Test function for onEdit. Passes an event object to simulate an edit to
 * a cell in a spreadsheet.
 *
 * Check for updates: http://stackoverflow.com/a/16089067/1677912
 *
 * See https://developers.google.com/apps-script/guides/triggers/events#google_sheets_events
 * 
 * on Script editor, set to debug THIS function, but create breakpoints
 * on the onEdit Function
 */
function test_onEdit() {
  onEdit({
    user : Session.getActiveUser().getEmail(),
    source : SpreadsheetApp.getActiveSpreadsheet(),
    range : SpreadsheetApp.getActiveSpreadsheet().getActiveCell(),
    value : SpreadsheetApp.getActiveSpreadsheet().getActiveCell().getValue(),
    authMode : "LIMITED"
  });
}