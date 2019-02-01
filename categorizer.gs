function SET_CATEGORIES() {

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var tabName = getTabToCategorize();
  
  ss.setActiveSheet(ss.getSheetByName(tabName));

  var numRowsA1 = ss.getLastRow();
  var numRows = numRowsA1 -2; // Restamos las 2 filas de cabecera (creo)
  
  var categoriaColumn = getCategoriaColumn(tabName,numRowsA1);
  var descripcionColumn = tabName+'!G3:G'+numRowsA1;
  var cat1Column = getCat1Column(tabName, numRowsA1);//tabName+'!H3:H'+numRowsA1;
  var cat2Column = tabName+'!I3:I'+numRowsA1;
  var esHuchaColumn = tabName+'!J3:J'+numRowsA1;
  var esCategorizadaColumn = tabName+'!K3:K'+numRowsA1;
  var precioColumn = getPriceColumn(tabName, numRowsA1);
  var iftttDataColumn = getIFTTTDataColumn(tabName, numRowsA1);

  var rangeCat1 = ss.getRange(cat1Column).getValues();
  var rangeCat2 = ss.getRange(cat2Column).getValues();
  var rangeEsHucha = ss.getRange(esHuchaColumn).getValues();
  var rangeCategoria = ss.getRange(categoriaColumn).getValues();
  var rangeDescripcion = ss.getRange(descripcionColumn).getValues();
  var rangeCategorizada = ss.getRange(esCategorizadaColumn).getValues();
  var rangePrecio = ss.getRange(precioColumn).getValues();
  var rangeIftttData = ss.getRange(iftttDataColumn).getValues();
  
  // TODO: Get config!A1 cell value, we should get "config" sheet/tab
  ss.setActiveSheet(ss.getSheetByName("config"));

  var configNumRows = ss.getLastRow();
  var config_categoriaColumn = getCategoriaConfigColumn("config", configNumRows);
  var config_CAT1Column = getCAT1ConfigColumn("config", configNumRows);
  var config_rangeCategoria = ss.getRange(config_categoriaColumn).getValues();
  var config_rangeCAT1 = ss.getRange(config_CAT1Column).getValues();

  ss.setActiveSheet(ss.getSheetByName(tabName));

  
  var segments, categoriaCell, descripcionCell, iftttDataCell;

  var i = 0;
  while (i < numRows) { 
    if (rangeCategorizada[0,i] != "true") {
      categoriaCell = (rangeCategoria[0,i] === undefined) ? "" : rangeCategoria[0,i].join();
      descripcionCell = (rangeDescripcion[0,i] === undefined) ? "" : rangeDescripcion[0,i].join();
      iftttDataCell = (rangeIftttData[0,i] === undefined) ? "" : rangeIftttData[0,i].join();
      
      if (iftttDataCell != "") {
        segments = iftttDataCell.split("\n");
        if (segments.length == 2) {
          rangePrecio[0,i] = [segments[0]];
          rangeCategoria[0,i] = [segments[1]];
          categoriaCell = segments[1];
        } else if (segments.length == 3) {
          rangePrecio[0,i] = [segments[0]];
          rangeCategoria[0,i] = [segments[1]];
          categoriaCell = segments[1];
          rangeDescripcion[0,i] = [segments[2]];
          descripcionCell = segments[2];
        }
      }
        
      if (categoriaCell != "") {
        // Cálculo CAT1
        rangeCat1[0,i] = 
          [SET_CAT_1(categoriaCell, descripcionCell, config_rangeCategoria, config_rangeCAT1, configNumRows)];
        
        var cat1 = rangeCat1[0,i].join();
        // Cálculo CAT2
        rangeCat2[0,i] = [SET_CAT_2(
          categoriaCell,
          cat1,
          descripcionCell
        )];
        
        if ((rangeCat1[0,i] != "Desconocido") && (rangeCat2[0,i] != "Desconocido")) {
          // Cálculo esCategorizada
          rangeCategorizada[0,i] = ["true"];
          
          // Cálculo esHucha
          rangeEsHucha[0,i] = [ES_HUCHA(
            cat1,
            rangeCat2[0,i].join(),
            descripcionCell
          )];
        }
      }
    }
    i++;
  } // end while
  
  // Seteo de los nuevos valores
  ss.getRange(cat1Column).setValues(rangeCat1);
  ss.getRange(cat2Column).setValues(rangeCat2);
  ss.getRange(esHuchaColumn).setValues(rangeEsHucha);
  ss.getRange(esCategorizadaColumn).setValues(rangeCategorizada);
  ss.getRange(precioColumn).setValues(rangePrecio);
  ss.getRange(categoriaColumn).setValues(rangeCategoria);
  ss.getRange(descripcionColumn).setValues(rangeDescripcion);
}


function SET_CAT_1(categoria, desc, config_rangeCategoria, config_rangeCAT1, configNumRows) {
  //if (IS_SUPERMERCADO(categoria)) return "Supermercado";
  if (IS_COMER_FUERA(categoria)) return "Comer fuera";
  if (IS_FACTURAS_MENSUALES(categoria)) return "Facturas mensuales";
  if (IS_TRANSPORTE(categoria)) return "Transporte";
  if (IS_RETURN_CATEGORIA_AS_CAT_1(categoria)) return categoria;

  var i = 0;
  while (i < configNumRows) {
    if (categoria == config_rangeCategoria[0,i]) {
      return config_rangeCAT1[0,i];
    }
    i++;
  }
  
  switch (categoria) {
    case "Navidad":
      return "Vacaciones";
    case "Comer ocio":
    case "Comer fuera ocio":
      return "Comer fuera";
    case "Capricho":
    case "Caprichos":
      return "Paga la casa";
    case "Podólogo":
      return "Médico";
    case "Bautizo":
      return "Pau";
    case "Halloween":
      return "Pau";
    case "Cuidado":
    case "Cuidado facial":
    case "Limpieza facial":
      return "Belleza";
    case "Farmacia":
    case "Dentista":
      return "Salud";
    case "Gasto mensual Thais":
    case "Gasto mensual T":
      return "Gasto mensual T";
    case "Gasto mensual Ruben":
    case "Gasto mensual Rub":
    case "Gasto mensual R":
      return "Gasto mensual R";  
    case "Videojuego":
    case "Videojuegos":
      return "Gasto mensual R";
    case "Alejandra":
      return "Limpieza";
    case "Libro":
      return "Cultura";
    case "Vacaciones - Hotel":
    case "Vacaciones - Comida":
    case "Vacaciones - Transporte":
    case "Vacaciones - Ocio":
    case "Vacaciones":
      return "Vacaciones";
    case "Regalo":
    case "Regalos":
      return "Regalos";
    case "Tomar algo":
      return "Ocio";
    case "Papelería":
      return "Gasto fortuito";
    case "Niñera":
    case "Canguro":
      return "Pau";
    case "Suscripción anual":
    case "Seguro":
      return "Suscripción anual";
    default:
      if (categoria.indexOf("Pau") > -1) {
        return "Pau";
      } else if (categoria.indexOf("kindle") > -1) {
        return "Cultura";
      }
      return "Desconocido";
  }
}

function SET_CAT_2(categoria, cat1, desc) {
  //if (descIsHucha(desc)) return "Hucha";
  switch (categoria) {
    case "Donaciones":
      return "Donaciones";
    case "Navidad":
      return "Navidad";
    case "Comer ocio":
    case "Comer fuera ocio":
      return "Ocio";
    case "Lotería":
      return desc; // en Desc debería ir el nombre de la lotería en cuestión
    case "Carne":
    case "Bon area":
      return "Bon Area";
    case "Mercadona":
    case "Caprabo":  
    case "Bon Area":
    case "Cuidado":
    case "Alquiler":
    case "Bautizo":
    case "Suscripción anual":
    case "Seguro":
    case "Fruta y verdura":
    case "Fruta y Verdura":
    case "Halloween":
    case "Higiene":
      return categoria;
    case "Limpieza facial":
    case "limpieza facial":
    case "Cuidado facial":
    case "cuidado facial":
      return "Limpieza facial";
    case "Farmacia":
      return "Gasto fortuito";
    case "Limpieza":
    case "Alejandra":
      return "Hogar";
    case "Movil Thais":
    case "Movil Rub":
    case "Agua BCN":
      return "Utilities";
    case "Vacaciones - Hotel":
      return "Hotel";
    case "Vacaciones - Comida":
      return "Comida";
    case "Vacaciones - Transporte":
      return "Transporte";
    case "Vacaciones - Ocio":
      return "Ocio";
    case "Gasto mensual":
        return categoria + " Desconocido";
    case "Spotify":
    case "Apple Music":
    case "iCloud":
      return "Suscripciones";
  }
  
  switch (cat1) {
    case "Médico":
      return desc;
    case "Gasto mensual R":
      return "Gasto mensual R";
    case "Gasto mensual T":
      return "Gasto mensual T";
    case "Comer fuera":
      if (categoria.indexOf("Thais") > -1 || 
          desc.indexOf("Thais") > -1 ||
          desc.indexOf("Infusión") > -1
        ) {
        return categoria + " T";
      }
      if (categoria == "Restaurante") return "Comida";
      return categoria; 
    case "Supermercado":
      if (desc.indexOf("Paleobull") > -1) {
        return "Paleo";
      }
      switch (desc) {
        case "Mercadona":
        case "Caprabo":  
        case "Bon Area":
        case "Supermercado":
        case "Mercado":
        case "La Sirena":
        case "Ulabox":
          return desc;
        case "Frutos secos":
          return "Mercado";
      }
      switch (categoria) {
        case "Mercadona":
        case "Caprabo":  
        case "Bon Area":
        case "Supermercado":
        case "Mercado":
        case "La Sirena":
        case "Ulabox":
          return categoria;
        case "Frutos secos":
          return "Mercado";
        default:
          return "Supermercado";
      }
    case "Cultura":
    case "Belleza":
    case "Salud":
      return categoria;
    case "Transporte":
      if (categoria.indexOf("T50") > -1) return "Metro";
      return categoria;
    case "Facturas mensuales":
      switch(categoria) {
        case "Endesa":
        case "Gas":
        case "Movil Thais":
        case "Movil Rub":
        case "Telefónica":
        case "O2":
          return "Utilities";
        default:
          return cat1;
      }
    case "Gasto fortuito":
    case "Ropa":
    case "Paga la casa":
      return cat1; 
    case "Hogar":
      if (categoria == "Hogar") return "Gasto fortuito";
    case "Limpieza":
      return "Limpieza";
    case "Pau":
      if (desc.indexOf("Ropa") > -1) {
        return "Ropa";
      } else if (categoria.indexOf("Cumpleaños") > -1) {
        return "Cumpleaños";
      } else if (categoria.indexOf("Regalo") > -1) {
        return "Regalos";
      } else if (desc.indexOf("MaLuz") > -1) {
        return "Canguro";
      } else if (desc.indexOf("Ocio") > -1) { 
        return "Ocio";
      } else {
        return cat1;
      }
    case "Regalos":
      return "Gasto fortuito";
    case "Ocio":
      return "Gasto fortuito";
    default:
      if (desc.indexOf("Hucha") > -1 || desc.indexOf("hucha") > -1) {
        return "Hucha";
      } else {
        return "Desconocido";
      }
  }
}


function IS_RETURN_CATEGORIA_AS_CAT_1(v) {
  switch (v) {
    case "Hogar":
    case "Limpieza":
    case "Pau":
    case "Salud":
    case "Cultura":
    case "Ocio":
    case "Hucha":
    case "Ropa":
    case "Renta":
    case "Higiene":
    case "Donaciones":
    case "Lotería":
    case "Formación":
      return true;
  }
  return false;
}

function IS_FACTURAS_MENSUALES(v) {
  switch (v) {
    case "Alquiler":
    case "Spotify":
    case "Apple Music":
    case "iCloud":
    case "Movil Thais":
    case "Movil Rub":
    case "Agua":
    case "Agua BCN":
    case "Gas":
    case "Telefónica":
    case "O2":
    case "Endesa":
      return true;
  }
  return false;
}

function IS_TRANSPORTE(v) {
  switch (v) {
    case "Taxi":
    case "Bus":
    case "Metro":
    case "T10":
    case "T-10":
    case "T-10 metro":
    case "T50":
    case "T-50":
    case "T-50 metro":
    case "Transporte":
    case "Patinete":
      return true;
  }
  return false;
}

function IS_COMER_FUERA(v) {
  switch (v) {
    case "Almuerzo":
    case "Comer fuera":
    case "Comida":
    case "Desayuno":
    case "Merienda":
    case "Restaurante":
    case "Tento":
      return true;
  }
  return false;
}

function IS_SUPERMERCADO(v) {
  switch (v) {
    case "Bon area":
    case "Bon Area":
    case "Carrefour":
    case "Caprabo":
    case "Carne":
    case "Fruta y verdura":
    case "Fruta y Verdura":
    case "Mercadona":
    case "Supermercado":
    case "Alimentación":
    case "La Sirena":
    case "Ulabox":
    case "Veritas":
    case "Frutos secos":
    case "Fruteria":
    case "Fruta":
    case "Frutas":
    case "Verdura":
    case "Verduras":
    case "Makro":
      return true;
  }
  return false;
}

function ES_HUCHA(cat1, cat2, desc) {
  if (descIsHucha(desc)) return "true";
  switch (cat1) {
    case "Vacaciones":
      return "true";
    case "Renta":
      if (descIsHucha(desc)) return "true";
      return "false";
    default:
      return "false";
  }
}

function descIsHucha(desc) {
  if (desc.indexOf("Hucha") > -1 || desc.indexOf("hucha") > -1) {
    return true;
  }
  return false;
}