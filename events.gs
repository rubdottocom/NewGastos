/* onEdit tab Run, para lanzar categorización desde el móvil */
/*
function onEdit(e) {

  var ss = SpreadsheetApp.getActiveSheet();
  var tabName = ss.getActiveSheet().getName();
  if (tabName.getName() == "Run") {
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

  // Tabs normales de mes
  if (e.range.getA1Notation() == 'E1') {
    Logger.log("onEdit checkbox");
    ss.getRange('D1').setValue('Loading...');
    // Checkbox para seleccionar todos los checkbox de "Categorizada"
    var categorizadaColumn = tabName+'!E3:E'+numRowsA1;
    var numRowsA1 = 96; // hack pa tirar millas
    var numRows = numRowsA1 -2;
    var rangeCategorizada = ss.getRange(categorizadaColumn).getValues();
    var i = 0;
    while (i < numRows) {
      if (rangeCategorizada[0,i] == ["TRUE"]) {
        rangeCategorizada[0,i] = ["FALSE"];
      } else {
        rangeCategorizada[0,i] = ["TRUE"];
      }
      i++;
    }
    rangeCategorizada.setValues(rangeCat1);
  }
}
*/