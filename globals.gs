function getTabToCategorize() {
  return "Gastos 2019";
}
function getCAT1ContainsCategoriaConfigColumn(tabName, numRowsA1) {
  return tabName+'!F2:F'+numRowsA1;
}
function getCAT1ContainsCAT1ConfigColumn(tabName, numRowsA1) {
  return tabName+'!G2:G'+numRowsA1;
}
function getCat1Column(tabName, numRowsA1) {
  return tabName+'!H3:H'+numRowsA1;
}
function getCategoriaConfigColumn(tabName, numRowsA1) {
  return tabName+'!B2:B'+numRowsA1;
}
function getCAT1ConfigColumn(tabName, numRowsA1) {
  return tabName+'!C2:C'+numRowsA1;
}
function getCategoriaColumn(tabName, numRowsA1) {
  return tabName+'!F3:F'+numRowsA1;
}
function getPriceColumn(tabName, numRowsA1) {
  return tabName+'!E3:E'+numRowsA1;
}
function getDateColumn(tabName, numRowsA1) {
  return tabName+'!A3:A'+numRowsA1;
}
function getDate2Column(tabName, numRowsA1) {
  return tabName+'!B3:B'+numRowsA1;
}
function getTimestampColumn(tabName, numRowsA1) {
  return tabName+'!C3:C'+numRowsA1;
}
function getIFTTTDataColumn(tabName, numRowsA1) {
  return tabName+'!D3:D'+numRowsA1;
}